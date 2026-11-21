import { ItemComponentUseEvent, Player, system, CustomComponentParameters, EntityComponentTypes, Entity } from '@minecraft/server'

system.beforeEvents.startup.subscribe(event => {
    event.itemComponentRegistry.registerCustomComponent('battle:pet_summon', {
        onUse
    })
})

function onUse(event: ItemComponentUseEvent, data: CustomComponentParameters): void {
    const user = event.source
    const dimension = user.dimension

    const entityId = (data.params as any)['entity'] ?? 'battle:wolf'

    const entity = dimension.spawnEntity(entityId, user.location)
    setOwner(entity, user)
    clearItem(user)
}

function setOwner(summon: Entity, owner: Player): void {
    const tameable = summon.getComponent('minecraft:tameable')
    if (!tameable) return

    tameable.tame(owner)
}

function clearItem(user: Player): void {
    const inventory = user.getComponent(EntityComponentTypes.Inventory)
    if (!inventory) return

    const container = inventory.container
    container.setItem(user.selectedSlotIndex)
}