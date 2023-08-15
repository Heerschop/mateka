import { Vector3 } from '@babylonjs/core';

export class VectorMap<T> {
  public readonly size;
  private _count = 0;
  private readonly items: T[][][];
  private readonly offset: Vector3;

  public get count(): number {
    return this._count;
  }

  public constructor(private readonly minimum: number, private readonly maximum: number) {
    const size = maximum - minimum + 1;

    minimum *= -1;

    this.offset = new Vector3(minimum, minimum, minimum);

    this.items = [];

    for (let axisX = 0; axisX < size; axisX++) {
      this.items[axisX] = [];
      for (let axisY = 0; axisY < size; axisY++) {
        this.items[axisX][axisY] = [];
        for (let axisZ = 0; axisZ < size; axisZ++) {
          this.items[axisX][axisY][axisZ] = undefined;
        }
      }
    }

    this.size = size;
  }

  public *entries(): IterableIterator<[Vector3, T]> {
    for (let axisX = 0; axisX < this.size; axisX++) {
      for (let axisY = 0; axisY < this.size; axisY++) {
        for (let axisZ = 0; axisZ < this.size; axisZ++) {
          const value = this.items[axisX][axisY][axisZ];

          if (value) yield [new Vector3(axisX, axisY, axisZ).subtractInPlace(this.offset), value];
        }
      }
    }
  }

  public *keys(): IterableIterator<Vector3> {
    for (let axisX = 0; axisX < this.size; axisX++) {
      for (let axisY = 0; axisY < this.size; axisY++) {
        for (let axisZ = 0; axisZ < this.size; axisZ++) {
          const value = this.items[axisX][axisY][axisZ];

          if (value) yield new Vector3(axisX, axisY, axisZ).subtractInPlace(this.offset);
        }
      }
    }
  }

  public *values(): IterableIterator<T> {
    for (let axisX = 0; axisX < this.size; axisX++) {
      for (let axisY = 0; axisY < this.size; axisY++) {
        for (let axisZ = 0; axisZ < this.size; axisZ++) {
          const value = this.items[axisX][axisY][axisZ];

          if (value) yield value;
        }
      }
    }
  }

  public has(vector: Vector3): boolean {
    const offset = vector.add(this.offset);

    // #!debug
    this.rangeCheck(vector);

    return this.items[offset.x][offset.y][offset.z] !== undefined;
  }

  public get(vector: Vector3): T {
    const offset = vector.add(this.offset);

    // #!debug
    this.rangeCheck(vector);

    return this.items[offset.x][offset.y][offset.z];
  }

  public set(vector: Vector3, value: T): boolean {
    const offset = vector.add(this.offset);

    // #!if debug === 'true'
    this.rangeCheck(vector);

    if (this.items[offset.x][offset.y][offset.z] !== undefined) {
      return false;
    }
    // #!endif

    this.items[offset.x][offset.y][offset.z] = value;

    this._count++;

    return true;
  }

  public clear(): void {
    for (let axisX = 0; axisX < this.size; axisX++) {
      for (let axisY = 0; axisY < this.size; axisY++) {
        for (let axisZ = 0; axisZ < this.size; axisZ++) {
          this.items[axisX][axisY][axisZ] = undefined;
        }
      }
    }
  }

  public delete(vector: Vector3): number {
    const offset = vector.add(this.offset);

    // #!debug
    this.rangeCheck(vector);

    if (this.items[offset.x][offset.y][offset.z] === undefined) {
      throw new Error('Vector not found: ' + JSON.stringify(vector, null, 4));
    }

    this.items[offset.x][offset.y][offset.z] = undefined;

    this._count--;

    return this._count;
  }

  // #!if debug === 'true'
  // #!endif
  private rangeCheck(vector: Vector3): void {
    if (vector.x < this.minimum || vector.x > this.maximum) throw new Error('Vector is out of range: ' + JSON.stringify(vector, null, 4));
    if (vector.y < this.minimum || vector.y > this.maximum) throw new Error('Vector is out of range: ' + JSON.stringify(vector, null, 4));
    if (vector.z < this.minimum || vector.z > this.maximum) throw new Error('Vector is out of range: ' + JSON.stringify(vector, null, 4));
  }
}
