import {
	Block,
	BlockPermutation,
	Entity,
	EntityItemComponent,
	ItemStack,
	Player,
	RawMessage
} from '@minecraft/server'
import { CachedTypes, PrefixTypes, TranslationHandlerOptions } from 'witb-api'
import DisplayWorker from './DisplayWorker'
import SessionData from './SessionData'
import TranslationManager from './TranslationManager'
import UIEnum from './UIEnum'
import { TKey } from './types'
import { BlockStateRecord, ln, sign, toFunction, uppercase } from './utils'

function handleSession(
	currentSession: SessionData<any>,
	value?: Block | Entity | ItemStack | BlockPermutation,
	cached_type?: CachedTypes
) {
	switch (cached_type) {
		case CachedTypes.BlockState: {
			let r: Record<string, string | boolean | number>
			if (value instanceof Block) {
				r = value.permutation.getAllStates()
			} else if (value instanceof BlockPermutation) {
				r = value.getAllStates()
			}
			currentSession.setData('state', r)
			break
		}
		case CachedTypes.BlockRedstonePower: {
			let r: number = 0
			if (value instanceof Block) {
				r = value.getRedstonePower()
			}
			currentSession.setData('redstonePower', r)
			break
		}
	}
}

function arrayToRawMessage(m: (string | RawMessage) | (string | RawMessage)[]) {
	m = Array.isArray(m) ? m : [m]
	const r: RawMessage = { rawtext: [] }
	m.forEach((v, i, a) => {
		r.rawtext.push(typeof v === 'string' ? { text: v } : v)
		if (i < a.length - 1) r.rawtext.push({ text: `${ln}${sign}r` })
	})
	return r
}

function logErr(e: Error, v: string) {
	console.error(e, 'at line', ((e.stack.match(/(?<=<input>:)\d*/g) as unknown as number) || 2) - 2, ln + v)
}

export class HandleWorker {
	private readonly display: DisplayWorker
	private prevSession: SessionData<any>

	public constructor(player: Player) {
		this.display = new DisplayWorker(player)
	}

	public handle(value?: Block | Entity) {
		if (value instanceof Block) this.handleBlock(value)
		else if (value instanceof Entity) this.handleEntity(value)
		else this.handleEmpty()
	}

	private handleEmpty() {
		if (!this.prevSession?.equals()) {
			this.display.setTitle(UIEnum.ViewDisable)
			if (this.display.lastSubtitle()) this.display.setSubtitle(UIEnum.RemoveDescription)
			this.display.setItem(null)
		}
		this.prevSession = new SessionData()
	}

	private handleBlock(block: Block) {
		const key = new TKey(block.typeId)

		const display = this.display

		const prevSession = this.prevSession
		const currentSession = new SessionData<BlockStateRecord>(PrefixTypes.Block, key.prefix, key.name)

		function start(ref?: string) {
			const data = TranslationManager.find(key.prefix, ref)
			function start2(data?: TranslationHandlerOptions) {
				if (data) {
					const { name, prefix, ref, handler, cached, description } = data

					if (ref) return start(ref)
					if (cached) {
						cached.forEach(v => handleSession(currentSession, block, v))
						if (prevSession?.equals(currentSession)) return
					}
					if (handler) {
						const h = toFunction(handler)
						const p = {
							name: key.getParsedId(),
							...Object.fromEntries(currentSession.data.entries()),
							...TranslationManager.getGlobal(key.prefix),
						}
						let r: any
						try {
							r = h(p)
						} catch (e) {
							logErr(e, handler)
						}

						if (r) return start2(r)
					}

					if (name) key.setParsedName(name)
					if (prefix) key.setType(prefix)
					if (description) display.setSubtitle([UIEnum.UpdateDescription, arrayToRawMessage(description)])
					else if (prevSession?.data) display.setSubtitle([UIEnum.RemoveDescription])
				} else if (ref) key.setParsedName(ref)
			}
			start2(data)
		}

		start(key.name)

		if (prevSession?.equals(currentSession)) return
		this.prevSession = currentSession

		this.display.setBlockToDisplay(block)
		this.display.setTitle([UIEnum.UpdateItemRenderer, key, uppercase(key.prefix)])
	}

	private handleEntity(entity: Entity) {
		const key = new TKey(entity.typeId, PrefixTypes.Entity)
		if (key.getParsedId() === 'item') {
			const item = entity.getComponent(EntityItemComponent.componentId).itemStack
			return this.handlerItemStack(item)
		}
		const display = this.display

		const prevSession = this.prevSession
		const currentSession = new SessionData<BlockStateRecord>(PrefixTypes.Entity, key.prefix, key.name)

		function start(ref?: string) {
			const data = TranslationManager.find(key.prefix, ref || key.name)
			function start2(data?: TranslationHandlerOptions) {
				if (data) {
					const { name, prefix, ref, handler, cached, description } = data

					if (ref) return start(ref)
					if (cached) {
						cached.forEach(v => handleSession(currentSession, entity, v))
						if (prevSession?.equals(currentSession)) return
					}
					if (handler) {
						try {
							const h = toFunction(handler)
							const r = h({
								name: key.getParsedId(),
								state: currentSession.data,
								...TranslationManager.getGlobal(key.prefix),
							})
							return start2(r)
						} catch (e) {
							logErr(e, handler)
						}
					}

					if (name) key.setParsedName(name)
					if (prefix) key.setType(prefix as unknown as PrefixTypes)
					if (description) display.setSubtitle([UIEnum.UpdateDescription, arrayToRawMessage(description)])
					else if (prevSession.data) display.setSubtitle([UIEnum.RemoveDescription])
				} else if (ref) key.setParsedName(ref)
			}
			start2(data)
		}

		start()

		if (this.prevSession?.equals(currentSession)) return
		this.prevSession = currentSession

		this.display.setTitle([UIEnum.UpdateEntityRenderer, key, uppercase(key.prefix)])
	}

	private handlerItemStack(item: ItemStack) {
		try {
			const b = BlockPermutation.resolve(item.typeId)
			return this.handleBlockPermutation(b, item.amount)
		} catch (e) {
			const key = new TKey(item.typeId)

			const display = this.display

			const prevSession = this.prevSession
			const currentSession = new SessionData<any>(PrefixTypes.Item, key.prefix, key.name)

			function start(ref?: string) {
				const data = TranslationManager.find(key.prefix, ref || key.name)
				function start2(data?: TranslationHandlerOptions) {
					if (data) {
						const { name, prefix, ref, handler, cached, description } = data

						if (ref) return start(ref)
						if (cached) {
							cached.forEach(v => handleSession(currentSession, item, v))
							if (prevSession?.equals(currentSession)) return
						}
						if (handler) {
							const h = toFunction(handler)
							const p = {
								name: key.getParsedId(),
								...Object.fromEntries(currentSession.data.entries()),
								...TranslationManager.getGlobal(key.prefix),
							}
							try {
								const r = h(p)
								return start2(r)
							} catch (e) {
								logErr(e, handler)
							}
						}

						if (name) key.setParsedName(name)
						if (prefix) key.setType(prefix as unknown as PrefixTypes)
						if (description) display.setSubtitle([UIEnum.UpdateDescription, arrayToRawMessage(description)])
						else if (prevSession?.data) display.setSubtitle([UIEnum.RemoveDescription])
					} else if (ref) key.setParsedName(ref)
				}
				start2(data)
			}

			start()

			if (prevSession?.equals(currentSession)) return
			this.prevSession = currentSession

			this.display.setBlockToDisplay(item)
			this.display.setTitle([UIEnum.UpdateItemRenderer, key, uppercase(key.prefix)])
		}
	}

	private handleBlockPermutation(permutation: BlockPermutation, amount: number = 1) {
		const key = new TKey(permutation.type.id)

		const display = this.display

		const prevSession = this.prevSession
		const currentSession = new SessionData<BlockStateRecord>(PrefixTypes.Item, key.prefix, key.name)

		function start(ref?: string) {
			const data = TranslationManager.find(key.prefix, ref || key.name)
			function start2(data?: TranslationHandlerOptions) {
				if (data) {
					const { name, prefix, ref, handler, cached, description } = data

					if (ref) return start(ref)
					if (cached) {
						cached.forEach(v => handleSession(currentSession, permutation, v))
						if (prevSession?.equals(currentSession)) return
					}
					if (handler) {
						const h = toFunction(handler)
						const p = {
							name: key.getParsedId(),
							...Object.fromEntries(currentSession.data.entries()),
							...TranslationManager.getGlobal(key.prefix),
						}
						try {
							const r = h(p)
							return start2(r)
						} catch (e) {
							logErr(e, handler)
						}
					}

					if (name) key.setParsedName(name)
					if (prefix) key.setType(prefix as unknown as PrefixTypes)
					if (description) {
						let d: any = !Array.isArray(description) ? [description] : description

						const msg: RawMessage = { rawtext: [] }

						d.forEach((v, i, a) => {
							msg.rawtext.push(typeof v === 'string' ? { text: v } : v)
							if (i < a.length - 1) msg.rawtext.push({ text: `${ln}${sign}r` })
						})

						display.setSubtitle([UIEnum.UpdateDescription, msg])
					} else if (prevSession?.data) display.setSubtitle([UIEnum.RemoveDescription])
				} else if (ref) key.setParsedName(ref)
			}
			start2(data)
		}

		start()

		if (prevSession?.equals(currentSession)) return
		this.prevSession = currentSession

		this.display.setBlockToDisplay(permutation.getItemStack(amount))
		this.display.setTitle([UIEnum.UpdateItemRenderer, key, uppercase(key.prefix)])
	}

	// private itemHandler(item: ItemStack) {
	// 	const result = new TKey(item.typeId, TType.Item)
	// 	const msgs: MessageData = []

	// 	let t = this.tManager.getTranslator(HandlerType.Item, result.getParsedId())

	// 	const handlers = this.tManager.handleTranslator(t?.[1])

	// 	for (const { action, data } of handlers) {
	// 		switch (action) {
	// 			case TranslatorAction.REF:
	// 				{
	// 					const v = this.tManager.getTranslator(HandlerType.Item, data)
	// 					if (v) {
	// 						t = [[t[0], '=>', v[0]].join(' '), v[1]]
	// 						handlers.push(...this.tManager.handleTranslator(t[1]))
	// 					}
	// 				}
	// 				break
	// 			case TranslatorAction.NAME:
	// 				{
	// 					if (data['name']) result.setParsedName(data['name'])
	// 					if (data['type']) result.setType(data['type'])
	// 				}
	// 				break
	// 		}
	// 	}

	// 	const cSession = new SessionData(1, result.prefix, result.name, item.amount)

	// 	if (this.prevSession?.equals(cSession)) return

	// 	if (item.nameTag) this.display.setTitle([UIEnum.UpdateItemRenderer, '§g', item.nameTag, '§r'])

	// 	const enchants = item.getComponent(ItemComponentTypes.Enchantable)
	// 	if (enchants) {
	// 		const enchantment: RawMessage[] = []
	// 		enchants.getEnchantments().forEach(v =>
	// 			enchantment.push({
	// 				rawtext: [
	// 					{ translate: `enchantment.${EnchantmentsTranslator[v.type.id] ?? v.type.id}` },
	// 					{ text: ' ' },
	// 					{ translate: `${v.level <= 10 ? 'enchantment.level.' : ''}${v.level}` },
	// 				],
	// 			})
	// 		)
	// 		const msg: RawMessage = { rawtext: [] }
	// 		enchantment.forEach((v, i, a) => {
	// 			msg.rawtext.push(v)
	// 			if (i < a.length - 1) msg.rawtext.push({ text: `${ln}§r` })
	// 		})
	// 		if (enchantment.length) msgs.push(msg)
	// 	}

	// 	this.display.setBlockToDisplay(item)
	// 	if (!item.nameTag) this.display.setTitle([UIEnum.UpdateItemRenderer, result])
	// 	if (msgs.length) this.display.setSubtitle([UIEnum.UpdateDescription, ...msgs])

	// 	this.prevSession = cSession
	// }

	// private logBlock(block: Block, translate?: [string, TEntry]) {
	// 	if (block instanceof Block) {
	// 		const states = block.permutation.getAllStates()
	// 		this.player.onScreenDisplay.setActionBar(
	// 			[
	// 				`§g${block.typeId}`,
	// 				...Object.keys(states).map(k => `§b${k}: §d${states[k]}`),
	// 				translate ? '§a' + translate[0] : undefined,
	// 			].join(ln)
	// 		)
	// 	}
	// }
}
