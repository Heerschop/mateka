import { Entity, EntityType, IEntityInstance } from 'game/entity-manager';
import { Animatable, Animation, GlowLayer, Mesh, Scene, SpotLight, Vector3 } from '@babylonjs/core';
import { EntityBuilder } from 'game/editor/entity-builder';

export class Lantern extends Entity {
  public constructor(private readonly scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Light);
  }

  public onStartGame(instances: IEntityInstance[]): void {
    this.animatables.restart();
  }
  public onPauseGame(instances: IEntityInstance[]): void {
    this.animatables.pause();
  }
  public onResetGame(instances: IEntityInstance[]): void {
    this.animatables.reset();
  }

  public onEnterEdit(instances: IEntityInstance[]): void {
    for (const instance of instances) {
      const cone = EntityBuilder.createCone('LanternWireCone', {
        size: 3
      });
      cone.position = instance.position;
      const box = EntityBuilder.createBox('LanternWireBox', {
        size: 1
      });
      box.position = instance.position;

      // if (this.glowLayer) this.glowLayer.referenceMeshToUseItsOwnMaterial(box);

      // const highlight = new HighlightLayer('hl1', this.scene);
      // highlight.addMesh(box, new Color3(1.0, 1.0, 1.0));

      // instance.editInstance = box;
      this.editables.push(cone, box);

      const animation1 = new Animation('LanternAnimation1', 'rotation.x', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

      animation1.setKeys([
        {
          frame: 0,
          value: cone.rotation.x
        },
        {
          frame: 40,
          value: cone.rotation.x + Math.PI / 8
        },
        {
          frame: 120,
          value: cone.rotation.x - Math.PI / 8
        },
        {
          frame: 160,
          value: cone.rotation.x
        }
      ]);

      const animation2 = new Animation('LanternAnimation2', 'rotation.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

      animation2.setKeys([
        {
          frame: 0,
          value: cone.rotation.z
        },
        {
          frame: 40,
          value: cone.rotation.z - Math.PI / 8
        },
        {
          frame: 120,
          value: cone.rotation.z + Math.PI / 8
        },
        {
          frame: 160,
          value: cone.rotation.z
        }
      ]);

      cone.animations.push(animation1, animation2);

      this.scene.beginAnimation(cone, 0, 160, true);
    }
  }

  public onLeaveEdit(instances: IEntityInstance[]): void {
    this.editables.dispose();

    // for (const instance of instances) {
    //   instance.editInstance.dispose();
    //   instance.editInstance = undefined;
    // }
  }

  public removeInstance(instance: IEntityInstance): void {}

  public createInstance(position: Vector3): IEntityInstance {
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

    light.animations.push(animation1, animation2);

    this.animatables.push(this.scene.beginAnimation(light, 0, 160, true));

    return { position };
  }
}
