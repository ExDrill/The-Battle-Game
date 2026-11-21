import { Dimension, Vector3 } from '@minecraft/server'
import { Vector3d, VectorUtils } from '../../utils/vector'
import Random from '../../utils/random'
import ConditionalRule from './conditional_rule'

export default class ScanRule extends ConditionalRule {
    private readonly size: Vector3

    public constructor(size: Vector3) {
        super()
        this.size = size
    }

    public shouldPlace(dimension: Dimension, random: Random, origin: Vector3): boolean {
        for (let x = -this.size.x; x <= this.size.x; x++) {
            for (let y = -this.size.y; y <= this.size.y; y++) {
                for (let z = -this.size.z; z <= this.size.z; z++) {
                    const offset = new Vector3d(x, y, z)
                    const block = dimension.getBlock(VectorUtils.add(origin, offset))

                    if (block && !block.isAir) {
                        return false
                    }
                }
            }
        }
        return true
    }
}