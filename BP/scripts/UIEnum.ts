export const encodeToHex = (n: number) => '|0x'.concat(n.toString(16).padStart(3, '0'))

enum UIEnum {
	// General
	GeneralViewDisabled,
	GeneralViewNamespace,
	GeneralViewDescription,

	// Item
	ItemRendererChanged,

	// Entity
	EntityRendererChanged,
}

export default UIEnum
