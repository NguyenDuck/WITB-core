import {
	ContainerSlot,
	ItemStack,
	Player,
	RawMessage,
	TitleDisplayOptions,
	system,
} from '@minecraft/server'
import UIEnum, { encodeToHex } from './UIEnum'

export type DisplayMessage = string | RawMessage | UIEnum | (string | RawMessage | UIEnum)[]
type StrictMessage = string | RawMessage | (string | RawMessage)[]

type DisplayQueue = {
	title: StrictMessage
	subtitle?: StrictMessage
	oldItem?: ItemStack
	newItem?: ItemStack
	runNumber?: number
}

export default class Displayer {
	private queue: DisplayQueue[] = []

	private lastTitleMessage?: StrictMessage = ''
	private lastSubtitleMessage?: StrictMessage = ''

	constructor(private player: Player) {
		const n = system.runInterval(() => {
			if (!this.player.isValid()) system.clearRun(n)
			this.send()
		}, 1)
	}

	private isDuplicated(msg: DisplayMessage) {
		return (
			this.lastTitleMessage === <StrictMessage>msg ||
			this.lastSubtitleMessage === <StrictMessage>msg
		)
	}

	get empty() {
		return this.queue.length === 0
	}

	clearQueue() {
		this.queue = []
	}

	setTranslation({
		title,
		itemStack,
		subtitle,
	}: {
		title: DisplayMessage
		itemStack?: ItemStack
		subtitle?: DisplayMessage
	}) {
		if (this.isDuplicated(title)) return
		this.queue.clear()
		this.queue.enqueue({
			title: <StrictMessage>title,
			subtitle: <StrictMessage>subtitle,
			oldItem: itemStack,
			newItem: itemStack,
		})
	}

	addTranslation(title: DisplayMessage, subtitle?: DisplayMessage) {
		if (this.isDuplicated(title)) return
		this.queue.enqueue({
			title: <StrictMessage>title,
			subtitle: <StrictMessage>subtitle,
		})
	}

	private send() {
		if (!this.player.onScreenDisplay.isValid()) return

		const value = this.queue.dequeue()
		const { title, subtitle, oldItem, newItem } = value

		if (!value) return

		let settings: TitleDisplayOptions = {
			fadeInDuration: 0,
			fadeOutDuration: 0,
			stayDuration: 0,
		}

		let finalTitle: StrictMessage
		let finalSubtitle: StrictMessage

		if (typeof title === 'number') finalTitle = encodeToHex(title)
		if (Array.isArray(title))
			finalTitle = title.map(v => (typeof v === 'number' ? encodeToHex(v) : v))

		if (typeof subtitle === 'number') finalSubtitle = encodeToHex(subtitle)
		if (Array.isArray(subtitle))
			finalSubtitle = subtitle.map(v => (typeof v === 'number' ? encodeToHex(v) : v))

		if (title && title !== this.lastTitleMessage) {
			if (newItem) {
				title.i[0].setItem(title.i[2])
				system.runTimeout(() => {
					if (!this.queue.length) title.i[0].setItem(title.i[1])
				}, 1)
			}
			this.lastTitleMessage = finalTitle
			if (subtitle && subtitle !== this.lastSubtitleMessage) {
				settings.subtitle = finalSubtitle
				this.lastSubtitleMessage = finalSubtitle
			}
			this.player.onScreenDisplay.setTitle(finalTitle, settings)
		}
	}
}
