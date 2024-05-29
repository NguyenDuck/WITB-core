import { Block, Entity, EntityComponentTypes, ItemLockMode, ItemStack, Player } from '@minecraft/server'
import Displayer from '../Displayer'
import UIEnum from '../UIEnum'
import { HandlerParam, Message, NameTypeEntry, Permission, RefEntry, TEntry, TKey, TType } from '../types'
import { isBlockStateEquals, ln } from '../utils'
import Settings from '../Settings'

const witblocked = 'What Is This Block Locked'
const isValid = (k: string) => !new RegExp(/^[a-z_0-9]+$/).test(k)
const toPattern = (name: string) => new RegExp(name)
const uppercase = (s: string) =>
	s.replace(/(?:^|_)[a-z]+/g, w =>
		w.startsWith('_') ? ' ' + w.charAt(1).toUpperCase() + w.slice(2) : w.charAt(0).toUpperCase() + w.slice(1)
	)

type LastBlockData = {
	type: 'block'
	typeId: string
	namespace: string
	state: Record<string, string | number | boolean>
}

type LastEntityData = {
	type: 'entity'
	typeId: string
	namespace: string
}

type LastItemData = {
	type: 'item'
	typeId: string
	namespace: string
}

type LastData = LastBlockData | LastEntityData | LastItemData

class TranslationService {
	private lastData: LastData = {
		type: 'block',
		typeId: '',
		namespace: '',
		state: undefined,
	}
	private readonly translations = {
		block: {
			normal: new Map<string, TEntry>(),
			regex: new Map<RegExp, string>(),
		},
	}

	subscribeBlock(name: string, translation: TEntry) {
		if (this.translations.block.normal.has(name)) return false
		this.translations.block.normal.set(name, translation)
		if (isValid(name)) this.translations.block.regex.set(toPattern(name), name)
		return true
	}

	unsubscribeBlock(name: string) {
		if (isValid(name)) this.translations.block.regex.delete(toPattern(name))
		return this.translations.block.normal.delete(name)
	}

	handle(player: Player, displayer: Displayer, value?: Block | Entity) {
		if (value instanceof Block) {
			this.blockHandler(player, displayer, value)
		} else if (value instanceof Entity) {
			this.entityHandler(player, displayer, value)
		} else if (this.lastData.typeId !== undefined) {
			this.lastData.typeId = undefined
			if (this.lastData.type == 'block') {
				this.lastData.state = undefined
			}
			displayer.setSubtitle(undefined)
			displayer.setNewItem(null)
			displayer.setTitle([UIEnum.GeneralViewDisabled])
		}
	}

	private wrapNamespace(namespace: string) {
		const [prefix, name] = namespace.split(':')
		const isVanilla = prefix === 'minecraft'
		return {
			isVanilla,
			prefix,
			name,
			id: isVanilla ? name : namespace,
		}
	}

	private

	private blockHandler(player: Player, displayer: Displayer, value: Block) {
		try {
			let isHandledItem = false
			const namespace = this.wrapNamespace(value.typeId)
			const translationKey = new TKey(namespace.id, TType.Block)

			let t = this.translations.block.normal.get(namespace.id)

			if (!t) {
				const r = Array.from(this.translations.block.regex.entries()).find(([regex]) =>
					regex.test(namespace.id)
				)
				t = r ? this.translations.block.normal.get(r[1]) : undefined
			}

			if (Settings.debugMode) {
				const s = [value.typeId]
				const states = value.permutation.getAllStates()
				s.push(...Object.keys(states).map(k => `${k}: ${states[k]}`))
				player.onScreenDisplay.setActionBar(s.join(ln))
			}

			while (true) {
				if (Array.isArray(t)) {
					const permissions: Permission[] = []
					let callback: Function
					for (const v of t) {
						if (Array.isArray(v)) {
							permissions.push(...v)
						} else if (v instanceof Function) {
							callback = v
						} else if (typeof v === 'object') {
							if (Object.hasOwn(v, 'r')) return
							if (Object.hasOwn(v, 't')) translationKey.type = v.t
							if (Object.hasOwn(v, 'n')) translationKey.name = v.n
						}
					}
					if (callback) {
						const callbackParams: HandlerParam = namespace
						for (const p of permissions) {
							switch (p) {
								case 'state':
									{
										const temp = value.permutation.getAllStates()
										if (
											namespace.id === this.lastData.typeId &&
											isBlockStateEquals((<LastBlockData>this.lastData).state, temp)
										)
											return
										;(<LastBlockData>this.lastData).state = temp
										callbackParams[p] = (name: string) => (<LastBlockData>this.lastData).state[name]
									}
									break
								case 'redstonePower':
									{
										callbackParams[p] = value.getRedstonePower()
									}
									break
							}
						}
						const r: Message = callback.call(null, callbackParams)

						if (typeof r === 'string') {
							translationKey.name = r
							if (!displayer.hasTitle()) displayer.setTitle([UIEnum.ItemRendererChanged, translationKey])
						} else if (Array.isArray(r)) {
							console.warn(`${JSON.stringify(r)}`)
							if (r.length === 1) {
								if (!displayer.hasSubtitle())
									displayer.setSubtitle([UIEnum.GeneralViewDescription, r[0]])
							} else {
								const [title, ...description] = r
								console.warn(description)
								if (typeof title === 'string') translationKey.name = title
							}
						}
					}
				} else if (typeof t === 'object') {
					if (Object.hasOwn(t, 'r')) {
						t = this.translations.block.normal.get((<RefEntry>t).r)
						continue
					}
					if (Object.hasOwn(t, 't')) {
						translationKey.type = (<NameTypeEntry>t).t
					}
					if (Object.hasOwn(t, 'n')) {
						translationKey.name = (<NameTypeEntry>t).n
					}
				} else if (typeof t === 'string') {
					translationKey.name = t
				} else {
					;(<LastBlockData>this.lastData).state = undefined
				}
				break
			}

			if (this.lastData.type === 'block' && this.lastData.typeId === namespace.id) return
			this.lastData.typeId = namespace.id

			if (!isHandledItem) this.defaultItemHandler(player, displayer, value)
			if (!displayer.hasTitle()) displayer.setTitle([UIEnum.ItemRendererChanged, translationKey])
			if (this.lastData.namespace !== namespace.prefix && !displayer.hasSubtitle()) {
				this.lastData.namespace = namespace.prefix
				displayer.setSubtitle([UIEnum.GeneralViewNamespace, uppercase(namespace.prefix)])
			}
		} catch (e) {
			console.warn(e, e.stack)
		}
	}

	private defaultItemHandler(player: Player, displayer: Displayer, value: Block) {
		const slot = player.getComponent(EntityComponentTypes.Inventory)?.container?.getSlot(17)

		if (slot) {
			displayer.setSlot(slot)

			const currentItem = slot.getItem()
			const oldItem = displayer.getOldItem()

			if (currentItem instanceof ItemStack) {
				if (currentItem.getLore().includes(witblocked)) {
					if (oldItem == null) {
						displayer.setOldItem(undefined)
					}
				} else {
					displayer.setOldItem(currentItem)
				}
			} else {
				displayer.setOldItem(undefined)
			}

			const newItem = value.getItemStack()
			newItem.lockMode = ItemLockMode.slot
			newItem.setLore([witblocked])

			displayer.setNewItem(newItem)
		}
	}

	private entityHandler(player: Player, displayer: Displayer, value: Entity) {
		let namespace = this.wrapNamespace(value.typeId)
		displayer.setTitle([UIEnum.EntityRendererChanged, `entity.${namespace.id}.name`])
		displayer.setNewItem(null)
		this.lastData = {
			type: 'entity',
			typeId: namespace.id,
			namespace: namespace.prefix,
		}
	}
}

const translationService = new TranslationService()

export default translationService
