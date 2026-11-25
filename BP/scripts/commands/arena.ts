import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, CustomCommandResult, CustomCommandStatus, system } from '@minecraft/server'
import Arena from "../world/arena";

system.beforeEvents.startup.subscribe(event => {
    const registry = event.customCommandRegistry
    
    registry.registerCommand({
        name: 'battle:build_arena',
        description: '',
        permissionLevel: CommandPermissionLevel.Admin,
        cheatsRequired: true,
        mandatoryParameters: [
            {
                type: CustomCommandParamType.String,
                name: 'type'
            },
            {
                type: CustomCommandParamType.Integer,
                name: 'size'
            }
        ]
    }, executeBuild)
})

function executeBuild(origin: CustomCommandOrigin, type: string, size: number): CustomCommandResult {
    const entity = origin.initiator ?? origin.sourceEntity
    if (!entity) {
        return {
            status: CustomCommandStatus.Failure,
            message: 'No entity found'
        }
    }
    const arena = new Arena(entity.dimension, type, size)

    system.run(async () => {
        await arena.build(entity.location)
    })
    
    return {
        status: CustomCommandStatus.Success,
        message: `Building ${type} with size ${size}`
    }
}