import { world, system, Block, Entity, Vector } from '@minecraft/server'
import Settings from './Settings'
import Displayer from './Displayer'
import TranslationService from './translator/Service'
import BlockTranslator from './translator/block/BlockTranslator'

type BlockDistance = {
	value?: Block
	distance: number
}
type EntityDistance = {
	value?: Entity
	distance: number
}
type DistanceSorter = BlockDistance | EntityDistance

world.afterEvents.playerSpawn.subscribe(({ player }) => {
	const displayer = new Displayer(player)

	const n = system.runInterval(() => {
		try {
			if (!player.isValid()) return system.clearRun(n)

			const distance: DistanceSorter[] = []

			const block = player.getBlockFromViewDirection(Settings.range)
			const raycast = player
				.getEntitiesFromViewDirection(Settings.range)
				.sort((a, b) => a.distance - b.distance)
				.shift()

			if (block)
				distance.push({
					value: block.block,
					distance: Vector.distance(player.getHeadLocation(), block.block.location),
				})
			if (raycast) distance.push({ value: raycast.entity, distance: raycast.distance })

			distance.sort((a, b) => a.distance - b.distance)

			TranslationService.handle(player, displayer, distance.pop()?.value)
		} catch (e) {
			if (Settings.debugMode) console.warn(e, e.stack)
		}
	}, Settings.poseInterval)
})

Object.entries(BlockTranslator).forEach(([name, value]) => {
	TranslationService.subscribeBlock(name, value)
})
