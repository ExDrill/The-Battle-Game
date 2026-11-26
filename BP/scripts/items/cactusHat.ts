import { world, EquipmentSlot, EntityDamageCause, EntityComponentTypes } from '@minecraft/server'

world.afterEvents.entityHurt.subscribe(event => {
    const entity = event.hurtEntity
    if (!entity.isValid) return

    const equippableComp = entity.getComponent(EntityComponentTypes.Equippable)
    if (!equippableComp) return

    const source = event.damageSource
    if (!source.damagingEntity || source.cause == EntityDamageCause.thorns) return

    const helmetStack = equippableComp.getEquipment(EquipmentSlot.Head)
    if (!helmetStack || helmetStack.typeId != 'battle:cactus_hat') return
    
    source.damagingEntity.applyDamage(4, {
        cause: EntityDamageCause.thorns,
        damagingEntity: entity
    })

    entity.dimension.playSound('damage.thorns', entity.location)
})