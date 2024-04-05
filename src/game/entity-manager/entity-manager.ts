import { AbstractMesh, Animatable, Scene, Vector3 } from '@babylonjs/core';
import { Entity } from './entity';
import 'extensions/array-remove';
import { VectorMap } from 'game/vector-map';

export enum ManagerMode {
  EnterEdit,
  LeaveEdit,
  StartGame,
  PauseGame,
  ResetGame
}

export type EntityConstructor = (fieldInfo: IField) => Entity;

export interface IEntityInstance {
  position: Vector3;
}

interface IRegisteredEntity {
  entity: Entity | null;
  instances: IEntityInstance[];
  construct: EntityConstructor;
}

interface ICreatedInstance {
  instance: IEntityInstance;
  registeredEntity: IRegisteredEntity;
}

export interface IField {
  readonly scene: Scene;
  readonly minimum: number;
  readonly maximum: number;
}

export class EntityManager {
  private static readonly modes = new Map<ManagerMode, string>([
    [ManagerMode.EnterEdit, 'onEnterEdit'],
    [ManagerMode.LeaveEdit, 'onLeaveEdit'],
    [ManagerMode.StartGame, 'onStartGame'],
    [ManagerMode.PauseGame, 'onPauseGame'],
    [ManagerMode.ResetGame, 'onResetGame']
  ]);
  private readonly entities: Map<string, IRegisteredEntity>;
  private readonly instances: VectorMap<ICreatedInstance>;
  private readonly offset = new Vector3(0.5, 0.5, 0.5);
  private _mode: ManagerMode;

  public get mode(): ManagerMode {
    return this._mode;
  }

  public constructor(private readonly field: IField) {
    this.entities = new Map();
    this.instances = new VectorMap<ICreatedInstance>(field.minimum, field.maximum);
  }

  public appendEntity(id: string, position: Vector3): void {
    if (id === ' ') return;

    const registeredEntity = this.entities.get(id);

    if (!registeredEntity) throw new Error('AppendEntity error, id notfound: ' + id);

    position = position.add(this.offset);
    const value = { instance: null, registeredEntity: registeredEntity };

    if (this.instances.set(position, value)) {
      if (!registeredEntity.entity) registeredEntity.entity = registeredEntity.construct(this.field);

      value.instance = registeredEntity.entity.createInstance(position);

      registeredEntity.instances.push(value.instance);

      if (this._mode === ManagerMode.EnterEdit) {
        // registeredEntity.entity.onEnterEdit([instance]);
        this.setMode(ManagerMode.LeaveEdit);
        this.setMode(ManagerMode.EnterEdit);
      }
    }
  }

  public removeEntity(position: Vector3): void {
    position = position.add(this.offset);

    const instance = this.instances.get(position);

    if (instance) {
      instance.registeredEntity.entity.removeInstance(instance.instance);
      instance.registeredEntity.instances.remove(instance.instance);

      if (this._mode === ManagerMode.EnterEdit) {
        this.setMode(ManagerMode.LeaveEdit);
        this.setMode(ManagerMode.EnterEdit);
      }

      this.instances.delete(position);
    }
  }

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
    this.setMode(ManagerMode.EnterEdit);
  }

  public leaveEdit(): void {
    this.setMode(ManagerMode.LeaveEdit);
  }

  public startGame(): void {
    this.setMode(ManagerMode.StartGame);
  }

  public pauseGame(): void {
    this.setMode(ManagerMode.PauseGame);
  }

  public resetGame(): void {
    this.setMode(ManagerMode.ResetGame);
  }

  private setMode(value: ManagerMode): void {
    const methodName = EntityManager.modes.get(value);

    if (!methodName) {
      throw new Error('Set mode error: mode "' + value + '" not supported.');
    }

    if (value !== this._mode) {
      for (const registeredEntity of this.entities.values()) {
        if (registeredEntity.instances.length > 0) {
          registeredEntity.entity[methodName](registeredEntity.instances);
        }
      }

      this._mode = value;
    }
  }
}
