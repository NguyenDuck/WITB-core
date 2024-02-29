import { ITranslator, TransType } from '../../types'
import { upperCaseWhenUnderscore } from '../../utils'

export default {
	// Decorative
	'stone': {
		StateHandler: v => [`stone.${upperCaseWhenUnderscore(<string>v.states.get('stone_type'))}`],
	},
	'stonebrick': {
		StateHandler: v => [`${v.lang.name}.${v.states.get('stone_brick_type')}`],
	},
	'sandstone': {
		StateHandler: v => {
			let s = v.states.get('sand_stone_type')
			return [`${v.lang.name}.${s == 'heiroglyphs' ? 'chiseled' : s}`]
		},
	},
	'red_sandstone': {
		Ref: 'sandstone',
	},
	'*_glazed_terracotta': {
		StateHandler: v => {
			let s = v.lang.name.split('glazed_terracotta')
			return [
				`${upperCaseWhenUnderscore(
					`glazed_terracotta_${s[0].substring(0, s[0].length - 1)}`
				)}`,
			]
		},
	},
	'*_concrete$': {
		StateHandler: v => {
			let s = v.lang.name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [`${s.pop()}.${upperCaseWhenUnderscore(s.join('_'))}`]
		},
	},
	'*_concrete_powder': {
		StateHandler: v => {
			let s = v.lang.name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [
				`${upperCaseWhenUnderscore(
					[s.pop(), s.pop()].reverse().join('_')
				)}.${upperCaseWhenUnderscore(s.join('_'))}`,
			]
		},
	},
	'*_terracotta': {
		StateHandler: v => {
			let s = v.lang.name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			s.pop()
			return [`stained_hardened_clay.${upperCaseWhenUnderscore(s.join('_'))}`]
		},
	},
	'sand': {
		StateHandler: v => (v.states.get('sand_type') == 'red' ? [`sand.red`] : []),
	},
	'frame': {
		Type: TransType.Item,
	},
	'glow_frame': {
		Type: TransType.Item,
	},
	// Slab
	'stone_block_slab': {
		Override: 'stone_slab',
		StateHandler: v => {
			let s = <string>v.states.get('stone_slab_type')
			s =
				{
					smooth_stone: 'stone',
					cobblestone: 'cobble',
					stone_brick: 'smoothStoneBrick',
					sandstone: 'sand',
				}[s]! ?? s
			return [`${v.lang.name}.${s}`]
		},
	},
	'stone_block_slab2': {
		Override: 'stone_slab2',
		StateHandler: v => {
			let s = <string>v.states.get('stone_slab_type_2')
			s =
				{
					smooth_sandstone: 'sandstone.smooth',
					prismarine_rough: 'prismarine.rough',
					prismarine_dark: 'prismarine.dark',
					prismarine_brick: 'prismarine.bricks',
				}[s]! ?? s
			return [`${v.lang.name}.${s}`]
		},
	},
	'stone_block_slab3': {
		Override: 'stone_slab3',
		StateHandler: v => {
			let s = <string>v.states.get('stone_slab_type_3')
			s =
				{
					smooth_red_sandstone: 'red_sandstone.smooth',
					polished_granite: 'granite.smooth',
					polished_andesite: 'andesite.smooth',
					polished_diorite: 'diorite.smooth',
					end_stone_brick: 'end_brick',
				}[s]! ?? s
			return [`${v.lang.name}.${s}`]
		},
	},
	'stone_block_slab4': {
		Override: 'stone_slab4',
		StateHandler: v => [`${v.lang.name}.${v.states.get('stone_slab_type_4')}`],
	},
	'double_stone_block_slab': {
		Ref: 'stone_block_slab',
	},
	'double_stone_block_slab2': {
		Ref: 'stone_block_slab2',
	},
	'double_stone_block_slab3': {
		Ref: 'stone_block_slab3',
	},
	'double_stone_block_slab4': {
		Ref: 'stone_block_slab4',
	},
	'polished_blackstone_brick_double_slab': {
		Override: 'polished_blackstone_brick_slab',
	},
	// Walls
	'cobblestone_wall': {
		StateHandler: v => {
			let s = (<string>v.states.get('wall_block_type')).split('_')
			if (s.includes('cobblestone')) s.pop()
			if (!s.length) s.push('normal')
			return [`${v.lang.name}.${s.join('_')}`]
		},
	},
	// Sign
	'standing_sign': {
		Type: TransType.Item,
		Override: 'sign',
	},
	'mangrove_standing_sign': {
		Type: TransType.Item,
		Override: 'mangrove_sign',
	},
	'cherry_standing_sign': {
		Type: TransType.Item,
		Override: 'cherry_sign',
	},
	'bamboo_standing_sign': {
		Type: TransType.Item,
		Override: 'bamboo_sign',
	},
	'*_hanging_sign': {
		Type: TransType.Item,
	},
	// Ocean
	'seagrass': {
		Override: 'seagrass.seagrass',
	},
	'prismarine': {
		StateHandler: v => {
			let s = v.states.get('prismarine_block_type')
			return [`${v.lang.name}.${s == 'default' ? 'rough' : s}`]
		},
	},
	'sea_lantern': {
		Override: 'seaLantern',
	},
	'coral_block': {
		StateHandler: v => {
			let s = v.states.get('coral_color')
			let s2 = v.states.get('dead_bit')
			return s2 ? [`${v.lang.name}.${s}_dead`] : [`${v.lang.name}.${s}`]
		},
	},
	'fire_coral': {
		Override: 'coral.red',
	},
	'brain_coral': {
		Override: 'coral.pink',
	},
	'bubble_coral': {
		Override: 'coral.purple',
	},
	'tube_coral': {
		Override: 'coral.blue',
	},
	'horn_coral': {
		Override: 'coral.yellow',
	},
	'dead_fire_coral': {
		Override: 'coral.red_dead',
	},
	'dead_brain_coral': {
		Override: 'coral.pink_dead',
	},
	'dead_bubble_coral': {
		Override: 'coral.purple_dead',
	},
	'dead_tube_coral': {
		Override: 'coral.blue_dead',
	},
	'dead_horn_coral': {
		Override: 'coral.yellow_dead',
	},
	'coral_fan_hang': {
		Override: 'coral_fan',
		StateHandler: v => {
			let s = v.states.get('coral_hang_type_bit')
			let s2 = v.states.get('dead_bit')
			return [`${v.lang.name}${s2 ? '_dead' : ''}.${s ? 'pink' : 'blue'}_fan`]
		},
	},
	'coral_fan_hang2': {
		Override: 'coral_fan',
		StateHandler: v => {
			let s = v.states.get('coral_hang_type_bit')
			let s2 = v.states.get('dead_bit')
			return [`${v.lang.name}${s2 ? '_dead' : ''}.${s ? 'red' : 'purple'}_fan`]
		},
	},
	'coral_fan_hang3': {
		Override: 'coral_fan',
		StateHandler: v => {
			let s = v.states.get('coral_hang_type_bit')
			let s2 = v.states.get('dead_bit')
			return [`${v.lang.name}${s2 ? '_dead' : ''}.${s ? '' : 'yellow'}_fan`]
		},
	},

	// Nether
	'quartz_block': {
		StateHandler: v => [`${v.lang.name}.${v.states.get('chisel_type')}`],
	},
	'crimson_roots': {
		Override: 'crimson_roots.crimsonRoots',
	},
	'warped_roots': {
		Override: 'warped_roots.warpedRoots',
	},
	// The End
	'purpur_block': {
		StateHandler: v => [`${v.lang.name}.${v.states.get('chisel_type')}`],
	},
} as ITranslator
