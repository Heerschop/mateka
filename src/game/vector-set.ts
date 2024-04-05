import { Vector3 } from '@babylonjs/core';
import { VectorMap } from './vector-map';

export class VectorSet {
  public readonly size;
  public readonly has: (vector: Vector3) => boolean;
  public readonly entries: () => IterableIterator<[Vector3, Vector3]>;
  public readonly delete: (vector: Vector3) => void;
  public readonly clear: () => void;
  public readonly values: () => IterableIterator<Vector3>;

  private readonly vectorMap: VectorMap<Vector3>;

  public get count(): number {
    return this.vectorMap.count;
  }

  public constructor(minimum: number, maximum: number) {
    this.vectorMap = new VectorMap<Vector3>(minimum, maximum);
    this.size = this.vectorMap.size;

    this.has = this.vectorMap.has.bind(this.vectorMap);
    this.entries = this.vectorMap.entries.bind(this.vectorMap);
    this.delete = this.vectorMap.delete.bind(this.vectorMap);
    this.clear = this.vectorMap.clear.bind(this.vectorMap);
    this.values = this.vectorMap.values.bind(this.vectorMap);
  }

  // add
  public add(vector: Vector3): boolean {
    return this.vectorMap.set(vector, vector);
  }
}
