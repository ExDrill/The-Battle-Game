import { world } from '@minecraft/server'

world.afterEvents.worldLoad.subscribe(() => {
    world.gameRules.keepInventory = true
    world.gameRules.showCoordinates = true
    world.gameRules.doMobSpawning = false
    world.gameRules.showTags = false
    world.gameRules.pvp = false
    world.gameRules.recipesUnlock = false
    world.gameRules.doLimitedCrafting = true
    world.gameRules.doMobSpawning = false
    world.gameRules.mobGriefing = false
    world.gameRules.doWeatherCycle = false
})