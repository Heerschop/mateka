import { Entity, EntityType, IEntityInstance } from '../level/entity-builder';
import { BaseParticleSystem, Color3, Color4, GPUParticleSystem, IParticleSystem, Mesh, ParticleSystem, Scene, Texture, Vector3 } from '@babylonjs/core';

export class Flame extends Entity {
  public constructor(scene: Scene) {
    super(EntityType.Light, scene);
  }
  public enterEditMode(): void {
    throw new Error('Method not implemented.');
  }
  public leaveEditMode(): void {
    throw new Error('Method not implemented.');
  }
  public remove(instance: IEntityInstance): void {
    throw new Error('Method not implemented.');
  }

  public create(position: Vector3): IEntityInstance {
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

    particleSystem.start();

    return { position };
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
