import { IEntityInstance } from './entity-manager';
import { Vector3 } from '@babylonjs/core';
import { VectorSet } from './vector-set';

export class EntityBlocks {
  private readonly vectorSet: VectorSet;

  private get first(): Vector3 {
    for (const vector of this.vectorSet.values()) {
      return vector;
    }

    return undefined;
  }

  public constructor(minimum: number, maximum: number) {
    this.vectorSet = new VectorSet(minimum, maximum);
  }

  public *find(instances: IEntityInstance[]): IterableIterator<[Vector3, Vector3]> {
    const vectorX = new Vector3(1, 0, 0);
    const vectorY = new Vector3(0, 1, 0);
    const vectorZ = new Vector3(0, 0, 1);

    for (const instance of instances) {
      this.vectorSet.add(instance.position);
    }

    while (this.vectorSet.count > 0) {
      const position1 = this.first.clone();
      const position2 = position1.clone();

      while (this.test(position1, position2.add(vectorX))) position2.addInPlace(vectorX);
      while (this.test(position1, position2.add(vectorZ))) position2.addInPlace(vectorZ);
      while (this.test(position1, position2.add(vectorY))) position2.addInPlace(vectorY);

      this.delete(position1, position2);

      yield [position1, position2];
    }
  }

  private test(vectorA: Vector3, vectorB: Vector3): boolean {
    const vector = Vector3.Zero();

    for (vector.y = vectorA.y; vector.y <= vectorB.y; vector.y++) {
      for (vector.z = vectorA.z; vector.z <= vectorB.z; vector.z++) {
        for (vector.x = vectorA.x; vector.x <= vectorB.x; vector.x++) {
          if (!this.vectorSet.has(vector)) return false;
        }
      }
    }

    return true;
  }

  private delete(vectorA: Vector3, vectorB: Vector3): void {
    const vector = Vector3.Zero();

    for (vector.y = vectorA.y; vector.y <= vectorB.y; vector.y++) {
      for (vector.z = vectorA.z; vector.z <= vectorB.z; vector.z++) {
        for (vector.x = vectorA.x; vector.x <= vectorB.x; vector.x++) {
          this.vectorSet.delete(vector);
        }
      }
    }
  }
}
