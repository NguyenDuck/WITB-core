import { RawMessage } from '@minecraft/server'
import { CachedTypes, HandlerTypes, PrefixTypes } from 'witb-api'
import { isVanilla } from './utils'

export class TKey {
	public readonly prefix: string
	public readonly name: string
	public readonly isVanilla: boolean
	private parsedName?: string

	constructor(public id: string, public type: PrefixTypes = PrefixTypes.Block) {
		const [prefix, name] = id.split(':')
		this.prefix = prefix
		this.name = name
		this.isVanilla = isVanilla(prefix)
	}

	toString() {
		const l = [this.type, this.parsedName ?? this.getParsedId()]
		if (this.isVanilla || this.type !== PrefixTypes.Item) l.push('name')
		return l.join('.')
	}

	getParsedId() {
		return this.isVanilla ? this.name : this.id
	}

	setParsedName(name: string) {
		this.parsedName = name
	}

	setType(type: PrefixTypes) {
		this.type = type
	}
}

export type Message = (string | RawMessage | undefined)[] | string | RawMessage

export type Handler = (args: HandlerParam) => Message

type DefaultPP = { prefix: string; name: string; id: string }

type StatePP = { state: (name: string) => any }

type RedstonePP = { redstonePower: number }

export type HandlerParam = DefaultPP & StatePP & RedstonePP

type NameTypeEntry = { n?: string; t?: HandlerTypes } | string

export type TEntry = (CachedTypes[] | Handler | NameTypeEntry)[] | Handler | { r: string } | NameTypeEntry

export interface ITranslator {
	[key: string]: TEntry
}
