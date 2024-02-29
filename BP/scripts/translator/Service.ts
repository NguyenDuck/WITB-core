import { Block, Entity, EntityComponentTypes, ItemLockMode, Player } from '@minecraft/server'
import Displayer from '../Displayer'
import UIEnum from '../UIEnum'
import { TransEntry, TransKey } from '../types'

class TranslationService {
	private lastBlock?: string = ''
	private lastNamespace?: string = ''
	private readonly blockTrans = new Map<string, TransEntry>()
	private readonly entityTrans = new Map<string, TransEntry>()

	subscribeBlock(name: string, translation: TransEntry) {
		if (this.blockTrans.has(name)) return false
		this.blockTrans.set(name, translation)
		return true
	}

	unsubscribeBlock(name: string) {
		return this.blockTrans.delete(name)
	}

	subscribeEntity(name: string, translation: TransEntry) {
		if (this.entityTrans.has(name)) return false
		this.entityTrans.set(name, translation)
		return true
	}

	unsubscribeEntity(name: string) {
		return this.entityTrans.delete(name)
	}

	handle(player: Player, displayer: Displayer, value?: Block | Entity) {
		if (!value && this.lastBlock !== undefined) {
			this.lastBlock = undefined
			return displayer.addTranslation([UIEnum.GeneralViewDisabled])
		}
		if (value instanceof Block) return this.blockHandler(player, displayer, value)
	}

	private blockHandler(player: Player, displayer: Displayer, value: Block) {
		const namespace = (() => {
			const [prefix, name] = value.typeId.split(':')
			const isVanilla = prefix === 'minecraft'
			return {
				isVanilla,
				prefix,
				name,
				id: isVanilla ? name : value.typeId,
			}
		})()

		const defaultHandler = () => {
			if (this.lastBlock === namespace.id) return

			this.lastBlock = namespace.id

			const slot = player.getComponent(EntityComponentTypes.Inventory)?.container?.getSlot(17)

			if (slot) {
				const old = slot.getItem()
				const newItem = value.getItemStack()
				newItem.lockMode = ItemLockMode.slot
				newItem.setLore(['witb locked'])
				displayer.addTranslation(
					[UIEnum.ItemRendererChanged, new TransKey(namespace.id).toString()],
					[slot, old, newItem]
				)
			}

			if (this.lastNamespace !== namespace.prefix) {
				displayer.addTranslation([
					UIEnum.GeneralViewNamespace,
					{ translate: namespace.prefix },
				])
				this.lastNamespace = namespace.prefix
			}
		}

		if (this.blockTrans.has(namespace.id)) {
			const trans = this.blockTrans.get(namespace.id)
			if (trans.RequestPermission) {
			}
		} else if (this.blockTrans) defaultHandler()
	}
}

const translationService = new TranslationService()

export default translationService
