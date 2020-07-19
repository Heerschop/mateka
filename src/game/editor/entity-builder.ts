import { Color4, Mesh, MeshBuilder, Nullable, Scene } from '@babylonjs/core';

export class EntityBuilder {
  public static createBox(
    name: string,
    options: {
      size?: number;
      width?: number;
      height?: number;
      depth?: number;
    } = {},
    scene?: Nullable<Scene>
  ): Mesh {
    const mesh = MeshBuilder.CreateBox(name, options, scene);

    mesh.enableEdgesRendering();
    mesh.edgesWidth = 2;
    mesh.edgesColor = new Color4(1, 1, 1, 1);
    mesh.visibility = 0.7;

    return mesh;
  }

  public static createCone(
    name: string,
    options: {
      size?: number;
      diameter?: number;
    } = {}
  ): Mesh {
    const size = options.size ? options.size : 1;
    const diameter = options.diameter ? options.diameter : size;

    const mesh = MeshBuilder.CreateCylinder(name, {
      height: size,
      diameterTop: 0.2,
      diameterBottom: diameter
    });

    mesh.enableEdgesRendering(); // 1 - 0.01
    mesh.edgesWidth = 4;
    mesh.edgesColor = new Color4(1, 1, 1, 1);
    mesh.visibility = 0.7;

    return mesh;
  }
}
