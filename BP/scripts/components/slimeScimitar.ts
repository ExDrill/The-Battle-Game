import { ItemComponentHitEntityEvent, Entity, Dimension, system } from '@minecraft/server'
import { VectorUtils } from '../utils/vector'

system.beforeEvents.startup.subscribe(event => {
    event.itemComponentRegistry.registerCustomComponent('battle:slime_scimitar', {
        onHitEntity
    })
})

function onHitEntity(event: ItemComponentHitEntityEvent): void {
    const attacker = event.attackingEntity

    if (canSweep(attacker)) {
        performSweep(attacker, event.hitEntity, attacker.dimension)
    }
}

function performSweep(attacker: Entity, victim: Entity, dimension: Dimension): void {
    const particleLocation = VectorUtils.divide(VectorUtils.add(attacker.getHeadLocation(), victim.location), 2)
    const targets = dimension.getEntities({
        location: attacker.location,
        families: ['monster'],
        maxDistance: 3
    })
    targets.forEach(target => {
        target.addEffect('slowness', 40, { amplifier: 1, showParticles: false })
        dimension.spawnParticle('battle:slime_bubble', target.location)
    })
    dimension.playSound('random.sweep', attacker.location)
    dimension.spawnParticle('battle:sweep', particleLocation)
}

function canSweep(attacker: Entity): boolean {
    return attacker.typeId === 'minecraft:player' && !attacker.isFalling && !attacker.isSprinting
}