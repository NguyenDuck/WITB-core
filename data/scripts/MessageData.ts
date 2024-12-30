import { RawMessage } from '@minecraft/server'
import UIEnum, { encodeToHex } from './UIEnum'
import { TKey } from './types'
import { getLength } from './utils'

type RawMessageEntry = string | RawMessage | UIEnum | TKey

export type MessageData = RawMessageEntry | RawMessageEntry[]

export function toRawMessage(message: MessageData): string | RawMessage {
	if (typeof message === 'number') return encodeToHex(message)
	if (Array.isArray(message)) return <RawMessage>message.map(toRawMessage)
	if (typeof message === 'object' && !(message instanceof TKey)) return <RawMessage>message
	const result = message.toString()
	const length = getLength(result)
	return length + result
}
