export const encodeToHex = (n: number) => '|0x'.concat(n.toString(16).padStart(3, '0'))

enum UIEnum {
	ViewDisable,
	UpdateNamespace,
	UpdateDescription,
	RemoveDescription,
	UpdateItemRenderer,
	UpdateEntityRenderer,
}

export default UIEnum
