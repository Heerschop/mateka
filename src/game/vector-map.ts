import { Vector3 } from '@babylonjs/core';

export class VectorMap<T> {
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
    vector = vector.add(this.offset);

    if (this.values[vector.x][vector.y][vector.z] === undefined) {
      if (value !== undefined) this._count++;
    } else {
      if (value === undefined) this._count--;
    }

    this.values[vector.x][vector.y][vector.z] = value;

    return this._count;
  }

  public remove(vector: Vector3): number {
    return this.add(vector, undefined);
  }
}
