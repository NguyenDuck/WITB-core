export function encodeToHex(n: number) {
	return '|0x'.concat(n.toString(16).padStart(3, '0'))
}

enum UIEnum {
	// General
	GeneralViewDisabled,
	GeneralViewNamespace,
	GeneralViewDescription,
	// Item
	ItemRendererChanged,
	// Entity
	EntityRendererChanged,
	// Entity Heart
	EntityHeart1,
	EntityHeart2,
	EntityHeart3,
	EntityHeart4,
	EntityHeart5,
	EntityHeart6,
	EntityHeart7,
	EntityHeart8,
	EntityHeart9,
	EntityHeart10,
	EntityHeart11,
	EntityHeart12,
	EntityHeart13,
	EntityHeart14,
	EntityHeart15,
	EntityHeart16,
	EntityHeart17,
	EntityHeart18,
	EntityHeart19,
	EntityHeart20,
	EntityHeartMax1,
	EntityHeartMax2,
	EntityHeartMax3,
	EntityHeartMax4,
	EntityHeartMax5,
	EntityHeartMax6,
	EntityHeartMax7,
	EntityHeartMax8,
	EntityHeartMax9,
	EntityHeartMax10,
	EntityHeartMax11,
	EntityHeartMax12,
	EntityHeartMax13,
	EntityHeartMax14,
	EntityHeartMax15,
	EntityHeartMax16,
	EntityHeartMax17,
	EntityHeartMax18,
	EntityHeartMax19,
	EntityHeartMax20,
	EntityHeartAlone,
}

export default UIEnum
