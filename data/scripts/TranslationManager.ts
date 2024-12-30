import { HandlerTypes, TranslationHandlerOptions } from 'witb-api'
import { toFunction } from './utils'

const isRegexPattern = (s: string) => !/^[a-z_0-9]+$/.test(s)
const toRegex = (s: string) => new RegExp(s)

export class TranslationManager {
	public readonly manager: Map<string, Registry> = new Map()

	private createNew(namespace: string) {
		if (!this.manager.has(namespace)) {
			this.manager.set(namespace, createEmptyRegistry())
		}
	}

	registerGlobal(namespace: string, name: string, fn: string) {
		this.createNew(namespace)
		const registry = this.manager.get(namespace)
		registry.global[name] = toFunction(fn)
	}

	getGlobal(namespace: string) {
		return this.manager.get(namespace).global
	}

	register(namespace: string, block_matcher: string, value: TranslationHandlerOptions) {
		this.createNew(namespace)
		const registry = this.manager.get(namespace)
		const type = registry[value?.type || HandlerTypes.Block]
		type.register(block_matcher, value)
		registry.size++
	}

	find(namespace: string, matcher: string, type: HandlerTypes = HandlerTypes.Block) {
		const registry = this.manager.get(namespace)
		if (!registry) return
		const kind = registry[type]
		if (!kind) return
		const options = kind.normal.get(matcher) || Array.from(kind.regex).find(([v]) => v.test(matcher))?.[1]
		return options
	}
}

export default new TranslationManager()

class RegistryKind {
	public readonly normal: Map<string, TranslationHandlerOptions> = new Map()
	public readonly regex: Map<RegExp, TranslationHandlerOptions> = new Map()

	register(block_matcher: string, value: TranslationHandlerOptions) {
		if (isRegexPattern(block_matcher)) this.regex.set(toRegex(block_matcher), value)
		else this.normal.set(block_matcher, value)
	}
}

type Registry = {
	[HandlerTypes.Block]: RegistryKind
	[HandlerTypes.Entity]: RegistryKind
	[HandlerTypes.Item]: RegistryKind
	global: Record<string, Function>
	size: number
}

function createEmptyRegistry() {
	return {
		[HandlerTypes.Block]: new RegistryKind(),
		[HandlerTypes.Entity]: new RegistryKind(),
		[HandlerTypes.Item]: new RegistryKind(),
		global: {},
		size: 0,
	}
}
