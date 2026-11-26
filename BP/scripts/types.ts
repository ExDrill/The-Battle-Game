import { Vector3 } from '@minecraft/server'
import PlacedDecorator from './world/decorators/placementConfig'

export type PlacementOptions = {
    count?: number,
    chance?: number,
    spread?: XZSpread,
    blockFilters?: BlockFilter[]
}

export type XZSpread = {
    x: number
    z: number
}

export type BlockFilter = {
    name: string,
    states: Record<string, string | number | boolean>
    offset: Vector3
}

export type DecoratorChoice = {
    decorator: PlacedDecorator,
    weight: number
}

export enum HeightmapType {
    Static = 'static',
    Dynamic = 'dynamic'
}