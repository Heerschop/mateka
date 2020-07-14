import { Camera, Color3, Color4, DynamicTexture, GlowLayer, HighlightLayer, IDisposable, LinesMesh, Matrix, Mesh, MeshBuilder, MultiMaterial, Nullable, PickingInfo, Scene, StandardMaterial, Texture, UtilityLayerRenderer, Vector3 } from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials/grid';

// https://github.com/BabylonJS/Babylon.js/blob/master/inspector/src/components/actionTabs/tabs/propertyGrids/renderGridPropertyGridComponent.tsx#L40
export class RenderGrid implements IDisposable {
  private gridMesh: Mesh;
  // private textMesh: Mesh;
  private utilityLayerRenderer: UtilityLayerRenderer;
  public readonly utilityLayerScene: Scene;
  public readonly glowLayer?: GlowLayer;

  constructor(readonly scene: Scene, readonly size = 100) {
    this.utilityLayerRenderer = new UtilityLayerRenderer(scene, false);

    this.utilityLayerRenderer.utilityLayerScene.autoClearDepthAndStencil = false;

    const utilityLayerScene = this.utilityLayerRenderer.utilityLayerScene;

    this.utilityLayerScene = utilityLayerScene;

    this.gridMesh = Mesh.CreateGround('GridMesh', 1.0, 1.0, 1.0, utilityLayerScene);

    this.gridMesh.scaling.x = size;
    this.gridMesh.scaling.z = size;
    this.gridMesh.isPickable = false;
    // this.gridMesh.position.y -= 0.01;
    this.gridMesh.isPickable = false;

    const material = new GridMaterial('GridMaterial', utilityLayerScene);

    material.majorUnitFrequency = 10;
    material.minorUnitVisibility = 0.3;
    material.gridRatio = 1 / size;
    material.backFaceCulling = false;
    material.mainColor = new Color3(1.0, 1.0, 1.0);
    material.lineColor = new Color3(1.0, 1.0, 1.0);
    material.opacity = 0.8;
    material.zOffset = 1.0;
    material.opacityTexture = new Texture('assets/textures/render-grid-opacity.png', utilityLayerScene);

    this.gridMesh.material = material;

    for (let index = -size / 2; index <= size / 2; index++) {
      const textSize = index % 10 === 0 ? 0.6 : 0.2;
      const axisX = this.createTextPlane('TextPlaneX', utilityLayerScene, index.toString(), textSize);
      const axisY = axisX.createInstance('TextPlaneY');

      axisX.position.x += index;
      axisY.position.z += index;
    }

    this.glowLayer = new GlowLayer('GlowLayer', utilityLayerScene);
    this.glowLayer.intensity = 0.5;

    const edgesWidth = scene.activeCamera && scene.activeCamera.mode === Camera.PERSPECTIVE_CAMERA ? 1 : 4;

    const axis = new WorldAxis(1, utilityLayerScene, this.glowLayer, edgesWidth);
  }

  dispose(): void {
    this.utilityLayerRenderer.dispose();
  }

  pick(x: number, y: number): Nullable<PickingInfo> {
    return this.utilityLayerScene.pick(x, y, (mesh) => mesh === this.gridMesh);
  }

  // https://forum.babylonjs.com/t/how-are-vertexbuffers-associated-with-material-property-for-an-instancedmesh/6275
  // https://www.babylonjs-playground.com/#EK6GAC#13
  createTextPlane(name: string, scene: Scene, text: string, size: number): Mesh {
    const planeSize = {
      width: size * 1.5,
      height: size / 1.3,
    };
    const textureSize = {
      width: planeSize.width * 400,
      height: planeSize.height * 400,
    };
    const plane = MeshBuilder.CreatePlane(name, planeSize, scene);
    const texture = new DynamicTexture('DynamicTexture', textureSize, scene, true);

    texture.hasAlpha = true;
    texture.drawText(text, 0, textureSize.height / 1.05, 'bold ' + textureSize.width / 1.5 + 'px Arial', '#ffffff', 'transparent', true);

    const material = new StandardMaterial('TextPlaneMaterial', scene);

    material.backFaceCulling = false;
    material.emissiveColor = new Color3(0.9, 0.9, 0.9);
    material.diffuseTexture = texture;

    const offset = (0.75 - (0.30 * text.length)) * size;

    plane.position.z += 0.01 + planeSize.height / 2;
    plane.position.x += 0.01 + offset; // + planeSize.width / 2;
    plane.position.y += 0.01;

    plane.rotation.x = +Math.PI / 2;

    plane.material = material;

    return plane;
  }

}

class WorldAxis {
  constructor(size: number, scene: Scene, glowLayer?: GlowLayer, readonly edgesWidth = 4.0) {
    const axisX = Mesh.CreateLines('axisX', [
      Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.enableEdgesRendering();
    axisX.edgesWidth = edgesWidth;
    axisX.color = new Color3(1, 0, 0);
    axisX.edgesColor = axisX.color.toColor4();

    if (glowLayer) glowLayer.referenceMeshToUseItsOwnMaterial(axisX);

    const axisY = Mesh.CreateLines('axisY', [
      Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.enableEdgesRendering();
    axisY.edgesWidth = edgesWidth;
    axisY.color = new Color3(0, 1, 0);
    axisY.edgesColor = axisY.color.toColor4();
    axisY.rotation.y += -Math.PI / 4;

    if (glowLayer) glowLayer.referenceMeshToUseItsOwnMaterial(axisY);

    const axisZ = Mesh.CreateLines('axisZ', [
      Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.enableEdgesRendering();
    axisZ.edgesWidth = edgesWidth;
    axisZ.color = new Color3(0, 0, 1);
    axisZ.edgesColor = axisZ.color.toColor4();

    if (glowLayer) glowLayer.referenceMeshToUseItsOwnMaterial(axisZ);

    WorldAxis.createTextPlane(new Vector3(-0.03, +0.90 * size, -0.03 * size), 'Y', axisY.color, size / 10, scene).rotation.y += -Math.PI / 4;
    WorldAxis.createTextPlane(new Vector3(+0.90 * size, +0.06 * size, +0.00), 'X', axisX.color, size / 10, scene);
    WorldAxis.createTextPlane(new Vector3(+0.00, +0.06 * size, +0.90 * size), 'Z', axisZ.color, size / 10, scene).rotation.y += -Math.PI / 2;
  }

  private static createTextPlane(position: Vector3, text: string, color: Color3, size: number, scene: Scene): Mesh {
    const dynamicTexture = new DynamicTexture('DynamicTexture', 80, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 0, 80, 'bold 100px Arial', color.toHexString(), 'transparent', true);

    const material = new StandardMaterial('TextPlaneMaterial', scene);
    material.backFaceCulling = false;
    material.emissiveColor = color;
    material.diffuseTexture = dynamicTexture;

    const plane = Mesh.CreatePlane('TextPlane', size, scene, true);
    plane.material = material;
    plane.position = position;

    return plane;
  }
}
