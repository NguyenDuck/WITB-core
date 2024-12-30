import {
	Anchor,
	BindingCondition,
	BindingName,
	BindingType,
	Files,
	FontSize,
	Random,
	Renderer,
	UI
} from 'jsonui-scripting'

const base_gradient = UI.custom(Renderer.Gradient, {
	color1: '$color',
	color2: '$color',
	alpha: '$bg_alpha',
	size: 20,
})

const background = UI.extend(base_gradient, {
	$color: '$background_color',
	alpha: 0.75,
})

const borders = [...genBorder(7, Anchor.TopLeft), ...genBorder(7, Anchor.TopRight), ...genBorder(7, Anchor.BottomLeft), ...genBorder(7, Anchor.BottomRight)]

function genBorder(radius: number, anchor: Anchor) {
	let r = []

	let start = Math.PI
	let limit = Math.PI * 1.5

	switch (anchor) {
		case Anchor.BottomRight: {
			start = 0
			limit = Math.PI * 0.5
			break
		}
		case Anchor.BottomLeft: {
			start = Math.PI * 0.5
			limit = Math.PI
			break
		}
		case Anchor.TopLeft: {
			start = Math.PI
			limit = Math.PI * 1.5
			break
		}
		case Anchor.TopRight: {
			start = Math.PI * 1.5
			limit = Math.PI * 2
			break
		}
	}

	let lX: number
	let lY: number
	for (let angle = start; angle < limit; angle += 0.001) {
		let x = Math.round(radius * Math.cos(angle))
		let y = Math.round(radius * Math.sin(angle))
		if (lX !== x || lY !== y) {
			lX = x
			lY = y
			r.push(UI.extend(background, { anchor, size: 1, x, y, $color: '$outline_color' }))
		}
	}
	return r
}

const border = UI.extend(background, { size: 400 })
borders.forEach(b => border.addChild(b))

const not_translatable_label = UI.label({
	text: '#text',
	localize: false,
	shadow: true,
	font_scale_factor: 0.25,
	font_size: FontSize.ExtraLarge,
})

const title = UI.extend(not_translatable_label)
const htts = BindingName.HudTitleTextString
const b1 = `#${Random.getName(10)}`
const b2 = `#text`
title.addChild(
	UI.label({ size: 0 }).addBindings([
		{
			binding_name: htts,
			binding_name_override: b1,
		},
		{
			binding_name: htts,
			binding_name_override: b2,
			binding_condition: BindingCondition.VisibilityChanged,
		},
		{
			binding_type: BindingType.View,
			source_property_name: [`(${b1}^'|0x')&(${b1}!=${b2})`],
			target_property_name: BindingName.Visible,
		},
	])
)

const main = UI.panel({
	anchor: Anchor.TopRight,
	offset: '$offset',
	$offset: [0, 0],
}).addVariables({ $pre_release: { $offset: [0, 25] } })

Files.HudScreen('root_panel').modify.controls.insertFront(main)
main.addChild(title, v => {
	console.log(v['name'])
	// main.addBindings({
	// 	source_control_name: v.getUI(),
	// 	source_property_name: '#text != "xlrq"',
	// 	target_property_name: BindingName.Visible,
	// })
})

