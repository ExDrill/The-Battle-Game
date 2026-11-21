import { Vector3, Vector2 } from '@minecraft/server'

export class Vector3d implements Vector3 {
    public x: number
    public y: number
    public z: number

    public constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    public length(): number {
        return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2))
    }

    public normalized(): Vector3 {
        return {
            x: this.x / this.length(),
            y: this.y / this.length(),
            z: this.z / this.length()
        }
    }
}

export class Vector2d implements Vector2 {
    public x: number
    public y: number

    public constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public length() {
        return Math.sqrt((this.x ** 2) + (this.y ** 2))
    }

    public normalized(): Vector2 {
        return {
            x: this.x / this.length(),
            y: this.y / this.length()
        }
    }
}

export class VectorUtils {

    public static readonly ZERO: Vector3 = new Vector3d(0, 0, 0)

    public static add(first: Vector3, second: Vector3): Vector3d {
        return new Vector3d(first.x + second.x, first.y + second.y, first.z + second.z)
    }

    public static subtract(first: Vector3, second: Vector3): Vector3d {
        return new Vector3d(first.x - second.x, first.y - second.y, first.z - second.z)
    }
    
    public static multiply(first: Vector3, second: Vector3 | number): Vector3d {
        if (typeof second == 'number') {
            return new Vector3d(first.x * second, first.y * second, first.z * second)
        }
        
        return new Vector3d(first.x * second.x, first.y * second.y, first.z * second.z)
    }

    public static divide(first: Vector3, second: Vector3 | number): Vector3d {
        if (typeof second == 'number') {
            return new Vector3d(first.x / second, first.y / second, first.z / second)
        }
        return new Vector3d(first.x / second.x, first.y / second.y, first.z / second.z)
    }

    public static distance(first: Vector3, second: Vector3): number {
        return Math.hypot(first.x - second.x, first.y - second.y, first.z - second.z)
    }
}