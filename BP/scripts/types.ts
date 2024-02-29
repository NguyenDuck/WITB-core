import { RawMessage } from '@minecraft/server'

export type BlockStateMap = Map<string, string | number | boolean>

export enum TransType {
	Block = 'tile',
	Item = 'item',
	Entity = 'entity',
}

export class TransKey {
	constructor(public name: string, public type: TransType = TransType.Block) {}

	equals(other: TransKey): boolean {
		return this.type === other.type && this.name === other.name
	}

	toString(): string {
		return `${this.type}.${this.name}.name`
	}
}

export type StateHandlerParams<K extends keyof RequestPermission> = {
	lang: TransKey
	states: BlockStateMap
	param: Map<K, Function>
}

export type StateHandler<T extends keyof RequestPermission> = (
	args: StateHandlerParams<T>
) => (string | RawMessage | undefined)[]

export type RequestPermission = 'getRedstonePower'

export type TransEntry = {
	RequestPermission?: RequestPermission[]
	Type?: TransType
	Override?: string
	StateHandler?: StateHandler<any>
	Ref?: string
}

export interface ITranslator {
	[key: string]: TransEntry
}
