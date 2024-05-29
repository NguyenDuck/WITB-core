import { world, system, Block, Entity } from '@minecraft/server'
import Settings from './Settings'
import Displayer from './Displayer'
import TranslationService from './translator/Service'
import BlockTranslator from './translator/block/BlockTranslator'
import { Vector3Utils } from '@minecraft/math'

type BlockDistance = {
	value?: Block
	distance: number
}
type EntityDistance = {
	value?: Entity
	distance: number
}
type DistanceSorter = BlockDistance | EntityDistance

function sortFn(a: DistanceSorter, b: DistanceSorter) {
	return a.distance - b.distance
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
	const displayer = new Displayer(player)

	const oldDir = player.getViewDirection()

	function timing() {
		const n = system.runInterval(() => {
			try {
				if (!player.isValid()) return system.clearRun(n)

				const distance: DistanceSorter[] = []

				const block = player.getBlockFromViewDirection(Settings.range)
				const raycast = player.getEntitiesFromViewDirection(Settings.range).sort(sortFn).shift()

				if (block)
					distance.push({
						value: block.block,
						distance: Vector3Utils.distance(player.getHeadLocation(), block.block.center()),
					})
				if (raycast) distance.push({ value: raycast.entity, distance: raycast.distance })

				distance.sort(sortFn)

				TranslationService.handle(player, displayer, distance.shift()?.value)
			} catch (e) {
				if (Settings.debugMode) console.warn(e, e.stack)
			}
		})
	}

	if (initialSpawn) {
		TranslationService.handle(player, displayer, undefined)
		const nu = system.runInterval(() => {
			const r = Vector3Utils.subtract(oldDir, player.getViewDirection())
			if (r.x !== 0 || r.y !== 0 || r.z !== 0) {
				system.run(() => {
					system.clearRun(nu)
					timing()
				})
			}
		}, 1)
	} else timing()
})

Object.entries(BlockTranslator).forEach(([name, value]) => {
	TranslationService.subscribeBlock(name, value)
})
