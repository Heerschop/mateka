import { Scene, Vector3 } from '@babylonjs/core';

export enum EntityType {
  Tile,
  Light,
  Actor,
  Effect
}

export type EntityConstructor = (scene: Scene) => IEntity;

interface IEntity {
  readonly type: EntityType;

  create(position: Vector3): void;
  remove(instance: IEntityInstance): void;

  enterEditMode(): void;
  leaveEditMode(): void;
}

interface IRegisteredEntity {
  entity: IEntity | null;
  construct: EntityConstructor;
}

export interface IEntityInstance {
  position: Vector3;
}

export abstract class Entity implements IEntity {
  public readonly instances: IEntityInstance[];

  public constructor(public readonly type: EntityType, protected readonly scene: Scene) {
    this.instances = [];
  }

  public abstract enterEditMode(): void;
  public abstract leaveEditMode(): void;
  // abstract enterGameMode(): void;
  // abstract leaveGameMode(): void;

  public abstract create(position: Vector3): IEntityInstance;
  public abstract remove(instance: IEntityInstance): void;
}

export class EntityBuilder {
  private readonly entities: Map<string, IRegisteredEntity>;

  public constructor(private readonly scene: Scene) {
    this.entities = new Map();
  }

  public createEntity(id: string, position: Vector3): void {
    const registeredEntity = this.entities.get(id);

    if (registeredEntity) {
      if (!registeredEntity.entity) registeredEntity.entity = registeredEntity.construct(this.scene);

      registeredEntity.entity.create(position.add(new Vector3(0.5, 0.5, 0.5)));
    }
  }

  public removeEntity(position: Vector3): void {}

  public registerEntity(entities: { [id: string]: EntityConstructor }): void {
    for (const [id, constructor] of Object.entries(entities)) {
      this.entities.set(id, {
        entity: null,
        construct: constructor
      });
    }
  }
}
