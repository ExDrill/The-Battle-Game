import { world, Dimension, Vector3, BlockPermutation } from '@minecraft/server'
import Tile from '../tile'
import Decorator from './decorator'
import { VectorUtils, Vector3d } from '../../utils/vector'
import Random from '../../utils/random'

export default class StructureDecorator extends Decorator {
    private readonly location: string
    private readonly offset: Vector3
    private cache?: Map<Vector3, BlockPermutation>

    public constructor(location: string, offset: Vector3) {
        super()
        this.location = location
        this.offset = offset
    }

    public place(tile: Tile, dimension: Dimension, random: Random, origin: Vector3): void {
        origin = VectorUtils.add(origin, this.offset)
        
        if (!this.cache) {
            this.cache = this.cacheStructure()
        }

        for (const [pos, permutation] of this.cache) {
            const placePos = VectorUtils.add(origin, pos)
    
            const block = dimension.getBlock(placePos)
            if (!block) continue

            block.setPermutation(permutation)
        }
    }

    private cacheStructure(): Map<Vector3, BlockPermutation> {
        const blocks = new Map()

        const structure = world.structureManager.get(this.location)
        if (!structure) return blocks

        const size = structure.size
        
        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                for (let z = 0; z < size.z; z++) {
                    const pos = new Vector3d(x, y, z)
                    const permutation = structure.getBlockPermutation(pos)
                    if (!permutation) continue

                    blocks.set(pos, permutation)
                }
            }
        }
        return blocks
    }
}