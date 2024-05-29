import { ITranslator, TType } from '../../types'
import { upperCaseWhenUnderscore } from '../../utils'

export default {
	'.+_wool': { r: '.+_concrete$' },
	'moss_carpet': {},
	'.+_carpet': { r: '.+_concrete$' },
	'short_grass': 'tallgrass.grass',
	'fern': 'tallgrass.fern',
	'lit_.+': [({ name }) => name.split('lit_')[1]],
	'anvil': [
		['state'],
		({ name, state }) => {
			let s = state('damage')
			return `${name}${s !== 'undamaged' ? '.' + upperCaseWhenUnderscore(<string>s) : ''}`
		},
	],
	'brewing_stand': { t: TType.Item },
	'flower_pot': { t: TType.Item },
	'skull': { t: TType.Item, n: 'skull.char' },
	'undyed_shulker_box': { n: 'shulkerBox' },
	'.+_shulker_box': [
		({ name }) => {
			let s = name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			let s2 = [s.pop(), s.pop()].reverse()
			s2.push(s.join('_'))
			return `${upperCaseWhenUnderscore(s2.join('_'))}`
		},
	],
	'wall_banner': 'standing_banner',
	'infested_stone': 'monster_egg.stone',
	'infested_cobblestone': 'monster_egg.cobble',
	'infested_stone_bricks': 'monster_egg.brick',
	'infested_mossy_stone_bricks': 'monster_egg.mossybrick',
	'infested_cracked_stone_bricks': 'monster_egg.crackedbrick',
	'infested_chiseled_stone_bricks': 'monster_egg.chiseledbrick',
	'bee_nest': [
		['state'],
		({ state }) => {
			let s = state('honey_level')
			return [
				{
					translate: `bee.honey.${Number(s == 5)}`,
					with: [`${s}`],
				},
			]
		},
	],
	'beehive': { r: 'bee_nest' },
	'trip_wire': { t: TType.Item, n: 'string' },
	'respawn_anchor': [
		['state'],
		({ state }) => [{ translate: `respawn_anchor.charge`, with: [`${state('respawn_anchor_charge')}`] }],
	],
	'cauldron': [
		['state'],
		({ state }) => [
			{ translate: `cauldron.type.${<number>state('fill_level') > 0 ? state('cauldron_liquid') : 'empty'}` },
		],
	],
	'brown_mushroom_block': [
		['state'],
		({ state }) =>
			`brown_mushroom_block.${
				Object.entries({
					'0': 'mushroom',
					'9': 'cap',
					'10': 'stem',
					'14': 'cap',
					'15': 'stem',
				}).find(v => <number>state('huge_mushroom_bits') <= Number(v[0]))[1]
			}`,
	],
	'red_mushroom_block': [
		['state'],
		({ state }) =>
			Object.entries({
				'0': 'red_mushroom',
				'9': 'red_mushroom_block',
				'10': 'brown_mushroom_block.stem',
				'14': 'red_mushroom_block',
				'15': 'brown_mushroom_block.stem',
			}).find(v => <number>state('huge_mushroom_bits') <= Number(v[0]))[1],
	],
} as ITranslator
