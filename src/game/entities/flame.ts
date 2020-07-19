import { Entity, EntityType, IEntityInstance } from 'game/entity-manager';
import { BaseParticleSystem, Color3, Color4, GlowLayer, GPUParticleSystem, HighlightLayer, IParticleSystem, Mesh, ParticleSystem, Scene, Texture, Vector3 } from '@babylonjs/core';
import { EntityBuilder } from 'game/editor/entity-builder';

interface IFlameInstance extends IEntityInstance {
  editInstance?: Mesh;
  particleSystem: IParticleSystem;
}

export class Flame extends Entity {
  public constructor(private readonly scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Light);
  }

  public onStartGame(instances: IFlameInstance[]): void {
    for (const instance of instances) {
      instance.particleSystem.updateSpeed = 0.01;
      instance.particleSystem.start();
    }
  }
  public onPauseGame(instances: IFlameInstance[]): void {
    for (const instance of instances) {
      instance.particleSystem.updateSpeed = 0;
    }
  }

  public onResetGame(instances: IFlameInstance[]): void {
    for (const instance of instances) {
      instance.particleSystem.reset();
    }
  }

  public onEnterEdit(instances: IFlameInstance[]): void {
    for (const instance of instances) {
      const box = EntityBuilder.createBox('FlameWire');

      box.position = instance.position;

      instance.editInstance = box;
    }
  }

  public onLeaveEdit(instances: IFlameInstance[]): void {
    for (const instance of instances) {
      instance.editInstance.dispose();
      instance.editInstance = undefined;
    }
  }

  public removeInstance(instance: IFlameInstance): void {
    throw new Error('Method not implemented.');
  }

  public createInstance(position: Vector3): IFlameInstance {
    // var particleSystem = new ParticleSystem("particles", 10000, this.scene);
    const particleSystem = this.createParticleSystem(true);
    const emitter0 = Mesh.CreateBox('emitter0', 0.1, this.scene);
    emitter0.isVisible = false;

    particleSystem.particleTexture = new Texture('https://www.babylonjs-playground.com/textures/fire.jpg', this.scene);
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    particleSystem.minAngularSpeed = -0.5;
    particleSystem.maxAngularSpeed = 0.5;
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 2.0;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 4.0;
    particleSystem.emitter = emitter0;
    particleSystem.emitRate = 400;
    particleSystem.color1 = new Color4(1.0, 0.0, 0.0, 1.0);
    particleSystem.color2 = new Color4(0.0, 1.0, 1.0, 1.0);

    particleSystem.minEmitBox = position.subtract(new Vector3(0, 0.3, 0));
    particleSystem.maxEmitBox = position.subtract(new Vector3(0, 0.3, 0));

    particleSystem.direction1 = new Vector3(-1, 1, -1);
    particleSystem.direction2 = new Vector3(1, 1, 1);

    particleSystem.gravity = new Vector3(0, -2.0, 0);

    return { position, particleSystem };
  }

  private createParticleSystem(useGPU: boolean): IParticleSystem & BaseParticleSystem {
    if (useGPU && GPUParticleSystem.IsSupported) {
      const particleSystem = new GPUParticleSystem('particles', { capacity: 10000 }, this.scene);

      particleSystem.activeParticleCount = 768;
      particleSystem.manualEmitCount = particleSystem.activeParticleCount;

      return particleSystem;
    }

    const particleSystem = new ParticleSystem('particles', 10000, this.scene);

    particleSystem.manualEmitCount = particleSystem.getCapacity();

    return particleSystem;
  }
}
