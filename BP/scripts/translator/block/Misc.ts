import { ITranslator, TransType } from '../../types'
import { upperCaseWhenUnderscore } from '../../utils'

export default {
	'*_wool': {
		Ref: '*_concrete$',
	},
	'moss_carpet': {},
	'*_carpet': {
		Ref: '*_concrete$',
	},
	'tallgrass': {
		StateHandler: v => {
			let s = v.states.get('tall_grass_type')
			return [`${v.lang.name}.${s == 'tall' ? 'grass' : s}`]
		},
	},
	'lit_*': {
		StateHandler: v => [v.lang.name.split('lit_')[1]],
	},
	'anvil': {
		StateHandler: v => {
			let s = <string>v.states.get('damage')
			return [`${v.lang.name}${s == 'undamaged' ? '' : '.' + upperCaseWhenUnderscore(s)}`]
		},
	},
	'brewing_stand': {
		Type: TransType.Item,
	},
	'flower_pot': {
		Type: TransType.Item,
	},
	'skull': {
		Type: TransType.Item,
		Override: 'skull.char',
	},
	'undyed_shulker_box': {
		Override: 'shulker_box',
		StateHandler: v => [upperCaseWhenUnderscore(v.lang.name)],
	},
	'*_shulker_box': {
		StateHandler: v => {
			let s = v.lang.name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			let s2 = [s.pop(), s.pop()].reverse()
			s2.push(s.join('_'))
			return [`${upperCaseWhenUnderscore(s2.join('_'))}`]
		},
	},
	'wall_banner': {
		Override: 'standing_banner',
	},
	'monster_egg': {
		StateHandler: v => {
			let s = (<string>v.states.get('monster_egg_stone_type'))
				.replace(/[\_]/g, '')
				.replace('stone', '')
			return [`monster_egg${s ? '.' + s : ''}`]
		},
	},
	'bee_nest': {
		StateHandler: v => {
			let s = v.states.get('honey_level')
			return [
				undefined,
				{
					translate: `bee.honey.${Number(s == 5)}`,
					with: [`${s}`],
				},
			]
		},
	},
	'beehive': {
		Ref: 'bee_nest',
	},
	'trip_wire': {
		Type: TransType.Item,
		Override: 'string',
	},
	'respawn_anchor': {
		StateHandler: v => [
			undefined,
			{
				translate: 'respawn_anchor.charge',
				with: [`${v.states.get('respawn_anchor_charge')}`],
			},
		],
	},
} as ITranslator
