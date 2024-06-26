import { RenderGrid } from './render-grid';
import { Color3, HighlightLayer, Matrix, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { WireBuilder } from 'common/wire-builder';

export class CursorEvent extends Event {
  public constructor(type: string, public readonly position: Vector3, public readonly button: number) {
    super(type);
  }
}

export class LevelEditor {
  private cursor?: Mesh;
  private renderGrid: RenderGrid;
  private pointerDefaults: {
    preventDefaultOnPointerDown: boolean;
    preventDefaultOnPointerUp: boolean;
  };
  private readonly eventTarget: EventTarget;
  private previousCursor: Vector3;

  private positionElement: HTMLElement;

  public constructor(private controlElement: HTMLElement, private readonly scene: Scene, private readonly gridSize: number = 100) {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);

    this.eventTarget = new EventTarget();
  }

  public enable(): void {
    const scene = this.scene;

    this.renderGrid = new RenderGrid(scene, this.gridSize);

    this.pointerDefaults = {
      preventDefaultOnPointerDown: scene.preventDefaultOnPointerDown,
      preventDefaultOnPointerUp: scene.preventDefaultOnPointerUp
    };

    scene.preventDefaultOnPointerDown = false;
    scene.preventDefaultOnPointerUp = false;

    this.enableCursor();
  }

  public disable(): void {
    this.disableCursor();

    this.renderGrid.dispose();

    this.scene.preventDefaultOnPointerDown = this.pointerDefaults.preventDefaultOnPointerDown;
    this.scene.preventDefaultOnPointerUp = this.pointerDefaults.preventDefaultOnPointerUp;
  }

  public addEventListener(type: 'cursormove' | 'cursordown', listener: (this: LevelEditor, event: CursorEvent) => void, options?: boolean | AddEventListenerOptions): void {
    this.eventTarget.addEventListener(type, event => listener.call(this, event), options);
  }

  private onMouseDown(event: MouseEvent): void {
    // const info = this.scene.pick(event.offsetX, event.offsetY);

    this.eventTarget.dispatchEvent(new CursorEvent('cursordown', this.cursor.position, event.button));

    // if (info && info.hit && info.pickedMesh && event.button === 2) {
    //   let pickedMesh = info.pickedMesh;

    //   if (!pickedMesh.isAnInstance) {
    //     const mesh = info.pickedMesh as Mesh;

    //     if (mesh.instances.length > 1) {
    //       pickedMesh = mesh.instances[0];
    //       mesh.position = pickedMesh.position;
    //     }
    //   }

    // pickedMesh.dispose();
    // }
  }

  private onMouseMove(event: MouseEvent): void {
    const info = this.renderGrid.pick(event.offsetX, event.offsetY);

    if (info && info.pickedPoint) {
      const position = info.pickedPoint;

      position.x = Math.floor(position.x);
      position.y = 0;
      position.z = Math.floor(position.z);

      if (!position.equals(this.previousCursor)) {
        this.eventTarget.dispatchEvent(new CursorEvent('cursormove', position, event.button));
        this.previousCursor = position;

        this.positionElement.innerText = position.x + ' , ' + position.y + ' , ' + position.z;
      }

      this.cursor.position = position;
    }
  }
  private createBoxCursor(): Mesh {
    const mesh = WireBuilder.createBox('cursor', {}, this.renderGrid.utilityLayerScene);

    if (this.renderGrid.glowLayer) this.renderGrid.glowLayer.referenceMeshToUseItsOwnMaterial(mesh);

    const scene = this.renderGrid.utilityLayerScene;
    const highlight = new HighlightLayer('hl1', scene);

    highlight.addMesh(mesh, new Color3(1.0, 1.0, 1.0));

    mesh.setPivotMatrix(Matrix.Translation(0.5, 0.5, 0.5), false);

    return mesh;
  }

  private createPlaneCursor(): Mesh {
    const size = {};

    const scene = this.renderGrid.utilityLayerScene;
    const mesh = MeshBuilder.CreateGround('selector', size, scene);
    const material = new StandardMaterial('selector', scene);
    material.emissiveColor = new Color3(0.8, 0.8, 0.8);

    mesh.material = material;

    const highlight = new HighlightLayer('hl1', scene);
    highlight.addMesh(mesh, new Color3(1.0, 1.0, 1.0));

    mesh.setPivotMatrix(Matrix.Translation(0.5, 0.0, 0.5), false);

    return mesh;
  }

  private enableCursor(): void {
    this.cursor = this.createBoxCursor();

    this.controlElement.addEventListener('mousemove', this.onMouseMove);
    this.controlElement.addEventListener('mousedown', this.onMouseDown);

    this.showPosition();
  }

  private disableCursor(): void {
    this.controlElement.removeEventListener('mousemove', this.onMouseMove);
    this.controlElement.removeEventListener('mousedown', this.onMouseDown);

    if (this.cursor) this.cursor.dispose();

    this.hidePosition();
  }

  private showPosition(): void {
    const element = document.createElement('div');

    element.className = 'cursor-position';

    document.body.appendChild(element);

    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(
      `
      .cursor-position {
        position: fixed;
        right: 16px;
        bottom: 16px;
        background: #00000040;
        display: flex;
        font-weight: bold;
        font-size: 24px;
      }
    `
    );

    this.positionElement = element;
  }

  private hidePosition(): void {
    if (this.positionElement) {
      this.positionElement.remove();
      this.positionElement = undefined;
    }
  }
}
