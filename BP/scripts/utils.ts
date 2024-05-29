import { BlockPermutation } from '@minecraft/server'
import { HandlerParam, Message } from './types'
import { StrictMessage } from './Displayer'

export function isPermutationEquals(a: BlockPermutation, b: BlockPermutation): boolean {
	return a.matches(b.type.id, b.getAllStates())
}

type BlockStateRecord = Record<string, string | number | boolean>

export function isBlockStateEquals(a: BlockStateRecord, b: BlockStateRecord): boolean {
	if (typeof a !== 'object' || typeof b !== 'object') return false
	return Object.keys(a).every(k => a[k] === b[k])
}

export function isStrictMessageEquals(a: StrictMessage, b: StrictMessage): boolean {
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false
		return a.every((v, i) => isStrictMessageEquals(v, b[i]))
	}
	if (typeof a === 'object' && typeof b === 'object')
		return Object.keys(a).every(k => isStrictMessageEquals(a[k], b[k]))
	return a === b
}

export function getPercent(min: number, max: number, current: number): number {
	const difference = max - min
	const percentage = ((current - min) / difference) * 100
	return Math.round(percentage)
}

export function getGrowth(
	handlerParams: HandlerParam,
	block_state_name: string,
	min: number = 0,
	max?: number
): Message {
	if (!max) {
		max = min
		min = 0
	}
	const { state } = handlerParams

	const current = <number>state(block_state_name) ?? 0
	const growthPercentage = getPercent(min, max, current)

	const description = {
		translate: `crops.growth.${current < max ? 0 : 1}`,
	}

	if (current < max) description['with'] = [`${growthPercentage}`]

	return description
}

export function upperCaseWhenUnderscore(s: string): string {
	return s.replace(/_./g, match => match[1].toUpperCase())
}

export const ln = '\n'
