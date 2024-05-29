import { RawMessage } from '@minecraft/server'

export type BlockStateMap = Map<string, string | number | boolean>

export enum TType {
	Block = 'tile',
	Item = 'item',
	Entity = 'entity',
}

export class TKey {
	constructor(public name: string, public type: TType = TType.Block) {}

	toString(): string {
		return `${this.type}.${this.name}${this.name.includes(':') && this.type == TType.Item ? '' : '.name'}`
	}
}

export type Message = (string | RawMessage | undefined)[] | string | RawMessage

export type Handler = (args: HandlerParam) => Message

type DefaultPP = { prefix: string; name: string; id: string }

type StatePP = { state?: (name: string) => string | number | boolean | undefined }

type RedstonePP = { redstonePower?: number }

export type HandlerParam = DefaultPP & StatePP & RedstonePP

export type Permission = 'redstonePower' | 'state'

export type NameTypeEntry = { n?: string; t?: TType }

export type HandlerEntry = (Permission[] | Handler | NameTypeEntry)[]

export type RefEntry = { r: string }

export type TEntry = HandlerEntry | RefEntry | NameTypeEntry | {}

export interface ITranslator {
	[key: string]: TEntry | string
}
