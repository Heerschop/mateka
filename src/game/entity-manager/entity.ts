import { AbstractMesh, Animatable, IDisposable, IParticleSystem, Vector3 } from '@babylonjs/core';
import { IEntityInstance } from './entity-manager';
import { EntityBuilder } from 'game/editor/entity-builder';

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
  push(...editables: AbstractMesh[]): void;
}

class Editables implements IEditables {
  private editables: IDisposable[] = [];

  public dispose(): void {
    for (const editable of this.editables) {
      editable.dispose();
    }
    this.editables.length = 0;
  }

  public push(...editables: IDisposable[]): void {
    this.editables.push(...editables);
  }
}

export interface IAnimatables {
  start(): void;
  pause(): void;
  reset(): void;
  push(...animatables: Animatable[]): void;
}

class Animatables implements IAnimatables {
  private animatables: Animatable[] = [];
  public pause(): void {
    for (const animatable of this.animatables) {
      animatable.pause();
    }
  }
  public start(): void {
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

export interface IParticles {
  start(): void;
  pause(): void;
  reset(): void;
  push(...particles: IParticleSystem[]): void;
}

interface IParticleSystemInstance {
  system: IParticleSystem;
  speed: number;
}

class Particles implements IParticles {
  private particles: IParticleSystemInstance[] = [];

  public pause(): void {
    for (const particle of this.particles) {
      particle.system.updateSpeed = 0;
    }
  }

  public start(): void {
    for (const particle of this.particles) {
      particle.system.updateSpeed = particle.speed;
    }
  }

  public reset(): void {
    for (const particle of this.particles) {
      particle.system.reset();
    }
  }

  public push(...particles: IParticleSystem[]): void {
    for (const particle of particles) {
      this.particles.push({
        system: particle,
        speed: particle.updateSpeed
      });

      particle.updateSpeed = 0;
      particle.start();
    }
  }
}

export abstract class Entity implements IEntity {
  private _animatables: Animatables;
  private _particles: Particles;
  private _editables: Editables;

  public get animatables(): IAnimatables {
    if (!this._animatables) this._animatables = new Animatables();

    return this._animatables;
  }

  public get particles(): IParticles {
    if (!this._particles) this._particles = new Particles();

    return this._particles;
  }

  public get editables(): IEditables {
    if (!this._editables) this._editables = new Editables();

    return this._editables;
  }

  public constructor(public readonly type: EntityType) {}

  public onEnterEdit(instances: IEntityInstance[]): void {
    for (const instance of instances) {
      const box = EntityBuilder.createBox('EditWire');

      box.position = instance.position;

      this.editables.push(box);
    }
  }

  public onLeaveEdit(instances: IEntityInstance[]): void {
    if (!!this._editables) this._editables.dispose();
  }

  public onStartGame(instances: IEntityInstance[]): void {
    if (!!this._animatables) this._animatables.start();
    if (!!this._particles) this._particles.start();
  }
  public onPauseGame(instances: IEntityInstance[]): void {
    if (!!this._animatables) this._animatables.pause();
    if (!!this._particles) this._particles.pause();
  }
  public onResetGame(instances: IEntityInstance[]): void {
    if (!!this._animatables) this._animatables.reset();
    if (!!this._particles) this._particles.reset();
  }

  public abstract createInstance(position: Vector3): IEntityInstance;
  public abstract removeInstance(instance: IEntityInstance): void;
}
