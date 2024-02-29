import { ITranslator, TransType } from '../../types'

export default {
	'redstone_wire': {
		StateHandler: v => [
			undefined,
			{
				translate: 'redstone.power',
				with: [`${v.states.get('redstone_signal')}`],
			},
		],
	},
	'*_repeater': {
		Type: TransType.Item,
		Override: 'repeater',
		StateHandler: v => [
			undefined,
			{
				translate: 'redstone.repeater.delay',
				with: [`${<number>v.states.get('repeater_delay') + 1}`],
			},
		],
	},
	'*_comparator': {
		RequestPermission: ['getRedstonePower'],
		Type: TransType.Item,
		Override: 'comparator',
		StateHandler: v => [
			undefined,
			{
				rawtext: [
					{
						translate: `redstone.comparator.mode.${
							v.states.get('output_subtract_bit') ? 0 : 1
						}`,
					},
					{
						text: '\n§r',
					},
					{
						translate: 'redstone.power',
						with: [`${v.param.get('getRedstonePower')!()}`],
					},
				],
			},
		],
	},
	'daylight_detector': {
		Ref: 'redstone_wire',
	},
	'daylight_detector_inverted': {
		Override: 'daylight_detector',
		StateHandler: v => [
			undefined,
			{
				translate: 'redstone.power',
				with: [`${v.states.get('redstone_signal')}`],
			},
		],
	},
	'sticky_piston_arm_collision': {
		Override: 'sticky_piston',
	},
	'piston_arm_collision': {
		Override: 'piston',
	},
} as ITranslator
