import { AbstractMesh, Animatable, Scene, Vector3 } from '@babylonjs/core';
import { IEntityInstance } from './entity-manager';

export enum EntityType {
  Tile,
  Light,
  Actor,
  Effect
}

interface IEntity {
  readonly type: EntityType;

  // create(position: Vector3): IEntityInstance;
  // remove(instance: IEntityInstance): void;

  // enterEditMode(): void;
  // leaveEditMode(): void;
}

export interface IEditables {
  dispose(): void;
  push(...items: AbstractMesh[]): void;
}

class Editables implements IEditables {
  private editables: AbstractMesh[] = [];

  public dispose(): void {
    for (const editable of this.editables) {
      editable.dispose();
    }
    this.editables.length = 0;
  }

  public push(...editables: AbstractMesh[]): void {
    this.editables.push(...editables);
  }
}

export interface IAnimatables {
  pause(): void;
  restart(): void;
  reset(): void;
  push(...items: Animatable[]): void;
}

class Animatables implements IAnimatables {
  private animatables: Animatable[] = [];
  public pause(): void {
    for (const animatable of this.animatables) {
      animatable.pause();
    }
  }
  public restart(): void {
    for (const animatable of this.animatables) {
      animatable.restart();
    }
  }
  public reset(): void {
    for (const animatable of this.animatables) {
      animatable.reset();
    }
  }

  public push(...animatables: Animatable[]): void {
    for (const animatable of animatables) {
      animatable.pause();
      this.animatables.push(animatable);
    }
  }
}

export abstract class Entity implements IEntity {
  private _animatables: Animatables;
  private _editables: Editables;

  public get animatables(): IAnimatables {
    if (!this._animatables) {
      this._animatables = new Animatables();
    }

    return this._animatables;
  }

  public get editables(): IEditables {
    if (!this._editables) {
      this._editables = new Editables();
    }

    return this._editables;
  }

  public constructor(public readonly type: EntityType) {}

  public abstract onEnterEdit(instances: IEntityInstance[]): void;
  public abstract onLeaveEdit(instances: IEntityInstance[]): void;
  public abstract onStartGame(instances: IEntityInstance[]): void;
  public abstract onPauseGame(instances: IEntityInstance[]): void;
  public abstract onResetGame(instances: IEntityInstance[]): void;

  public abstract createInstance(position: Vector3): IEntityInstance;
  public abstract removeInstance(instance: IEntityInstance): void;

  // pushAnimatable(animatables: Animatable[]): void {}
}
