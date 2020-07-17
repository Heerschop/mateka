import { Scene, Vector3 } from '@babylonjs/core';
import { EntityBuilder, EntityConstructor } from './entity-builder';

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

  public constructor(scene: Scene) {
    this.entityBuilder = new EntityBuilder(scene);
  }

  public async loadLevel(file: string): Promise<void> {
    const entities = await this.loadSimpleLevel(file);

    for (const entity of entities) {
      this.entityBuilder.createEntity(entity.id, entity.position);
    }
  }

  public createEntity(id: string, position: Vector3): void {
    this.entityBuilder.createEntity(id, position);
  }

  public registerEntity(entities: { [id: string]: EntityConstructor }): void {
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

    return new Vector3(+0.5 + Number.parseInt(items[0], 10), +0.5 + Number.parseInt(items[1], 10), +0.5 + Number.parseInt(items[2], 10));
  }
}
