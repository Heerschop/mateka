import { Entity, EntityType, IEntityInstance } from '../entity-builder';
import { Vector3, Scene, SpotLight, Animation } from '@babylonjs/core';

export class Lantern extends Entity {
  enterEditMode(): void {
    throw new Error('Method not implemented.');
  }
  leaveEditMode(): void {
    throw new Error('Method not implemented.');
  }
  remove(instance: IEntityInstance): void {
    throw new Error('Method not implemented.');
  }

  create(position: Vector3): IEntityInstance {
    const light = new SpotLight('Lantern', position, new Vector3(0, -1, 0), Math.PI / 1, 9, this.scene);

    const animation1 = new Animation(
      'LanternAnimation1',
      'direction.x',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    animation1.setKeys([
      {
        frame: 0,
        value: light.direction.x
      },
      {
        frame: 40,
        value: light.direction.x - Math.PI / 8
      },
      {
        frame: 120,
        value: light.direction.x + Math.PI / 8
      },
      {
        frame: 160,
        value: light.direction.x
      }
    ]);

    const animation2 = new Animation(
      'LanternAnimation2',
      'direction.z',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    animation2.setKeys([
      {
        frame: 0,
        value: light.direction.z
      },
      {
        frame: 40,
        value: light.direction.z - Math.PI / 8
      },
      {
        frame: 120,
        value: light.direction.z + Math.PI / 8
      },
      {
        frame: 160,
        value: light.direction.z
      }
    ]);

    light.animations.push(animation1);
    light.animations.push(animation2);

    this.scene.beginAnimation(light, 0, 160, true);

    return {};
  }

  constructor(scene: Scene) {
    super(EntityType.Light, scene);
  }
}
