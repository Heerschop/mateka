import { Vector3, Scene } from '@babylonjs/core';

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

export interface IEntityInstance {}

export abstract class Entity implements IEntity {
  readonly instances: IEntityInstance[];

  constructor(public readonly type: EntityType, protected readonly scene: Scene) {
    this.instances = [];
  }

  abstract enterEditMode(): void;
  abstract leaveEditMode(): void;
  // abstract enterGameMode(): void;
  // abstract leaveGameMode(): void;

  abstract create(position: Vector3): IEntityInstance;
  abstract remove(instance: IEntityInstance): void;
}

export class EntityBuilder {
  private readonly entities: Map<string, IRegisteredEntity>;

  constructor(private readonly scene: Scene) {
    this.entities = new Map();
  }

  createEntity(id: string, position: Vector3): void {
    const registeredEntity = this.entities.get(id);

    if (registeredEntity) {
      if (!registeredEntity.entity) registeredEntity.entity = registeredEntity.construct(this.scene);

      registeredEntity.entity.create(position);
    }
  }

  removeEntity(position: Vector3): void {}

  registerEntity(entities: { [id: string]: EntityConstructor }) {
    for (const [id, constructor] of Object.entries(entities)) {
      this.entities.set(id, {
        entity: null,
        construct: constructor
      });
    }
  }
}
