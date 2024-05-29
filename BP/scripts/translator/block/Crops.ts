import { HandlerParam, ITranslator, TType } from '../../types'
import { getGrowth, upperCaseWhenUnderscore } from '../../utils'

const sevenGrowth = (v: HandlerParam) => getGrowth(v, 'growth', 7)

export default {
	// Seeds
	'wheat': [['state'], { t: TType.Item, n: 'wheat_seeds' }, sevenGrowth],
	'cocoa': [['state'], { t: TType.Item, n: 'dye.brown' }, v => getGrowth(v, 'age', 2)],
	'reeds': [['state'], { t: TType.Item }, v => getGrowth(v, 'age', 15)],
	'pumpkin_stem': [['state'], { t: TType.Item, n: 'pumpkin_seeds' }, sevenGrowth],
	'melon_stem': [['state'], { t: TType.Item, n: 'melon_seeds' }, sevenGrowth],
	'beetroot': [['state'], { t: TType.Item, n: 'beetroot_seeds' }, sevenGrowth],
	'torchflower_crop': [['state'], { t: TType.Item, n: 'torchflower_seeds' }, sevenGrowth],
	'pitcher_crop': [['state'], { t: TType.Item, n: 'pitcher_pod' }, v => getGrowth(v, 'growth', 4)],
	'carrots': [['state'], sevenGrowth],
	'potatoes': { r: 'carrots' },
	// Sapling
	'^(oak|spruce|birch|jungle|acacia|dark_oak)_sapling': [
		({ name }) => `sapling.${name.replace('_sapling', '').replace('dark_oak', 'big_oak')}`,
	],
	'bamboo_sapling': 'bamboo',
	// Flower
	'yellow_flower': 'yellow_flower.dandelion',
	'^(poppy|blue_orchid|allium|azure_bluet|.+_tulip|oxeye_daisy|cornflower|lily_.+_valley)$': [
		({ name }) =>
			`red_flower.${upperCaseWhenUnderscore(
				{
					azure_bluet: 'houstonia',
					red_tulip: 'tulipRed',
					orange_tulip: 'tulipOrange',
					pink_tulip: 'tulipPink',
					white_tulip: 'tulipWhite',
				}[name] ?? name
			)}`,
	],
	'^(sunflower|lilac|rose_bush|peony|tall_grass|large_fern)$': [
		({ name }) =>
			`double_plant.${
				{
					lilac: 'syringa',
					rose_bush: 'rose',
					peony: 'paeonia',
					tall_grass: 'grass',
					large_fern: 'fern',
				}[name] ?? name
			}`,
	],
	// Leaves
	'.+_leaves': [
		({ name }) => {
			let s = name.replace('_leaves', '')
			return ['oak', 'spruce', 'birch', 'jungle', 'dark_oak', 'acacia'].includes(s)
				? `leaves.${s.replace('dark_oak', 'big_oak')}`
				: undefined
		},
	],
} as ITranslator
