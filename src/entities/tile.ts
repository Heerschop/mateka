import { Entity, EntityType, IEntityInstance } from '../entity-builder';
import { Scene, Vector3, StandardMaterial, Material, Texture, Color3, MeshBuilder, Mesh, AbstractMesh, FresnelParameters, GlowLayer } from '@babylonjs/core';

export class Tile extends Entity {
  private mesh?: Mesh;

  enterEditMode(): void {
    //throw new Error("Method not implemented.");
  }
  leaveEditMode(): void {
    //throw new Error("Method not implemented.");
  }
  remove(instance: IEntityInstance): void {
    //throw new Error("Method not implemented.");
  }

  create(position: Vector3): IEntityInstance {
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
    } else instance = this.mesh.createInstance(this.material);
    //this.mesh.removeInstance()

    instance.position = position;

    return {};
  }

  constructor(private readonly material: string, scene: Scene, private readonly glowLayer?: GlowLayer) {
    super(EntityType.Tile, scene);
  }

  private createMaterial(name: string): Material {
    const material = new StandardMaterial(name, this.scene);

    material.diffuseTexture = new Texture('textures/tiles/' + name + '/' + name + '-diffuse.png', this.scene);
    material.bumpTexture = new Texture('textures/tiles/' + name + '/' + name + '-normal.png', this.scene);

    if (this.glowLayer) {
      const texture = new Texture('textures/tiles/' + name + '/' + name + '-emissive.png', this.scene);

      material.emissiveTexture = texture;
    }

    material.specularPower = 1000.0;
    material.specularColor = new Color3(0.5, 0.5, 0.5);
    material.maxSimultaneousLights = 6;

    return material;
  }
}
