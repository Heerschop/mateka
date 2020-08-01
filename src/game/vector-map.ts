import { Vector3 } from '@babylonjs/core';

export class VectorMap<T> {
  public readonly size;
  private _count = 0;
  private readonly values: T[][][];
  private readonly offset: Vector3;

  public get count(): number {
    return this._count;
  }

  public constructor(minimum: number, maximum: number) {
    const size = maximum - minimum;

    minimum *= -1;

    this.offset = new Vector3(minimum, minimum, minimum);

    this.values = [];

    for (let axisX = 0; axisX < size; axisX++) {
      this.values[axisX] = [];
      for (let axisY = 0; axisY < size; axisY++) {
        this.values[axisX][axisY] = [];
        for (let axisZ = 0; axisZ < size; axisZ++) {
          this.values[axisX][axisY][axisZ] = undefined;
        }
      }
    }

    this.size = size;
  }

  public *entries(): Generator<[Vector3, T]> {
    for (let axisX = 0; axisX < this.size; axisX++) {
      for (let axisY = 0; axisY < this.size; axisY++) {
        for (let axisZ = 0; axisZ < this.size; axisZ++) {
          const value = this.values[axisX][axisY][axisZ];

          if (value) yield [new Vector3(axisX, axisY, axisZ).subtract(this.offset), value];
        }
      }
    }
  }

  public contains(vector: Vector3): boolean {
    vector = vector.add(this.offset);

    return this.values[vector.x][vector.y][vector.z] !== undefined;
  }

  public get(vector: Vector3): T {
    vector = vector.add(this.offset);

    return this.values[vector.x][vector.y][vector.z];
  }

  public add(vector: Vector3, value: T): number {
    const offset = vector.add(this.offset);

    // #!if debug === 'true'
    if (this.values[offset.x][offset.y][offset.z] !== undefined) {
      throw new Error('Vector already exists: ' + JSON.stringify(vector));
    }
    // #!endif

    this.values[offset.x][offset.y][offset.z] = value;

    this._count++;

    return this._count;
  }

  public remove(vector: Vector3): number {
    const offset = vector.add(this.offset);

    // #!if debug === 'true'
    if (this.values[offset.x][offset.y][offset.z] === undefined) {
      throw new Error('Vector not found: ' + JSON.stringify(vector));
    }
    // #!endif

    this.values[offset.x][offset.y][offset.z] = undefined;

    this._count--;

    return this._count;
  }
}
