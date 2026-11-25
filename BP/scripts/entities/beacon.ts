import { world, Dimension, MolangVariableMap, EntityComponentTypes, EntityDieAfterEvent, EntitySpawnAfterEvent, EntityHealthChangedAfterEvent } from '@minecraft/server'

world.afterEvents.entitySpawn.subscribe(onBeaconSpawn)
world.afterEvents.entityHealthChanged.subscribe(onBeaconHealthChanged, {
    entityTypes: ['battle:beacon']
})
world.afterEvents.entityDie.subscribe(onMonsterDie)

function onBeaconSpawn(event: EntitySpawnAfterEvent) {
    const entity = event.entity
    if (entity.typeId !== 'battle:beacon') return

    entity.nameTag = '100/100'
}

function onBeaconHealthChanged(event: EntityHealthChangedAfterEvent) {
    const entity = event.entity
    if (!entity.isValid) return

    const healthComp = entity.getComponent(EntityComponentTypes.Health)
    if (!healthComp) return

    const dimension = entity.dimension
    const hurt = event.newValue < event.oldValue

    if (hurt) {
        if (getCrackedLevel(event.newValue) != getCrackedLevel(event.oldValue)) {
            dimension.playSound('mob.beacon.crack', entity.location, {
                volume: 5.0,
                pitch: getPitch(event.newValue)
            })
        }
        else {
            dimension.playSound('mob.beacon.hurt', entity.location)
        }
        dimension.spawnParticle('battle:glass_shards', entity.getHeadLocation(), createShardParticleMap())
    }
    entity.nameTag = `${Math.floor(healthComp.currentValue)}/100`
    entity.setProperty('battle:cracked_level', getCrackedLevel(event.newValue))
}

function onMonsterDie(event: EntityDieAfterEvent) {
    const entity = event.deadEntity
    if (!entity.isValid) return
    
    const typeFamily = entity.getComponent(EntityComponentTypes.TypeFamily)
    if (!typeFamily || !typeFamily.hasTypeFamily('monster')) return

    const beacons = entity.dimension.getEntities({
        type: 'battle:beacon'
    })

    for (const beacon of beacons) {
        if (!beacon.isValid) continue

        const health = beacon.getComponent('minecraft:health')
        if (!health) continue

        health.setCurrentValue(Math.min(health.effectiveMax, health.currentValue + 5))
    }
}

function getPitch(value: number): number {
    const fraction = value / 100

    if (fraction < 0.25) {
        return 0.7
    }
    if (fraction < 0.5) {
        return 0.8
    }
    if (fraction < 0.75) {
        return 0.9
    }
    return 1.0
}

function getCrackedLevel(value: number): string {
    const fraction = value / 100

    if (fraction < 0.25) {
        return 'high'
    }
    if (fraction < 0.5) {
        return 'medium'
    }
    if (fraction < 0.75) {
        return 'low'
    }
    return 'none'
}

function createShardParticleMap() {
    const particleVariables = new MolangVariableMap()
    particleVariables.setFloat('emitter_radius', 0.75)
    particleVariables.setFloat('velocity_scalar', 2)
    particleVariables.setFloat('emitter_intensity', 4)
    return particleVariables
}