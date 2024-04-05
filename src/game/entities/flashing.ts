import { Entity, EntityType, IEntityInstance } from 'game/entity-manager';
import { AbstractMesh, Animatable, Animation, Color3, Mesh, MeshBuilder, Scene, SpotLight, Vector3 } from '@babylonjs/core';
import { IField } from 'game/entity-manager/entity-manager';

export class Flashing extends Entity {
  private mesh?: Mesh;
  public constructor(private readonly field: IField) {
    super(EntityType.Light);
  }

  public removeInstance(instance: IEntityInstance): void {}

  public createInstance(position: Vector3): IEntityInstance {
    const size = {
      width: 0.4,
      height: 0.4,
      depth: 0.4
    };
    const light = new SpotLight('FlashingLight', position, new Vector3(1, 0, 0), Math.PI / 5, 2, this.field.scene);
    let instance: AbstractMesh;

    if (!this.mesh) {
      this.mesh = MeshBuilder.CreateCylinder(
        'FlashingLight',
        {
          diameterTop: 0,
          diameterBottom: 0.4,
          height: 1
        },
        this.field.scene
      );

      this.mesh.rotation.x = Math.PI / 2;
      this.mesh.rotation.y = -Math.PI / 2;

      instance = this.mesh;
    } else {
      instance = this.mesh.createInstance('FlashingLight');
    }

    instance.position = position;

    const lightAnimation = new Animation('FlashingAnimation', 'direction.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const boxAnimation = new Animation('BoxAnimation', 'rotation.y', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    boxAnimation.setKeys([
      {
        frame: 0,
        value: instance.rotation.y
      },
      {
        frame: 50,
        value: instance.rotation.y - Math.PI / 2
      },
      {
        frame: 150,
        value: instance.rotation.y + Math.PI / 2
      },
      {
        frame: 200,
        value: instance.rotation.y
      }
    ]);

    lightAnimation.setKeys([
      {
        frame: 0,
        value: light.direction.z
      },
      {
        frame: 50,
        value: light.direction.z + Math.PI
      },
      {
        frame: 150,
        value: light.direction.z - Math.PI
      },
      {
        frame: 200,
        value: light.direction.z
      }
    ]);

    light.animations.push(lightAnimation);
    instance.animations.push(boxAnimation);

    light.diffuse = new Color3(1.0, 0.3, 0.3);
    light.specular = new Color3(0.1, 0.1, 0.1);
    light.intensity = 2;

    this.animatables.push(this.field.scene.beginAnimation(light, 0, 200, true), this.field.scene.beginAnimation(instance, 0, 200, true));

    return { position };
  }
}
