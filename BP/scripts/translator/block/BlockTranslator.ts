import { ITranslator } from '../../types'
import Crops from './Crops'
import Decoration from './Decoration'
import Glass from './Glass'
import Misc from './Misc'
import Redstone from './Redstone'
import Wood from './Wood'

export default {
	...Crops,
	...Decoration,
	...Glass,
	...Wood,
	...Redstone,
	...Misc,
} as ITranslator
