import { type PrefixTypes } from 'witb-api'
import { equals, isVanilla } from './utils'

export default class SessionData<T> {
	private isVanilla: boolean
	constructor(
		public readonly type?: PrefixTypes,
		public readonly namespace?: string,
		public readonly id?: string,
		public readonly data: Map<string, T> = new Map()
	) {
		this.isVanilla = isVanilla(namespace)
	}

	public getData(name: string) {
		return this.data.get(name)
	}

	public setData(name: string, v: any) {
		this.data.set(name, v)
	}

	public getParsedId(): string {
		return this.isVanilla ? this.id : `${this.namespace}:${this.id}`
	}

	public equals(o?: any): boolean {
		if (o instanceof SessionData) {
			return equals(this, o)
		} else if (typeof o === 'string') {
			return this.getParsedId() === o
		} else if (this.id === o) return true
		return false
	}
}
