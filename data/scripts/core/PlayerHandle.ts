import { GameMode, Player, system, world } from '@minecraft/server'
import { HandleWorker } from '../HandleWorker'
import Settings from '../Settings'

let isInitialized = false

world.afterEvents.worldInitialize.subscribe(() => {
	const players = world.getPlayers({ excludeGameModes: [GameMode.spectator] })
	players.forEach(startLoop)
	isInitialized = true
})

world.afterEvents.playerSpawn.subscribe(({ player }) => {
	if (!isInitialized) return
	if (player.getGameMode() !== GameMode.spectator) startLoop(player)
})

function startLoop(player: Player) {
	const worker = new HandleWorker(player)

	const n = system.runInterval(() => {
		try {
			if (!player.isValid()) system.clearRun(n)
			handlePlayer(player, worker)
		} catch (e) {
			console.log(e, e.stack)
		}
	}, 1)
}

function handlePlayer(player: Player, worker: HandleWorker) {
	worker.handle(
		player.getEntitiesFromViewDirection(Settings.range)?.[0]?.entity ||
			player.getBlockFromViewDirection(Settings.range)?.block
	)
}
