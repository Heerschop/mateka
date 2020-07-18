import { Entity, EntityType, IEntityInstance } from '../entity-manager';
import { AbstractMesh, Color3, FresnelParameters, GlowLayer, Material, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';

interface ITileInstance extends IEntityInstance {
  mesh: AbstractMesh;
}
export class Tile extends Entity {
  private mesh?: Mesh;

  public constructor(private readonly material: string, private readonly scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Tile);
  }

  public onEnterGame(instances: IEntityInstance[]): void {}

  public onLeaveGame(instances: IEntityInstance[]): void {}

  public onEnterEdit(instances: IEntityInstance[]): void {
    console.log('Tile:', instances);
  }

  public onLeaveEdit(instances: IEntityInstance[]): void {}

  public removeInstance(instance: ITileInstance): void {
    let instanceMesh = instance.mesh;

    if (!instanceMesh.isAnInstance) {
      const mesh = instanceMesh as Mesh;

      if (mesh.instances.length > 1) {
        instanceMesh = mesh.instances[0];
        mesh.position = instanceMesh.position;
      }
    }

    instanceMesh.dispose();
  }

  public createInstance(position: Vector3): ITileInstance {
    let instance: AbstractMesh;

    if (!this.mesh) {
      const size = {
        width: 1.0,
        height: 1.0,
        depth: 1.0
      };
      this.mesh = MeshBuilder.CreateBox(this.material, size, this.scene);

      this.mesh.material = this.createMaterial(this.material);

      instance = this.mesh;

      if (this.glowLayer) this.glowLayer.referenceMeshToUseItsOwnMaterial(instance);
    } else {
      instance = this.mesh.createInstance(this.material);
    }

    instance.position = position;

    return { position, mesh: instance };
  }

  private createMaterial(name: string): Material {
    const material = new StandardMaterial(name, this.scene);

    material.diffuseTexture = new Texture('assets/textures/' + name + '/' + name + '-diffuse.png', this.scene);
    material.bumpTexture = new Texture('assets/textures/' + name + '/' + name + '-normal.png', this.scene);

    if (this.glowLayer) {
      const texture = new Texture('assets/textures/' + name + '/' + name + '-emissive.png', this.scene);

      material.emissiveTexture = texture;
    }

    material.specularPower = 1000.0;
    material.specularColor = new Color3(0.5, 0.5, 0.5);
    material.maxSimultaneousLights = 6;

    return material;
  }
}
