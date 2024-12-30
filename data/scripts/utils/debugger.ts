const namespace = '\x1B[38;5;208m[WITB]'
const end = '\x1B[0m'

export function error(...s: any) {
	console.error(`§6[WITB]§c[Error] - ${toString(s).replaceAll('§r', '§r§c')}`)
}

export function debug(...s: any) {
	console.log(`${namespace}${getTime()}\x1B[38;5;8m[Debug] - ${toString(s)}${end}`)
}

export function warn(...s: any) {
	console.warn(`§6[WITB]§g[Warn] - ${toString(s).replaceAll('§r', '§r§g')}`)
}

function toString(s: any): any {
	if (Array.isArray(s)) {
		return `[${s.map(toString).join(', ')}]`
	} else if (typeof s === 'object') {
		return `{${Object.keys(s)
			.map(v => `${v}: ${toString(s[v])}`)
			.join(', ')}}`
	} else if (typeof s === 'function') {
		return typeof s
	} else {
		return s?.toString()
	}
}

function getTime() {
	const d = new Date()
	const h = ((d.getUTCHours() + 7) % 24).toString().padStart(2, '0')
	const m = d.getMinutes().toString().padStart(2, '0')
	const sec = d.getSeconds().toString().padStart(2, '0')
	const ms = d.getMilliseconds().toString().padStart(3, '0')
	const tick = +ms / 50 + 0.1
	return `\x1B[38;5;171m[${h}:${m}:${sec}:${ms}]\x1B[38;5;178m[${Math.round(tick)}]`
}
