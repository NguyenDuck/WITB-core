import { ITranslator } from '../../types'

export default {
	'*_stained_glass$': {
		StateHandler: v => {
			let s = v.lang.name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [`${[s.pop(), s.pop()].reverse().join('_')}.${s.join('_')}`]
		},
	},
	'*_stained_glass_pane': {
		StateHandler: v => {
			let s = v.lang.name.split('_')
			if (s[1] == 'gray') {
				s.shift()
				s[0] = 'silver'
			}
			return [`${[s.pop(), s.pop(), s.pop()].reverse().join('_')}.${s.join('_')}`]
		},
	},
} as ITranslator
