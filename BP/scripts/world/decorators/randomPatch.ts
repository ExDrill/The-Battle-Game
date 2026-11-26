import { Dimension, Vector3 } from '@minecraft/server'
import Tile from '../tile'
import Decorator from './decorator'
import PlacedDecorator from './placementConfig'
import { Vector3d } from '../../utils/vector'
import Random from '../../utils/random'

export default class RandomPatchDecorator extends Decorator {
    private decorator: PlacedDecorator
    private tries: number
    private xzSpread: number
    private ySpread: number

    public constructor(decorator: PlacedDecorator, tries: number, xzSpread: number, ySpread: number) {
        super()
        this.decorator = decorator
        this.tries = tries
        this.xzSpread = xzSpread
        this.ySpread = ySpread
    }

    public place(tile: Tile, dimension: Dimension, random: Random, origin: Vector3): void {
        const xz = this.xzSpread + 1
        const y = this.ySpread + 1

        const block = dimension.getBlock(origin)
        if (!block) return

        for (let i = 0; i < this.tries; i++) {
            const xOffset = random.nextInt(xz) - random.nextInt(xz)
            const yOffset = random.nextInt(y) - random.nextInt(y)
            const zOffset = random.nextInt(xz) - random.nextInt(xz)

            const shiftedBlock = block.offset(new Vector3d(xOffset, yOffset, zOffset))
            if (!shiftedBlock) continue

            this.decorator.place(tile, dimension, random, shiftedBlock.location)
        }
    }
}