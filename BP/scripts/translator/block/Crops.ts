import { ITranslator, TransType } from '../../types'
import { getGrowth, upperCaseWhenUnderscore } from '../../utils'

export default {
	// Seeds
	wheat: {
		Type: TransType.Item,
		Override: 'wheat_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	cocoa: {
		Type: TransType.Item,
		Override: 'dye.brown',
		StateHandler: v => getGrowth(v, 'age', 2),
	},
	reeds: {
		Type: TransType.Item,
		StateHandler: v => getGrowth(v, 'age', 15),
	},
	pumpkin_stem: {
		Type: TransType.Item,
		Override: 'pumpkin_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	melon_stem: {
		Type: TransType.Item,
		Override: 'melon_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	beetroot: {
		Type: TransType.Item,
		Override: 'beetroot_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	torchflower_crop: {
		Type: TransType.Item,
		Override: 'torchflower_seeds',
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	pitcher_crop: {
		Type: TransType.Item,
		Override: 'pitcher_pod',
		StateHandler: v => getGrowth(v, 'growth', 4),
	},
	carrots: {
		StateHandler: v => getGrowth(v, 'growth', 7),
	},
	potatoes: {
		Ref: 'carrots',
	},
	// Sapling
	sapling: {
		StateHandler: v => {
			let s = v.states.get('sapling_type')
			return [`${v.lang.name}.${s == 'dark_oak' ? 'big_oak' : s}`]
		},
	},
	bamboo_sapling: {
		Override: 'bamboo',
	},
	// Decoration
	yellow_flower: {
		Override: 'yellow_flower.dandelion',
	},
	red_flower: {
		StateHandler: v => {
			let key = <string>v.states.get('flower_type')
			key =
				{
					orchid: 'blue_orchid',
					oxeye: 'oxeye_daisy',
				}[key]! ?? key
			return [`${v.lang.name}.${upperCaseWhenUnderscore(key)}`]
		},
	},
	double_plant: {
		StateHandler: v => [`${v.lang.name}.${v.states.get('double_plant_type')}`],
	},

	leaves: {
		StateHandler: v => [`${v.lang.name}.${v.states.get('old_leaf_type')}`],
	},
	leaves2: {
		StateHandler: v => {
			let s = v.states.get('new_leaf_type')
			return [`${v.lang.name}.${s == 'dark_oak' ? 'big_oak' : s}`]
		},
	},
} as ITranslator
