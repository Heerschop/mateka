import { Entity, EntityType, IEntityInstance } from '../entity-manager';
import { Animation, Color3, MeshBuilder, Scene, SpotLight, Vector3 } from '@babylonjs/core';

export class Flashing extends Entity {
  public constructor(private readonly scene: Scene) {
    super(EntityType.Light);
  }

  public onEnterGame(instances: IEntityInstance[]): void {}

  public onLeaveGame(instances: IEntityInstance[]): void {}

  public onEnterEdit(instances: IEntityInstance[]): void {
    // throw new Error('Method not implemented.');
  }

  public onLeaveEdit(instances: IEntityInstance[]): void {
    // throw new Error('Method not implemented.');
  }

  public removeInstance(instance: IEntityInstance): void {
    // throw new Error('Method not implemented.');
  }

  public createInstance(position: Vector3): IEntityInstance {
    const size = {
      width: 0.4,
      height: 0.4,
      depth: 0.4
    };
    const light = new SpotLight('FlashingLight', position, new Vector3(1, 0, 0), Math.PI / 5, 2, this.scene);
    const mesh = MeshBuilder.CreateCylinder(
      'FlashingLight',
      {
        diameterTop: 0,
        diameterBottom: 0.4,
        height: 1
      },
      this.scene
    );

    mesh.position = position;
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.y = -Math.PI / 2;

    const lightAnimation = new Animation('FlashingAnimation', 'direction.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const boxAnimation = new Animation('BoxAnimation', 'rotation.y', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    // this.mesh.material = this.createMaterial(this.material);

    // instance = this.mesh;

    boxAnimation.setKeys([
      {
        frame: 0,
        value: mesh.rotation.y
      },
      {
        frame: 50,
        value: mesh.rotation.y - Math.PI / 2
      },
      {
        frame: 150,
        value: mesh.rotation.y + Math.PI / 2
      },
      {
        frame: 200,
        value: mesh.rotation.y
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
    mesh.animations.push(boxAnimation);

    light.diffuse = new Color3(1.0, 0.3, 0.3);
    light.specular = new Color3(0.1, 0.1, 0.1);
    light.intensity = 2;

    this.scene.beginAnimation(light, 0, 200, true);
    this.scene.beginAnimation(mesh, 0, 200, true);

    return { position };
  }
}