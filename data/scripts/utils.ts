import { BlockPermutation } from '@minecraft/server'
import { type MinecraftEnchantmentTypes } from '@minecraft/vanilla-data'

export const isPermutationEquals = (a: BlockPermutation, b: BlockPermutation) => a.matches(b.type.id, b.getAllStates())

export type BlockStateValue = string | number | boolean
export type BlockStateRecord = Record<string, BlockStateValue>
export type BlockStateMap = Map<string, BlockStateValue>

export const upperCaseUnderscore = (s: string) => s.replace(/_./g, m => m[1].toUpperCase())
export const uppercase = (s: string) => s.replace(/(?<![a-z])./g, m => m.toUpperCase()).replaceAll('_', ' ')

export const getLength = (s: string) => s.length.toString().padStart(2, '0')
export const ln = '\n'
export const sign = '§'
export function equals(o1: any, o2: any) {
	if ((o1 === null) !== (o2 === null)) return false
	if (typeof o1 !== typeof o2) return false
	if (o1 instanceof Map && o2 instanceof Map) return [...o1.entries()].every(([k, v]) => equals(v, o2.get(k)))
	if (Array.isArray(o1) && Array.isArray(o2))
		return o1.length === o2.length && o1.every(v => o2.some(v1 => equals(v, v1)))
	if (typeof o1 === 'object') return Object.keys(o1).every(k => equals(o1[k], o2[k]))
	return o1 === o2
}

export const toFunction = (v: string) => Function(`return ${v}`)()
export const isVanilla = (s: string) => /^(minecraft){1}/.test(s)

//@ts-ignore
export const EnchantmentsTranslator: { [k: keyof typeof MinecraftEnchantmentTypes]: string } = {
	aqua_affinity: 'waterWorker',
	bane_of_arthropods: 'damage.arthropods',
	binding: 'curse.binding',
	blast_protection: 'protect.explosion',
	channeling: 'tridentChanneling',
	depth_strider: 'waterWalker',
	efficiency: 'digging',
	feather_falling: 'protect.fall',
	fire_aspect: 'fire',
	fire_protection: 'protect.fire',
	flame: 'arrowFire',
	fortune: 'lootBonusDigger',
	frost_walker: 'frostwalker',
	impaling: 'tridentImpaling',
	infinity: 'arrowInfinite',
	looting: 'lootBonus',
	loyalty: 'tridentLoyalty',
	luck_of_the_sea: 'lootBonusFishing',
	lure: 'fishingSpeed',
	multishot: 'crossbowMultishot',
	piercing: 'crossbowPiercing',
	power: 'arrowDamage',
	punch: 'arrowKnockback',
	quick_charge: 'crossbowQuickCharge',
	respiration: 'oxygen',
	sharpness: 'damage.all',
	smite: 'damage.undead',
	unbreaking: 'durability',
	vanishing: 'curse.vanishing',
	protection: 'protect.all',
	projectile_protection: 'protect.projectile',
	silk_touch: 'untouching',
	riptide: 'tridentRiptide',
	breach: 'heavy_weapon.breach',
	density: 'heavy_weapon.density',
	wind_burst: 'heavy_weapon.windburst',
}
