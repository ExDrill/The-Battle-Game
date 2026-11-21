import { Entity, EntityComponentTypes, EntityProjectileComponent, EntitySpawnAfterEvent, EquipmentSlot, system, TicksPerSecond, world } from "@minecraft/server";
import { VectorUtils } from "../utils/vector";

const QUIVER_ID = 'battle:quiver'

const CONFIG = {
    maxDistance: 15,
    gravityMultiplier: 0.75,
    redirectDelaySeconds: 0.25
}

world.afterEvents.entitySpawn.subscribe(onEntitySpawn)

function onEntitySpawn(event: EntitySpawnAfterEvent) {
    const entity = event.entity
    if (entity.typeId !== 'minecraft:arrow' || !entity.isValid) return

    const projectileComp = entity.getComponent(EntityComponentTypes.Projectile)
    if (!projectileComp) return
    
    if (!projectileComp.owner || !canApplyQuiver(projectileComp.owner)) return
    
    projectileComp.gravity *= CONFIG.gravityMultiplier

    system.runTimeout(() => {
        if (!entity.isValid || entity.isOnGround) return

        redirectArrow(entity, projectileComp)
    }, CONFIG.redirectDelaySeconds * TicksPerSecond)
}

function redirectArrow(entity: Entity, projectileComp: EntityProjectileComponent): void {
    const closestMonster = entity.dimension.getEntities({
        location: entity.location,
        families: [
            'monster'
        ],
        closest: 1,
        maxDistance: CONFIG.maxDistance
    }).at(0)
    if (!closestMonster) return

    const redirectTarget = VectorUtils.add(closestMonster.location, closestMonster.getAABB().extent)

    const dir = VectorUtils.subtract(redirectTarget, entity.location).normalized()
    const velocity = VectorUtils.multiply(dir, 0.5)
    
    projectileComp.gravity *= 0.5

    projectileComp.shoot(velocity)
}

function canApplyQuiver(owner: Entity): boolean {
    if (!owner.isValid) return false

    const equippableComp = owner.getComponent(EntityComponentTypes.Equippable)
    if (!equippableComp) return false

    const stack = equippableComp.getEquipment(EquipmentSlot.Chest)
    if (!stack) return false

    return stack.typeId === QUIVER_ID
}