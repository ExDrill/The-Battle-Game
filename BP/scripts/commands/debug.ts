import { CommandPermissionLevel, CustomCommandResult, CustomCommandStatus, system, world } from "@minecraft/server";

system.beforeEvents.startup.subscribe(event => {
    const registry = event.customCommandRegistry
    
    registry.registerCommand({
        name: 'battle:toggle_debug',
        description: '',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        cheatsRequired: true,
        mandatoryParameters: []
    }, execute)
})

function execute(): CustomCommandResult {
    const debugWorld = world.getDynamicProperty('battle:debug_world') as boolean ?? false
    world.setDynamicProperty('battle:debug_world', !debugWorld)

    return {
        status: CustomCommandStatus.Success,
        message: `Debug mode is now ${!debugWorld ? 'enabled' : 'disabled'}`
    }
}