import { ITranslator, TType } from '../../types'
import { upperCaseWhenUnderscore } from '../../utils'

export default {
	// Wood
	'^(?!stripped).+_wood': [
		({ name }) => {
			let s = name.split('_')
			s.pop()
			let j = s.join('_')
			return ['oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak'].includes(j) ? `wood.${j}` : undefined
		},
	],
	'^(stripped).+_wood': [
		({ name }) => {
			let s = name.split('_')
			s.shift()
			s.pop()
			let j = s.join('_')
			return ['oak', 'spruce', 'birch', 'jungle', 'acacia'].includes(j) ? `wood.stripped.${j}` : undefined
		},
	],
	'stripped_dark_oak_wood': 'wood.stripped.dark_oak',
	// Planks
	'.+_planks': [
		({ name }) => {
			let a = name.split('_')
			return [
				['oak', 'birch', 'spruce', 'jungle', 'acacia'].includes(a[0]) ? `${a.pop()}.${a.join('_')}` : undefined,
			]
		},
	],
	'dark_oak_planks': 'planks.big_oak',
	// Log
	'.+_log': [
		({ name }) => {
			let a = name.split('_')
			return ['oak', 'birch', 'spruce', 'jungle', 'acacia', 'dark'].includes(a[0])
				? `${a.pop()}.${a.includes('dark') ? 'big_oak' : a.join('_')}`
				: undefined
		},
	],
	// Fences
	'.+_fence$': [
		({ name }) =>
			['oak', 'birch', 'jungle', 'spruce', 'acacia', 'dark'].includes(name.split('_')[0])
				? upperCaseWhenUnderscore(name)
				: undefined,
	],
	'oak_fence': 'fence',
	// Slab
	'^(oak|spruce|birch|jungle|acacia)_slab$': [({ name }) => `wooden_slab.${name.split('_')[0]}`],
	'dark_oak_slab': 'wooden_slab.big_oak',
	'^(oak|spruce|birch|jungle|acacia)_double_slab$': {
		r: '^(oak|spruce|birch|jungle|acacia)_slab$',
	},
	'dark_oak_double_slab': {
		r: 'dark_oak_slab',
	},
	// Door
	'.+_door': { t: TType.Item },
} as ITranslator
