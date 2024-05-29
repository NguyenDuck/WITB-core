import { ITranslator, TType } from '../../types'
import { upperCaseWhenUnderscore } from '../../utils'

export default {
	// Decorative
	'dirt': [['state'], ({ state }) => `dirt${state('dirt_type') == 'coarse' ? '.coarse' : ''}`],
	'grass_block': 'grass',
	'stone': 'stone.stone',
	'granite': 'stone.granite',
	'polished_granite': 'stone.graniteSmooth',
	'diorite': 'stone.diorite',
	'polished_diorite': 'stone.dioriteSmooth',
	'andesite': 'stone.andesite',
	'polished_andesite': 'stone.andesiteSmooth',
	'stone_bricks': 'stonebrick',
	'mossy_stone_bricks': 'stonebrick.mossy',
	'cracked_stone_bricks': 'stonebrick.cracked',
	'chiseled_stone_bricks': 'stonebrick.chiseled',
	'stonebrick': [['state'], ({ state }) => `stonebrick.${state('stone_brick_type')}`],
	'sandstone': [
		['state'],
		({ state }) => `sandstone.${(<string>state('sand_stone_type')).replace('heiroglyphs', 'chiseled')}`,
	],
	'red_sandstone': [
		['state'],
		({ state }) => `red_sandstone.${(<string>state('sand_stone_type')).replace('heiroglyphs', 'chiseled')}`,
	],
	'.+_glazed_terracotta': [
		({ name }) => `${upperCaseWhenUnderscore(`glazed_terracotta_${name.replace('_glazed_terracotta', '')}`)}`,
	],
	'.+_concrete$': [
		({ name }) => {
			let s = name.replace('light_gray', 'gray').split('_')
			return `${s.pop()}.${upperCaseWhenUnderscore(s.join('_'))}`
		},
	],
	'.+_concrete_powder': [
		({ name }) => {
			let s = name.replace('light_gray', 'silver').split('_')
			s.pop()
			s.pop()
			return `concretePowder.${upperCaseWhenUnderscore(s.join('_'))}`
		},
	],
	'.+_terracotta': [
		({ name }) => {
			let s = name.replace('light_gray', 'silver').split('_')
			s.pop()
			return `stained_hardened_clay.${upperCaseWhenUnderscore(s.join('_'))}`
		},
	],
	'sand': [['state'], ({ state }) => (state('sand_type') == 'red' ? `sand.red` : `sand`)],
	'frame': { t: TType.Item },
	'glow_frame': { t: TType.Item },
	// Slab
	'stone_block_slab4': [['state'], ({ state }) => `stone_slab4.${state('stone_slab_type_4')}`],
	'double_stone_block_slab4': { r: 'stone_block_slab4' },
	'smooth_stone_slab': 'stone_slab.stone',
	'cobblestone_slab': 'stone_slab.cobble',
	'stone_brick_slab': 'stone_slab.smoothStoneBrick',
	'sandstone_slab': 'stone_slab.sand',
	'brick_slab': 'stone_slab.brick',
	'quartz_slab': 'stone_slab.quartz',
	'nether_brick_slab': 'stone_slab.nether_brick',
	'purpur_slab': 'stone_slab2.purpur',
	'red_sandstone_slab': 'stone_slab2.red_sandstone',
	'smooth_sandstone_slab': 'stone_slab2.sandstone.smooth',
	'prismarine_slab': 'stone_slab2.prismarine.rough',
	'dark_prismarine_slab': 'stone_slab2.prismarine.dark',
	'prismarine_brick_slab': 'stone_slab2.prismarine.bricks',
	'mossy_cobblestone_slab': 'stone_slab2.mossy_cobblestone',
	'red_nether_brick_slab': 'stone_slab2.red_nether_brick',
	'smooth_red_sandstone_slab': 'stone_slab3.red_sandstone.smooth',
	'granite_slab': 'stone_slab3.granite',
	'andesite_slab': 'stone_slab3.andesite',
	'diorite_slab': 'stone_slab3.diorite',
	'polished_granite_slab': 'stone_slab3.granite.smooth',
	'polished_andesite_slab': 'stone_slab3.andesite.smooth',
	'polished_diorite_slab': 'stone_slab3.diorite.smooth',
	'end_stone_brick_slab': 'stone_slab3.end_brick',
	'smooth_stone_double_slab': { r: 'smooth_stone_slab' },
	'brick_double_slab': { r: 'brick_slab' },
	'nether_brick_double_slab': { r: 'nether_brick_slab' },
	'cobblestone_double_slab': { r: 'cobblestone_slab' },
	'double_stone_block_slab2': [
		['state'],
		({ state }) => {
			let l = <string>state('stone_slab_type_2')
			return `stone_slab2.${
				{
					prismarine_rough: 'prismarine.rough',
					prismarine_dark: 'prismarine.dark',
					prismarine_brick: 'prismarine.bricks',
					smooth_sandstone: 'sandstone.smooth',
				}[l] ?? l
			}`
		},
	],
	'double_stone_block_slab3': [
		['state'],
		({ state }) => {
			let l = <string>state('stone_slab_type_3')
			return `stone_slab3.${
				{
					end_stone_brick: 'end_brick',
					polished_granite: 'granite.smooth',
					polished_diorite: 'diorite.smooth',
					polished_andesite: 'andesite.smooth',
					smooth_red_sandstone: 'red_sandstone.smooth',
				}[l] ?? l
			}`
		},
	],
	'quartz_double_slab': { r: 'quartz_slab' },
	'mangrove_double_slab': 'mangrove_slab',
	'bamboo_double_slab': 'bamboo_slab',
	'bamboo_mosaic_double_slab': 'bamboo_mosaic_slab',
	'stone_brick_double_slab': { r: 'stone_brick_slab' },
	'sandstone_double_slab': { r: 'sandstone_slab' },
	'blackstone_double_slab': { r: 'blackstone_slab' },
	'polished_blackstone_double_slab': 'polished_blackstone_slab',
	'polished_blackstone_brick_double_slab': 'polished_blackstone_brick_slab',
	'mud_brick_double_slab': 'mud_brick_slab',
	'tuff_double_slab': 'tuff_slab',
	'polished_tuff_double_slab': 'polished_tuff_slab',
	'tuff_brick_double_slab': 'tuff_brick_slab',
	// Walls
	'cobblestone_wall': [
		['state'],
		({ state }) => {
			let s = (<string>state('wall_block_type')).split('_')
			if (s.includes('cobblestone')) s.pop()
			if (!s.length) s.push('normal')
			return `cobblestone_wall.${s.join('_')}`
		},
	],
	// Sign
	'standing_sign': { t: TType.Item, n: 'sign' },
	'mangrove_standing_sign': { t: TType.Item, n: 'mangrove_sign' },
	'cherry_standing_sign': { t: TType.Item, n: 'cherry_sign' },
	'bamboo_standing_sign': { t: TType.Item, n: 'bamboo_sign' },
	'.+_hanging_sign': { t: TType.Item },
	// Ocean
	'seagrass': 'seagrass.seagrass',
	'prismarine': [
		['state'],
		({ state }) => `prismarine.${(<string>state('prismarine_block_type')).replace('default', 'rough')}`,
	],
	'sea_lantern': 'seaLantern',
	'fire_coral_block': 'coral_block.red',
	'brain_coral_block': 'coral_block.pink',
	'bubble_coral_block': 'coral_block.purple',
	'tube_coral_block': 'coral_block.blue',
	'horn_coral_block': 'coral_block.yellow',
	'dead_fire_coral_block': 'coral_block.red_dead',
	'dead_brain_coral_block': 'coral_block.pink_dead',
	'dead_bubble_coral_block': 'coral_block.purple_dead',
	'dead_tube_coral_block': 'coral_block.blue_dead',
	'dead_horn_coral_block': 'coral_block.yellow_dead',
	'fire_coral': 'coral.red',
	'brain_coral': 'coral.pink',
	'bubble_coral': 'coral.purple',
	'tube_coral': 'coral.blue',
	'horn_coral': 'coral.yellow',
	'dead_fire_coral': 'coral.red_dead',
	'dead_brain_coral': 'coral.pink_dead',
	'dead_bubble_coral': 'coral.purple_dead',
	'dead_tube_coral': 'coral.blue_dead',
	'dead_horn_coral': 'coral.yellow_dead',
	'fire_coral_fan': 'coral_fan.red_fan',
	'brain_coral_fan': 'coral_fan.pink_fan',
	'bubble_coral_fan': 'coral_fan.purple_fan',
	'tube_coral_fan': 'coral_fan.blue_fan',
	'horn_coral_fan': 'coral_fan.yellow_fan',
	'dead_fire_coral_fan': 'coral_fan_dead.red_fan',
	'dead_brain_coral_fan': 'coral_fan_dead.pink_fan',
	'dead_bubble_coral_fan': 'coral_fan_dead.purple_fan',
	'dead_tube_coral_fan': 'coral_fan_dead.blue_fan',
	'dead_horn_coral_fan': 'coral_fan_dead.yellow_fan',
	'coral_fan_hang': [
		['state'],
		({ state }) =>
			`coral_fan${state('dead_bit') ? '_dead' : ''}.${state('coral_hang_type_bit') ? 'pink' : 'blue'}_fan`,
	],
	'coral_fan_hang2': [
		['state'],
		({ state }) =>
			`coral_fan${state('dead_bit') ? '_dead' : ''}.${state('coral_hang_type_bit') ? 'red' : 'purple'}_fan`,
	],
	'coral_fan_hang3': [
		['state'],
		({ state }) =>
			`coral_fan${state('dead_bit') ? '_dead' : ''}.${state('coral_hang_type_bit') ? '' : 'yellow'}_fan`,
	],

	// Nether
	'quartz_block': [['state'], ({ state }) => `quartz_block.${state('chisel_type')}`],
	'crimson_roots': 'crimson_roots.crimsonRoots',
	'warped_roots': 'warped_roots.warpedRoots',
	// The End
	'purpur_block': { r: 'quartz_block' },
} as ITranslator
