import { Entity, EntityType, IEntityInstance } from '../entity-manager';
import { Animatable, Animation, Color3, GlowLayer, HighlightLayer, Mesh, Scene, SpotLight, Vector3 } from '@babylonjs/core';
import { EntityBuilder } from 'game/editor/entity-builder';

interface ILantern extends IEntityInstance {
  animatables: Animatable[];
  editInstance?: Mesh;
  animations: Animation[];
}

export class Lantern extends Entity {
  public constructor(private readonly scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Light);
  }

  public onStartGame(instances: ILantern[]): void {
    for (const instance of instances) {
      for (const animatable of instance.animatables) {
        animatable.restart();
      }
    }
  }
  public onPauseGame(instances: ILantern[]): void {
    for (const instance of instances) {
      for (const animatable of instance.animatables) {
        animatable.pause();
      }
    }
  }
  public onResetGame(instances: ILantern[]): void {
    for (const instance of instances) {
      for (const animatable of instance.animatables) {
        animatable.reset();
      }
    }
  }

  public onEnterEdit(instances: ILantern[]): void {
    for (const instance of instances) {
      const box = EntityBuilder.createCone('LanternWire', {
        size: 3
      });
      box.position = instance.position;

      // if (this.glowLayer) this.glowLayer.referenceMeshToUseItsOwnMaterial(box);

      // const highlight = new HighlightLayer('hl1', this.scene);
      // highlight.addMesh(box, new Color3(1.0, 1.0, 1.0));

      instance.editInstance = box;

      const animation1 = new Animation('LanternAnimation1', 'rotation.x', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

      animation1.setKeys([
        {
          frame: 0,
          value: box.rotation.x
        },
        {
          frame: 40,
          value: box.rotation.x + Math.PI / 8
        },
        {
          frame: 120,
          value: box.rotation.x - Math.PI / 8
        },
        {
          frame: 160,
          value: box.rotation.x
        }
      ]);

      const animation2 = new Animation('LanternAnimation2', 'rotation.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

      animation2.setKeys([
        {
          frame: 0,
          value: box.rotation.z
        },
        {
          frame: 40,
          value: box.rotation.z - Math.PI / 8
        },
        {
          frame: 120,
          value: box.rotation.z + Math.PI / 8
        },
        {
          frame: 160,
          value: box.rotation.z
        }
      ]);

      // for (const animation of instance.animations) {
      box.animations.push(animation1);
      box.animations.push(animation2);
      // }

      this.scene.beginAnimation(box, 0, 160, true);
    }
  }

  public onLeaveEdit(instances: ILantern[]): void {
    for (const instance of instances) {
      instance.editInstance.dispose();
      instance.editInstance = undefined;
    }
  }

  public removeInstance(instance: ILantern): void {}

  public createInstance(position: Vector3): ILantern {
    const light = new SpotLight('Lantern', position, new Vector3(0, -1, 0), Math.PI / 1, 9, this.scene);

    const animation1 = new Animation('LanternAnimation1', 'direction.x', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

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

    const animation2 = new Animation('LanternAnimation2', 'direction.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

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

    const animations: Animation[] = [animation1, animation2];

    light.animations.push(animation1);
    light.animations.push(animation2);

    const animatables = [this.scene.beginAnimation(light, 0, 160, true)];

    return { position, animatables, animations };
  }
}
