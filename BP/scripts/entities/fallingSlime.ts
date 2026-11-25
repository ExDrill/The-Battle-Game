import { world, Dimension, Entity, Vector3, EntityProjectileComponent, EntityTypeFamilyComponent, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, EntityComponentTypes } from '@minecraft/server'

world.afterEvents.projectileHitBlock.subscribe(onProjectileHitBlock)
world.afterEvents.projectileHitEntity.subscribe(onProjectileHitEntity)

function onProjectileHitBlock(event: ProjectileHitBlockAfterEvent) {
    const projectile = event.projectile
    if (!projectile.isValid || projectile.typeId !== 'battle:falling_slime') return

    onSlimeLand(projectile, event.location)
}

function onProjectileHitEntity(event: ProjectileHitEntityAfterEvent) {
    const projectile = event.projectile
    if (!projectile.isValid || projectile.typeId !== 'battle:falling_slime') return

    onSlimeLand(projectile, event.location)
}

function onSlimeLand(projectile: Entity, location: Vector3) {
    const component = projectile.getComponent(EntityComponentTypes.Projectile)
    if (!component) return

    const owner = component.owner
    const dimension = projectile.dimension
    const effectLocation = {
        x: location.x,
        y: location.y + 0.5,
        z: location.z
    }
    if (owner && owner.getProperty('battle:second_phase') as boolean) {
        const targets = getSludgeTargets(effectLocation, dimension)

        for (const target of targets) {
            target.addEffect('slowness', 100, {
                amplifier: 3
            })
        }
        dimension.spawnParticle('battle:slime_bubble_swarm', {
            x: location.x,
            y: location.y + 0.5,
            z: location.z
        })
    }

    const slime = dimension.spawnEntity('battle:slime', location)
    slime.triggerEvent('battle:from_king_jello')
    
    dimension.spawnParticle('battle:small_stomp_emitter', effectLocation)
    dimension.playSound('mob.falling_slime.land', location)

    projectile.remove()
}

function getSludgeTargets(location: Vector3, dimension: Dimension) {
    const searchOptions = dimension.getEntities({
        location,
        maxDistance: 6
    })
    return searchOptions.filter(entity => {
        if (!entity.hasComponent('minecraft:type_family')) {
            return false
        }
        const family = entity.getComponent('minecraft:type_family') as EntityTypeFamilyComponent
        return family.hasTypeFamily('player') || family.hasTypeFamily('summon')
    })
}