import { BlockPermutation, RawMessage } from '@minecraft/server'
import { StateHandlerParams } from './types'

export function isPermutationEquals(a: BlockPermutation, b: BlockPermutation): boolean {
	return a.matches(b.type.id, b.getAllStates())
}

export function toBlockStateMap(perm: BlockPermutation): Map<string, string | number | boolean> {
	const states = perm.getAllStates()
	const map = new Map()
	for (const i in states) map.set(i, states[i])
	return map
}

export function getPercent(min: number, max: number, current: number): number {
	const difference = max - min
	const percentage = ((current - min) / difference) * 100
	return Math.round(percentage)
}

export function getGrowth(
	handlerParams: StateHandlerParams<any>,
	block_state_name: string,
	min: number = 0,
	max?: number
): (string | RawMessage | undefined)[] {
	if (!max) {
		max = min
		min = 0
	}

	const { states } = handlerParams

	const current = (states.get(block_state_name) as number) ?? 0
	const growthPercentage = getPercent(min, max, current)

	const description = {
		translate: `crops.growth.${current < max ? 0 : 1}`,
		with: current > max ? [] : [`${growthPercentage}`],
	}

	return [undefined, description]
}

export function upperCaseWhenUnderscore(s: string): string {
	return s.replace(/_./g, match => match[1].toUpperCase())
}
