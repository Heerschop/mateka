import { Color3, LinesMesh, Mesh, Nullable, Scene, Vector3 } from '@babylonjs/core';

export class WireBuilder {
  public static createBox(
    name: string,
    options: {
      size?: number;
      width?: number;
      height?: number;
      depth?: number;
    },
    scene?: Nullable<Scene>
  ): LinesMesh {
    const size = options.size ? options.size : 1;
    const axisX = (options.width ? options.width : size) / 2;
    const axisY = (options.height ? options.height : size) / 2;
    const axisZ = (options.depth ? options.depth : size) / 2;

    const box = Mesh.CreateLines(
      name,
      [
        new Vector3(-axisX, -axisY, -axisZ),
        new Vector3(+axisX, -axisY, -axisZ),
        new Vector3(+axisX, -axisY, +axisZ),
        new Vector3(-axisX, -axisY, +axisZ),
        new Vector3(-axisX, -axisY, -axisZ),
        new Vector3(-axisX, +axisY, -axisZ),
        new Vector3(+axisX, +axisY, -axisZ),
        new Vector3(+axisX, -axisY, -axisZ),
        new Vector3(+axisX, +axisY, -axisZ),
        new Vector3(+axisX, +axisY, +axisZ),
        new Vector3(+axisX, -axisY, +axisZ),
        new Vector3(+axisX, +axisY, +axisZ),
        new Vector3(-axisX, +axisY, +axisZ),
        new Vector3(-axisX, -axisY, +axisZ),
        new Vector3(-axisX, +axisY, +axisZ),
        new Vector3(-axisX, +axisY, -axisZ)
      ],
      scene
    );

    box.enableEdgesRendering();
    box.edgesWidth = 2;
    box.color = new Color3(1, 1, 1);
    box.edgesColor = box.color.toColor4();

    return box;
  }
}
