import { Dimension, Vector3 } from '@minecraft/server';
import { HeightmapType } from '../../types'
import { Vector3d, VectorUtils } from '../../utils/vector'
import Random from '../../utils/random';
import Tile from '../tile'
import PlacementRule from './placement_rule'

export default class HeightmapRule extends PlacementRule {
    private readonly heightmapType: HeightmapType

    public constructor(heightmapType: HeightmapType) {
        super()
        this.heightmapType = heightmapType
    }

    public getPositions(tile: Tile, dimension: Dimension, random: Random, origin: Vector3): Vector3[] {
        if (this.heightmapType == HeightmapType.Static) {
            const surfacePos = tile.getSurfacePos(origin)
            if (!surfacePos) return []

            return [ VectorUtils.add(surfacePos, new Vector3d(0, 1, 0)) ]
        }
        const surfacePos = this.getDynamicSurfacePos(dimension, origin)
        if (!surfacePos) {
            return []
        }
        return [surfacePos]
    }

    private getDynamicSurfacePos(dimension: Dimension, origin: Vector3): Vector3 | false {
        const hit = dimension.getBlockFromRay(VectorUtils.add(origin, new Vector3d(0, 32, 0)), new Vector3d(0, -1, 0), {
            includePassableBlocks: true,
            maxDistance: 64
        })
        if (!hit) return false
        
        return VectorUtils.add(hit.block.location, new Vector3d(0, 1, 0))
    }
}

