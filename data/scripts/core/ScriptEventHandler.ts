import { ScriptEventCommandMessageAfterEvent, system } from '@minecraft/server'
import { ScriptEventTypes, TranslationHandler } from 'witb-api'
import TranslationManager from '../TranslationManager'

const internal_handler: Map<string, (e: ScriptEventCommandMessageAfterEvent) => void> = new Map([
	[ScriptEventTypes.RegisterHandler, onRegisterHandler],
	[ScriptEventTypes.AddGlobalFunction, onAddGlobalFunction],
])

system.afterEvents.scriptEventReceive.subscribe(e => internal_handler.get(e.id)?.(e), {
	namespaces: ['witb'],
})

function onRegisterHandler({ message }: ScriptEventCommandMessageAfterEvent) {
	const data = <TranslationHandler>JSON.parse(message)
	const { namespace, block_matcher, block_matchers, options } = data
	if (block_matchers) {
		for (const matcher of block_matchers) {
			TranslationManager.register(namespace, ...matcher)
		}
	} else TranslationManager.register(namespace, block_matcher, options)
}

function onAddGlobalFunction({ message }: ScriptEventCommandMessageAfterEvent) {
	const data = JSON.parse(message)
	const { namespace, name, fn } = data
	TranslationManager.registerGlobal(namespace, name, fn)
}
