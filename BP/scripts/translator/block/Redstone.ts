import { ITranslator, TType } from '../../types'
import { ln } from '../../utils'

export default {
	'redstone_wire': [
		['state'],
		({ state }) => [{ translate: 'redstone.power', with: [`${state('redstone_signal')}`] }],
	],
	'.+_repeater': [
		['state'],
		{ t: TType.Item, n: 'repeater' },
		({ state }) => [{ translate: 'redstone.repeater.delay', with: [`${<number>state('repeater_delay') + 1}`] }],
	],
	'.+_comparator': [
		['state', 'redstonePower'],
		{ t: TType.Item, n: 'comparator' },
		({ state, redstonePower }) => [
			{
				rawtext: [
					{ translate: `redstone.comparator.mode.${state('output_subtract_bit') ? 0 : 1}` },
					{ text: `${ln}§r` },
					{ translate: 'redstone.power', with: [`${redstonePower}`] },
				],
			},
		],
	],
	'daylight_detector': { r: 'redstone_wire' },
	'daylight_detector_inverted': [
		['state'],
		{ n: 'daylight_detector' },
		({ state }) => [{ translate: 'redstone.power', with: [`${state('redstone_signal')}`] }],
	],
	'sticky_piston_arm_collision': 'sticky_piston',
	'piston_arm_collision': 'piston',
} as ITranslator
