import { Entity, EntityType, IEntityInstance } from 'game/entity-manager';
import { BaseParticleSystem, Color4, GlowLayer, GPUParticleSystem, HighlightLayer, IParticleSystem, Mesh, ParticleSystem, Scene, Texture, Vector3 } from '@babylonjs/core';
import { EntityBuilder } from 'game/editor/entity-builder';
import { EntityBlocks } from 'game/entity-blocks';
import { IField } from 'game/entity-manager/entity-manager';

export class Flame extends Entity {
  public constructor(private readonly field: IField, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Light);
  }

  public test(data?: string) {
    console.log(data.length);
  }

  public onEnterEdit(instances: IEntityInstance[]): void {
    super.onEnterEdit(instances);
    if (instances.length === 1) {
      return;
    }

    const blocks = new EntityBlocks(this.field.minimum, this.field.maximum);

    for (const [position1, position2] of blocks.find(instances)) {
      const box = this.createBox(position1, position2);

      this.editables.push(box);
    }
  }

  public removeInstance(instance: IEntityInstance): void {}

  public createInstance(position: Vector3): IEntityInstance {
    const particleSystem = this.createParticleSystem(true);
    const emitter0 = Mesh.CreateBox('emitter0', 0.1, this.field.scene);
    emitter0.isVisible = false;

    particleSystem.particleTexture = new Texture('assets/textures/fire.jpg', this.field.scene);
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
    particleSystem.updateSpeed = 0.01;

    this.particles.push(particleSystem);

    return { position };
  }

  private createBox(position1: Vector3, position2: Vector3): Mesh {
    const size = {
      depth: position2.z - position1.z + 1,
      height: position2.y - position1.y + 1,
      width: position2.x - position1.x + 1
    };
    const box = EntityBuilder.createBox('EditWire', size);

    box.position = position1.add(new Vector3(-0.5 + size.width / 2, -0.5 + size.height / 2, -0.5 + size.depth / 2));

    return box;
  }

  private createParticleSystem(useGPU: boolean): IParticleSystem & BaseParticleSystem {
    if (useGPU && GPUParticleSystem.IsSupported) {
      const particleSystem = new GPUParticleSystem('particles', { capacity: 10000 }, this.field.scene);

      particleSystem.activeParticleCount = 768;
      particleSystem.manualEmitCount = particleSystem.activeParticleCount;

      return particleSystem;
    }

    const particleSystem = new ParticleSystem('particles', 10000, this.field.scene);

    particleSystem.manualEmitCount = particleSystem.getCapacity();

    return particleSystem;
  }
}
