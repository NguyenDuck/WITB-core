import {
	Block,
	ContainerSlot,
	EntityComponentTypes,
	ItemLockMode,
	ItemStack,
	Player,
	RawMessage,
	TitleDisplayOptions,
	system,
} from '@minecraft/server'
import { MessageData, toRawMessage } from './MessageData'
import { equals } from './utils'

type MessageSessionData = {
	title: string | RawMessage | null
	subtitle?: string | RawMessage | null
	fixed_item?: ItemStack | null
	item?: ItemStack | null
}

const WITBLocked = 'WITB Locked'

export default class DisplayWorker {
	private prev: MessageSessionData = {
		title: null,
		subtitle: null,
		fixed_item: null,
		item: null,
	}

	private curr: MessageSessionData

	private slot: ContainerSlot

	constructor(private player: Player) {
		this.resetCurrent()
		this.slot = player.getComponent(EntityComponentTypes.Inventory)?.container?.getSlot(17)
		const taskId = system.runInterval(() => {
			if (!player?.onScreenDisplay?.isValid()) return system.clearRun(taskId)
			this.tick()
		}, 1)
	}

	private resetCurrent() {
		this.curr = {
			title: null,
			subtitle: null,
			fixed_item: null,
			item: null,
		}
	}

	public lastSubtitle(): MessageData {
		return this.prev.subtitle
	}

	public hasSubtitle(): boolean {
		return !!this.curr.subtitle
	}

	public hasTitle(): boolean {
		return !!this.curr.title
	}

	public setTitle(message: MessageData) {
		const fmessage = toRawMessage(message)
		if (equals(fmessage, this.prev.title)) return false
		this.curr.title = fmessage
		return true
	}

	public setSubtitle(message?: MessageData) {
		if (!message) {
			this.curr.subtitle = null
			return true
		}
		const fmessage = toRawMessage(message)
		if (equals(fmessage, this.prev.subtitle)) return false
		this.curr.subtitle = fmessage
		return true
	}

	public setItem(item: ItemStack) {
		if (this.curr.item === item) return false
		this.curr.item = item
		return true
	}

	public setFixedItem(item?: null | ItemStack) {
		if (this.curr.fixed_item === item) return false
		this.curr.fixed_item = item
		return true
	}

	public setBlockToDisplay(block: Block | ItemStack) {
		const itemToDisplay = block instanceof ItemStack ? block : block.getItemStack(1, true)
		itemToDisplay.lockMode = ItemLockMode.slot
		itemToDisplay.setLore([WITBLocked])
		this.setItem(itemToDisplay)
	}

	private next() {
		this.prev = this.curr
		this.resetCurrent()
	}

	private tick() {
		const { title, subtitle } = this.curr
		const Citem = this.curr.item
		const Pfixed_item = this.prev.fixed_item

		if (!title && !subtitle) {
			if (Pfixed_item !== null) {
				this.slot.setItem(Pfixed_item)
				this.setFixedItem(null)
				this.next()
			}
		} else {
			const settings: TitleDisplayOptions = {
				fadeInDuration: 0,
				fadeOutDuration: 0,
				stayDuration: 0,
				subtitle,
			}

			if (this.slot.isValid()) {
				if (Pfixed_item !== null) {
					this.setFixedItem(Pfixed_item)
				} else if (this.curr.fixed_item === null) {
					this.setFixedItem(this.slot.getItem())
				}
			}

			if (title) {
				if (Citem !== null) this.slot.setItem(Citem)
				this.player.onScreenDisplay.setTitle(title, settings)

				this.next()
			} else if (subtitle) {
				this.player.onScreenDisplay.setTitle('', settings)
				this.next()
			}
		}
	}
}
