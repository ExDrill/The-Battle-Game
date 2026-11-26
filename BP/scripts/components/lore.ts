import { EntityComponentTypes, ItemStack, RawMessage, system, world } from "@minecraft/server";

const COMPONENT_ID = 'battle:lore'

type LoreComponent = {
    entries: RawMessage[]
}

system.beforeEvents.startup.subscribe(event => {
    event.itemComponentRegistry.registerCustomComponent(COMPONENT_ID, {})
})

world.afterEvents.playerInventoryItemChange.subscribe(event => {
    const stack = event.itemStack
    if (!stack) return

    const player = event.player
    if (!player.isValid) return

    const inventoryComp = player.getComponent(EntityComponentTypes.Inventory)
    if (!inventoryComp) return

    const loreComp = getLoreComponent(stack)
    if (!loreComp) return
 
    const newStack = stack.clone()
    stack.setLore(loreComp.entries)
    
    inventoryComp.container.setItem(event.slot, newStack)
})

export function getLoreComponent(stack: ItemStack): LoreComponent | null {
    if (!stack.hasComponent(COMPONENT_ID)) return null

    const component = stack.getComponent(COMPONENT_ID)!

    const data = component.customComponentParameters.params as any
    const rawEntries = data['entries'] as string[]

    const entries: RawMessage[] = rawEntries.map(entry => ({
        translate: entry
    }))
    
    return {
        entries
    }
}