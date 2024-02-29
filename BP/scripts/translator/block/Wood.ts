import { ITranslator, TransType } from '../../types'
import { upperCaseWhenUnderscore } from '../../utils'

export default {
	// Wood
	'wood': {
		StateHandler: v => {
			let s = v.states.get('wood_type')
			let s2 = v.states.get('stripped_bit')
			return [`${v.lang.name}.${s2 ? 'stripped.' : ''}${s}`]
		},
	},
	// Planks
	'dark_oak_planks': {
		Override: 'planks.big_oak',
	},
	'*_planks': {
		StateHandler: v => {
			let a = v.lang.name.split('_')
			return ['oak', 'birch', 'spruce', 'jungle', 'acacia'].includes(a[0])
				? [`${a.pop()}.${a.join('_')}`]
				: []
		},
	},
	// Log
	'*_log': {
		StateHandler: v => {
			let a = v.lang.name.split('_')
			return ['oak', 'birch', 'spruce', 'jungle', 'acacia', 'dark'].includes(a[0])
				? [`${a.pop()}.${a.includes('dark') ? 'big_oak' : a.join('_')}`]
				: []
		},
	},
	// Fences
	'oak_fence': {
		Override: 'fence',
	},
	'spruce_fence': {
		Override: 'spruceFence',
	},
	'birch_fence': {
		Override: 'birchFence',
	},
	'jungle_fence': {
		Override: 'jungleFence',
	},
	'acacia_fence': {
		Override: 'acaciaFence',
	},
	'dark_oak_fence': {
		Override: 'darkOakFence',
	},
	'*_fence_gate': {
		StateHandler: v => [upperCaseWhenUnderscore(v.lang.name)],
	},
	// Slab
	'wooden_slab': {
		Ref: 'planks',
	},
	// Door
	'*_door': {
		Type: TransType.Item,
	},
} as ITranslator
