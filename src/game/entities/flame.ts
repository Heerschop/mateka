import { Entity, EntityType, IEntityInstance } from '../entity-manager';
import { BaseParticleSystem, Color3, Color4, GlowLayer, GPUParticleSystem, HighlightLayer, IParticleSystem, Mesh, ParticleSystem, Scene, Texture, Vector3 } from '@babylonjs/core';

export class Flame extends Entity {
  public constructor(private readonly scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Light);
  }

  public onEnterGame(instances: IEntityInstance[]): void {}

  public onLeaveGame(instances: IEntityInstance[]): void {}

  public onEnterEdit(instances: IEntityInstance[]): void {
    for (const instance of instances) {
      const box = Flame.createWireBox(this.scene, this.glowLayer);
      box.position = instance.position;
    }
  }

  public onLeaveEdit(instances: IEntityInstance[]): void {}

  public removeInstance(instance: IEntityInstance): void {
    throw new Error('Method not implemented.');
  }

  public createInstance(position: Vector3): IEntityInstance {
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
  private static createWireBox(scene: Scene, glowLayer?: GlowLayer): Mesh {
    const box = Mesh.CreateLines(
      'box',
      [
        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(+0.5, -0.5, -0.5),
        new Vector3(+0.5, -0.5, +0.5),
        new Vector3(-0.5, -0.5, +0.5),
        new Vector3(-0.5, -0.5, -0.5),
        new Vector3(-0.5, +0.5, -0.5),
        new Vector3(+0.5, +0.5, -0.5),
        new Vector3(+0.5, -0.5, -0.5),
        new Vector3(+0.5, +0.5, -0.5),
        new Vector3(+0.5, +0.5, +0.5),
        new Vector3(+0.5, -0.5, +0.5),
        new Vector3(+0.5, +0.5, +0.5),
        new Vector3(-0.5, +0.5, +0.5),
        new Vector3(-0.5, -0.5, +0.5),
        new Vector3(-0.5, +0.5, +0.5),
        new Vector3(-0.5, +0.5, -0.5)
      ],
      scene
    );

    box.enableEdgesRendering();
    box.edgesWidth = 2;
    box.color = new Color3(1, 1, 1);
    box.edgesColor = box.color.toColor4();

    if (glowLayer) glowLayer.referenceMeshToUseItsOwnMaterial(box);

    const highlight = new HighlightLayer('hl1', scene);
    highlight.addMesh(box, new Color3(1.0, 1.0, 1.0));

    return box;
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
