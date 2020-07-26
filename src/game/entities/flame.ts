import { Entity, EntityType, IEntityInstance } from 'game/entity-manager';
import { BaseParticleSystem, Color3, Color4, GlowLayer, GPUParticleSystem, HighlightLayer, IParticleSystem, Mesh, ParticleSystem, Scene, Texture, Vector3 } from '@babylonjs/core';
import { EntityBuilder } from 'game/editor/entity-builder';
import { AutoMap } from 'common';

class Matrix {
  public readonly minimum: Vector3;
  public readonly maximum: Vector3;
  private readonly instances: boolean[][][];
  private readonly offset: Vector3;
  private _count: number;

  public get count(): number {
    return this._count;
  }

  public get first(): Vector3 {
    // const vector = this.minimum;

    // // while instances

    // for (vector.y = vectorA.y; vector.y <= vectorB.y; vector.y++) {
    //   for (vector.z = vectorA.z; vector.z <= vectorB.z; vector.z++) {
    //     for (vector.x = vectorA.x; vector.x <= vectorB.x; vector.x++) {
    //       if (!this.test(vector)) return false;
    //     }
    //   }
    // }
    return this.minimum;
  }

  public constructor(size: number) {
    this.offset = new Vector3(size, size, size);

    this.instances = [];

    this.minimum = new Vector3(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    this.maximum = new Vector3(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
  }

  public add(instances: IEntityInstance[]): void {
    for (const instance of instances) {
      const position = instance.position.add(this.offset);

      let axisX = this.instances[position.x];

      if (!axisX) {
        axisX = [];
        this.instances[position.x] = axisX;
      }

      let axisY = axisX[position.y];

      if (!axisY) {
        axisY = [];
        axisX[position.y] = axisY;
      }

      axisY[position.z] = true;

      this._count++;

      if (instance.position.x < this.minimum.x) this.minimum.x = instance.position.x;
      if (instance.position.y < this.minimum.y) this.minimum.y = instance.position.y;
      if (instance.position.z < this.minimum.z) this.minimum.z = instance.position.z;

      if (instance.position.x > this.maximum.x) this.maximum.x = instance.position.x;
      if (instance.position.y > this.maximum.y) this.maximum.y = instance.position.y;
      if (instance.position.z > this.maximum.z) this.maximum.z = instance.position.z;
    }
  }

  public test(position: Vector3): boolean {
    position = position.add(this.offset);

    const axisX = this.instances[position.x];

    if (!axisX) return false;

    const axisY = axisX[position.y];

    if (!axisY) return false;

    return axisY[position.z] !== undefined;
  }

  public boxTest(vectorA: Vector3, vectorB: Vector3): boolean {
    const vector = Vector3.Zero();

    for (vector.y = vectorA.y; vector.y <= vectorB.y; vector.y++) {
      for (vector.z = vectorA.z; vector.z <= vectorB.z; vector.z++) {
        for (vector.x = vectorA.x; vector.x <= vectorB.x; vector.x++) {
          if (!this.test(vector)) return false;
        }
      }
    }

    return true;
  }

  public remove(vector: Vector3): void {
    const position = vector.add(this.offset);
    const axisX = this.instances[position.x];

    if (!axisX) return;

    const axisY = axisX[position.y];

    if (!axisY) return;

    if (axisY[position.z]) {
      axisY[position.z] = false;
      this._count--;
    }
  }

  public reset(vectorA: Vector3, vectorB: Vector3): void {
    const vector = Vector3.Zero();

    for (vector.y = vectorA.y; vector.y <= vectorB.y; vector.y++) {
      for (vector.z = vectorA.z; vector.z <= vectorB.z; vector.z++) {
        for (vector.x = vectorA.x; vector.x <= vectorB.x; vector.x++) {
          this.remove(vector);
        }
      }
    }
  }
}

export class Flame extends Entity {
  public constructor(private readonly scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Light);
  }

  public onEnterEdit3(instances: IEntityInstance[]): void {
    if (instances.length === 1) {
      super.onEnterEdit(instances);
      return;
    }

    const axisZ = Object.assign(new AutoMap<number, IEntityInstance[]>(), {
      default: () => []
    });

    console.log(axisZ);

    for (const instance of instances) {
      axisZ.get(instance.position.z)[instance.position.x + 100.5] = instance;
    }

    console.log('axisZ:', axisZ);

    const result = [];

    for (const [z, instances] of axisZ) {
      let index = 0;
      while (index < instances.length) {
        const min = instances[index++];

        if (min) {
          while (instances[index]) index++;
          const max = instances[index - 1];

          const width = max.position.x - min.position.x + 1;
          const box = EntityBuilder.createBox('EditWire', {
            width
          });
          box.position.x = min.position.x - 0.5 + width / 2;
          box.position.y = 0.5;
          box.position.z = z;
          this.editables.push(box);
        }
      }
    }
  }

  public onEnterEdit2(instances: IEntityInstance[]): void {
    if (instances.length === 1) {
      super.onEnterEdit(instances);
      return;
    }

    const matrix = new Matrix(20.5);

    matrix.add(instances);

    const position = matrix.minimum.clone();

    for (position.z = matrix.minimum.z; position.z <= matrix.maximum.z; position.z++) {
      for (position.x = matrix.minimum.x; position.x <= matrix.maximum.x; position.x++) {
        if (matrix.test(position)) {
          const min = position.clone();

          while (matrix.test(position)) position.x++;
          position.x--;
          const max = position.clone();

          const width = max.x - min.x + 1;
          const box = EntityBuilder.createBox('EditWire', {
            width
          });
          box.position.x = min.x - 0.5 + width / 2;
          box.position.y = 0.5;
          box.position.z = position.z;
          this.editables.push(box);
        }
      }
    }
  }

  public onEnterEdit(instances: IEntityInstance[]): void {
    if (instances.length === 1) {
      super.onEnterEdit(instances);
      return;
    }

    const matrix = new Matrix(20.5);
    const vectorX = new Vector3(1, 0, 0);
    const vectorY = new Vector3(0, 1, 0);
    const vectorZ = new Vector3(0, 0, 1);

    matrix.add(instances);

    while (matrix.count > 0) {
      const position1 = matrix.minimum.clone();
      const position2 = position1.clone();

      while (matrix.boxTest(position1, position2.add(vectorX))) position2.addInPlace(vectorX);
      while (matrix.boxTest(position1, position2.add(vectorZ))) position2.addInPlace(vectorZ);
      while (matrix.boxTest(position1, position2.add(vectorY))) position2.addInPlace(vectorY);

      matrix.reset(position1, position2);

      this.createBox(position1, position2);
    }
  }

  public removeInstance(instance: IEntityInstance): void {}

  public createInstance(position: Vector3): IEntityInstance {
    const particleSystem = this.createParticleSystem(true);
    const emitter0 = Mesh.CreateBox('emitter0', 0.1, this.scene);
    emitter0.isVisible = false;

    particleSystem.particleTexture = new Texture('assets/textures/fire.jpg', this.scene);
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
  private createBox(position1: Vector3, position2: Vector3): void {
    const size = {
      depth: position2.z - position1.z + 1,
      height: position2.y - position1.y + 1,
      width: position2.x - position1.x + 1
    };
    console.log('size:', size);
    console.log('size:', position2.x - position1.x + 1);
    console.log('position2.x:', position2.x);
    console.log('position1.x:', position1.x);
    const box = EntityBuilder.createBox('EditWire', size);
    box.position = position1.add(new Vector3(-0.5 + size.width / 2, -0.5 + size.height / 2, -0.5 + size.depth / 2));
    this.editables.push(box);
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
