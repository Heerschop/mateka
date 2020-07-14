import { RenderGrid } from './render-grid';
import { Color3, HighlightLayer, IDisposable, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { LevelCamera, LevelCameraInput } from '../level/level-camera';

export class LevelEditor implements IDisposable {
  private cursor?: Mesh;
  private readonly renderGrid: RenderGrid;
  private readonly default: {
    preventDefaultOnPointerDown: boolean
    preventDefaultOnPointerUp: boolean
  };

  constructor(camera: LevelCamera, private controlElement: HTMLElement, private readonly scene: Scene, gridSize: number = 100) {
    this.renderGrid = new RenderGrid(scene, gridSize);

    this.default = {
      preventDefaultOnPointerDown: scene.preventDefaultOnPointerDown,
      preventDefaultOnPointerUp: scene.preventDefaultOnPointerUp
    };

    scene.preventDefaultOnPointerDown = false;
    scene.preventDefaultOnPointerUp = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);

    camera.attachControl(controlElement, false);

    camera.inputs.add(new LevelCameraInput(camera.scale / 3, camera.scale * 105));

    this.enableCursor();
  }

  private createCursorMesh() {
    const box = Mesh.CreateLines('box', [
      new Vector3(-0.5, 0.0, -0.5), new Vector3(+0.5, 0.0, -0.5),
      new Vector3(+0.5, 0.0, +0.5), new Vector3(-0.5, 0.0, +0.5),
      new Vector3(-0.5, 0.0, -0.5), new Vector3(-0.5, 1.0, -0.5),
      new Vector3(+0.5, 1.0, -0.5), new Vector3(+0.5, 0.0, -0.5),
      new Vector3(+0.5, 1.0, -0.5), new Vector3(+0.5, 1.0, +0.5),
      new Vector3(+0.5, 0.0, +0.5), new Vector3(+0.5, 1.0, +0.5),
      new Vector3(-0.5, 1.0, +0.5), new Vector3(-0.5, 0.0, +0.5),
      new Vector3(-0.5, 1.0, +0.5), new Vector3(-0.5, 1.0, -0.5),
    ], this.renderGrid.utilityLayerScene);

    box.enableEdgesRendering();
    box.edgesWidth = 2;
    box.color = new Color3(1, 1, 1);
    box.edgesColor = box.color.toColor4();

    if (this.renderGrid.glowLayer) this.renderGrid.glowLayer.referenceMeshToUseItsOwnMaterial(box);

    const scene = this.renderGrid.utilityLayerScene;
    this.cursor = box;

    const highlight = new HighlightLayer('hl1', scene);
    highlight.addMesh(this.cursor, new Color3(1.0, 1.0, 1.0));
  }

  private createCursorMesh2() {
    const size = {
      width: 1,
      height: 1,
    };

    const scene = this.renderGrid.utilityLayerScene;
    this.cursor = MeshBuilder.CreateGround('selector', size, scene);
    const material = new StandardMaterial('selector', scene);
    material.emissiveColor = new Color3(0.8, 0.8, 0.8);

    this.cursor.material = material;

    const highlight = new HighlightLayer('hl1', scene);
    highlight.addMesh(this.cursor, new Color3(1.0, 1.0, 1.0));
  }

  private enableCursor() {
    this.createCursorMesh();

    this.controlElement.addEventListener('mousemove', this.onMouseMove);
    this.controlElement.addEventListener('mousedown', this.onMouseClick);
  }

  private disableCursor() {
    this.controlElement.removeEventListener('mousemove', this.onMouseMove);
    this.controlElement.removeEventListener('mousedown', this.onMouseClick);

    if (this.cursor) this.cursor.dispose();
  }

  onMouseClick(event: MouseEvent) {
    const info = this.scene.pick(event.offsetX, event.offsetY);

    if (info && info.hit && info.pickedMesh) {
      let pickedMesh = info.pickedMesh;

      if (!pickedMesh.isAnInstance) {
        const mesh = info.pickedMesh as Mesh;

        if (mesh.instances.length > 1) {
          pickedMesh = mesh.instances[0];
          mesh.position = pickedMesh.position;
        }
      }

      pickedMesh.dispose();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!event.shiftKey) {
      const info = this.renderGrid.pick(event.offsetX, event.offsetY);

      if (info && info.pickedPoint) {
        const position = info.pickedPoint;

        position.x -= (position.x + 1000) % 1 - 0.5;
        position.z -= (position.z + 1000) % 1 - 0.5;
        this.cursor!.position = position;
      }
    }
  }

  dispose(): void {
    this.disableCursor();

    this.renderGrid.dispose();

    this.scene.preventDefaultOnPointerDown = this.default.preventDefaultOnPointerDown;
    this.scene.preventDefaultOnPointerUp = this.default.preventDefaultOnPointerUp;
  }
}
