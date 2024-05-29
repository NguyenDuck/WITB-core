import { ContainerSlot, ItemStack, Player, RawMessage, TitleDisplayOptions, system } from '@minecraft/server'
import UIEnum, { encodeToHex } from './UIEnum'
import { TKey } from './types'
import { isStrictMessageEquals } from './utils'

export type DisplayMessage = string | RawMessage | UIEnum | TKey | (string | RawMessage | UIEnum | TKey)[]
export function toStrictMessage(message: DisplayMessage): StrictMessage {
	if (typeof message === 'number') return encodeToHex(message)
	else if (Array.isArray(message)) return <StrictMessage>message.map(toStrictMessage)
	else if (message instanceof TKey) return message.toString()
	return message
}
export type StrictMessage = string | RawMessage | (string | RawMessage)[]

type DisplayEntry = {
	title?: StrictMessage
	subtitle?: StrictMessage
	oldItem?: ItemStack | null
	newItem?: ItemStack | null
}

export default class Displayer {
	private currentDisplay: DisplayEntry = {
		title: undefined,
		subtitle: undefined,
		oldItem: null,
		newItem: null,
	}

	private slot: ContainerSlot

	private lastTitleMessage?: StrictMessage
	private lastSubtitleMessage?: StrictMessage

	constructor(private player: Player) {
		const n = system.runInterval(() => {
			if (!this.player.isValid()) system.clearRun(n)
			this.send()
		})
	}

	hasTitle() {
		return this.currentDisplay.title !== undefined
	}

	setTitle(title?: DisplayMessage) {
		if (!title) {
			this.currentDisplay.title = undefined
			return false
		}
		const formatedTitle = toStrictMessage(title)
		if (isStrictMessageEquals(this.lastTitleMessage, formatedTitle)) return false
		this.lastTitleMessage = formatedTitle
		this.currentDisplay.title = formatedTitle
		return true
	}

	hasSubtitle() {
		return this.currentDisplay.subtitle !== undefined
	}

	setSubtitle(subtitle?: DisplayMessage) {
		if (!subtitle) {
			this.currentDisplay.subtitle = undefined
			return false
		}
		const formatedSubtitle = toStrictMessage(subtitle)
		if (isStrictMessageEquals(this.lastSubtitleMessage, formatedSubtitle)) return false
		this.lastSubtitleMessage = formatedSubtitle
		this.currentDisplay.subtitle = formatedSubtitle
		return true
	}

	getOldItem() {
		return this.currentDisplay.oldItem
	}

	setOldItem(item?: ItemStack | null) {
		if (this.currentDisplay.oldItem === item) return
		this.currentDisplay.oldItem = item
	}

	setNewItem(item?: ItemStack) {
		if (this.currentDisplay.newItem === item) return
		this.currentDisplay.newItem = item
	}

	setSlot(slot: ContainerSlot) {
		if (this.slot && this.slot.isValid()) return
		this.slot = slot
	}

	private send() {
		if (!this.player?.onScreenDisplay.isValid()) return

		const { title, subtitle, newItem, oldItem } = this.currentDisplay

		if (!title && !subtitle) {
			if (oldItem !== null) {
				this.slot.setItem(oldItem)
				this.setOldItem(null)
			}
		}

		let settings: TitleDisplayOptions = {
			fadeInDuration: 0,
			fadeOutDuration: 0,
			stayDuration: 0,
		}

		if (title) {
			if (newItem !== null) this.slot.setItem(newItem)

			if (subtitle) {
				settings.subtitle = subtitle
				this.setSubtitle(undefined)
			}
			this.player.onScreenDisplay.setTitle(title, settings)
			this.setTitle(undefined)
		} else if (subtitle) {
			settings.subtitle = subtitle
			this.player.onScreenDisplay.setTitle(this.lastTitleMessage, settings)
			this.setSubtitle(undefined)
		}
	}
}
