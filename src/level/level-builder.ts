import { Scene, Vector3 } from '@babylonjs/core';
import { EntityConstructor, EntityBuilder } from './entity-builder';

interface IVector3 {
  x: number;
  y: number;
  z: number;
}

interface IEntityRef {
  id: string;
  position: Vector3;
}

interface ISimpleLevel {
  tiles: { [y: number]: string[] };
}

export class LevelBuilder {
  private readonly entityBuilder: EntityBuilder;

  constructor(readonly scene: Scene) {
    this.entityBuilder = new EntityBuilder(scene);
  }

  async loadLevel(file: string): Promise<void> {
    const entities = await this.loadSimpleLevel(file);

    for (const entity of entities) {
      this.entityBuilder.createEntity(entity.id, entity.position);
    }
  }

  registerEntity(entities: { [id: string]: EntityConstructor }): void {
    this.entityBuilder.registerEntity(entities);
  }

  private async loadSimpleLevel(file: string): Promise<IEntityRef[]> {
    const response = await fetch(file);
    const level = JSON.parse(await response.text()) as ISimpleLevel;
    const result: IEntityRef[] = [];

    for (const [origin, floor] of Object.entries(level.tiles)) {
      const position = this.parsePosition(origin);
      const originZ = position.z;

      for (const row of floor) {
        position.z = originZ;
        for (const id of row) {
          result.push({
            id: id,
            position: position.clone()
          });
          position.z++;
        }
        position.x++;
      }
    }

    return result;
  }

  private parsePosition(origin: string): Vector3 {
    const items = origin.split(',');

    return new Vector3(+0.5 + Number.parseInt(items[0]), +0.5 + Number.parseInt(items[1]), +0.5 + Number.parseInt(items[2]));
  }
}
