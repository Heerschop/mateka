import { Entity, EntityType, IEntityInstance } from 'game/entity-manager';
import { AbstractMesh, Color3, GlowLayer, Material, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';
import { IField } from 'game/entity-manager/entity-manager';

interface ITileInstance extends IEntityInstance {
  mesh: AbstractMesh;
}
export class Tile extends Entity {
  private mesh?: Mesh;

  public constructor(private readonly material: string, private readonly field: IField, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Tile);
  }

  public onEnterEdit(instances: IEntityInstance[]): void {}

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
      this.mesh = MeshBuilder.CreateBox(this.material, size, this.field.scene);

      this.mesh.material = this.createMaterial(this.material);

      instance = this.mesh;

      if (this.glowLayer) {
        this.glowLayer.referenceMeshToUseItsOwnMaterial(instance);
      }
    } else {
      instance = this.mesh.createInstance(this.material);
    }

    instance.position = position;

    return { position, mesh: instance };
  }

  private createMaterial(name: string): Material {
    const material = new StandardMaterial(name, this.field.scene);

    material.diffuseTexture = new Texture('assets/textures/' + name + '/' + name + '-diffuse.png', this.field.scene);
    material.bumpTexture = new Texture('assets/textures/' + name + '/' + name + '-normal.png', this.field.scene);

    if (this.glowLayer) {
      const texture = new Texture('assets/textures/' + name + '/' + name + '-emissive.png', this.field.scene);

      material.emissiveTexture = texture;
    }

    material.specularPower = 1000.0;
    material.specularColor = new Color3(0.5, 0.5, 0.5);
    material.maxSimultaneousLights = 6;

    return material;
  }
}
