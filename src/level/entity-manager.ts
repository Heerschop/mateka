import { Scene, Vector3 } from '@babylonjs/core';

export enum EntityType {
  Tile,
  Light,
  Actor,
  Effect
}
export enum ManagerMode {
  Editing,
  InGame,
  Idle
}

export type EntityConstructor = (scene: Scene) => Entity;

interface IEntity {
  readonly type: EntityType;

  // create(position: Vector3): IEntityInstance;
  // remove(instance: IEntityInstance): void;

  // enterEditMode(): void;
  // leaveEditMode(): void;
}

interface IRegisteredEntity {
  entity: Entity | null;
  instances: IEntityInstance[];
  construct: EntityConstructor;
}

export interface IEntityInstance {
  position: Vector3;
}

export abstract class Entity implements IEntity {
  public constructor(public readonly type: EntityType) {}

  public abstract onEnterEdit(instances: IEntityInstance[]): void;
  public abstract onLeaveEdit(instances: IEntityInstance[]): void;
  public abstract onEnterGame(instances: IEntityInstance[]): void;
  public abstract onLeaveGame(instances: IEntityInstance[]): void;

  public abstract createInstance(position: Vector3): IEntityInstance;
  public abstract removeInstance(instance: IEntityInstance): void;
}

export class EntityManager {
  private readonly entities: Map<string, IRegisteredEntity>;
  private readonly offset = new Vector3(0.5, 0.5, 0.5);
  private _mode: ManagerMode;

  public get mode(): ManagerMode {
    return this._mode;
  }

  public constructor(private readonly scene: Scene) {
    this.entities = new Map();
  }

  public createEntity(id: string, position: Vector3): void {
    const registeredEntity = this.entities.get(id);

    if (registeredEntity) {
      if (!registeredEntity.entity) registeredEntity.entity = registeredEntity.construct(this.scene);

      const instance = registeredEntity.entity.createInstance(position.add(this.offset));

      registeredEntity.instances.push(instance);
    }
  }

  // public removeEntity(position: Vector3): void { }

  public registerEntity(entities: { [id: string]: EntityConstructor }): void {
    for (const [id, constructor] of Object.entries(entities)) {
      this.entities.set(id, {
        entity: null,
        instances: [],
        construct: constructor
      });
    }
  }

  public enterEdit(): void {
    for (const registeredEntity of this.entities.values()) {
      if (registeredEntity.instances.length > 0) {
        registeredEntity.entity.onEnterEdit(registeredEntity.instances);
      }
    }

    this._mode = ManagerMode.Editing;
  }

  public leaveEdit(): void {
    for (const registeredEntity of this.entities.values()) {
      if (registeredEntity.instances.length > 0) {
        registeredEntity.entity.onLeaveEdit(registeredEntity.instances);
      }
    }

    this._mode = ManagerMode.Idle;
  }

  public enterGame(): void {
    for (const registeredEntity of this.entities.values()) {
      if (registeredEntity.instances.length > 0) {
        registeredEntity.entity.onEnterGame(registeredEntity.instances);
      }
    }

    this._mode = ManagerMode.InGame;
  }

  public leaveGame(): void {
    for (const registeredEntity of this.entities.values()) {
      if (registeredEntity.instances.length > 0) {
        registeredEntity.entity.onLeaveGame(registeredEntity.instances);
      }
    }

    this._mode = ManagerMode.Idle;
  }
}
