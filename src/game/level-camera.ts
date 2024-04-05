import { ArcRotateCamera, Camera, ICameraInput, Nullable, Scene, Vector3 } from '@babylonjs/core';

export class LevelCamera extends ArcRotateCamera {
  private _size: number;
  private _aspect: number;
  private _scale: number;

  public get size(): number {
    return this._size;
  }

  public set size(value: number) {
    this._size = value;
    this.updateCameraOrtho();
  }

  public get aspect(): number {
    return this._aspect;
  }

  public set aspect(value: number) {
    this._aspect = value;
    this.updateCameraOrtho();
  }

  public get scale(): number {
    return this._scale;
  }

  public set scale(value: number) {
    this._scale = value;
    this.updateCameraOrtho();
  }

  public constructor(name: string, levelSize: number, scene: Scene, aspect = 1.75, scale = 1.0) {
    // super(name, -Math.PI / 4, Math.PI / 3.4, levelSize * 30, new Vector3(0, 0, 0), scene);
    super(name, -Math.PI / 4, Math.PI / 3.288535, levelSize * 3, new Vector3(0, 0, 0), scene);

    this._size = levelSize;
    this._aspect = aspect;
    this._scale = scale;

    this.updateCameraOrtho();

    this.inputs.clear();
  }

  private updateCameraOrtho(): void {
    const size = this.size / this._scale;

    this.mode = Camera.ORTHOGRAPHIC_CAMERA;
    this.orthoTop = size / this._aspect;
    this.orthoBottom = -size / this._aspect;
    this.orthoLeft = -size;
    this.orthoRight = size;
  }
}

export class LevelCameraInput implements ICameraInput<ArcRotateCamera> {
  public camera: Nullable<LevelCamera> = null;

  public checkInputs?: () => void;

  private defaults?: { scale: number; alpha: number; beta: number };
  private noPreventDefault?: boolean;
  private element?: HTMLElement;

  public constructor(public readonly minScale: number, public readonly maxScale: number) {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseAuxClick = this.onMouseAuxClick.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  public getClassName(): string {
    return 'LevelCameraInput';
  }

  public getSimpleName(): string {
    return 'mouse';
  }

  public detachControl(element: HTMLElement): void {}

  public attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
    if (!this.camera) throw new Error('No camera!');

    this.defaults = {
      scale: this.camera.scale,
      alpha: this.camera.alpha,
      beta: this.camera.beta
    };

    this.noPreventDefault = noPreventDefault;
    this.element = element;

    this.detachControl(element);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  public reset(): void {
    if (!this.camera) throw new Error('No camera!');

    this.camera.target = Vector3.Zero();
    this.camera.scale = this.defaults.scale;
    this.camera.alpha = this.defaults.alpha;
    this.camera.beta = this.defaults.beta;
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.camera) {
      if (event.button === 1) {
      } else {
        this.camera.alpha -= event.movementX / 100;
        this.camera.beta -= event.movementY / 100;
      }
    }
  }

  private onMouseAuxClick(event: MouseEvent): void {
    if (event.button === 1 && this.camera && this.defaults) {
      this.reset();

      if (this.noPreventDefault) event.preventDefault();
    }
  }

  private onMouseWheel(event: WheelEvent): void {
    if (this.camera) {
      let scale = this.camera.scale;

      scale -= event.deltaY / (600 / scale);

      if (scale < this.minScale) scale = this.minScale;
      if (scale > this.maxScale) scale = this.maxScale;

      this.camera.scale = scale;

      if (this.noPreventDefault) event.preventDefault();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.element && this.camera && event.key === 'Shift') {
      this.element.addEventListener('auxclick', this.onMouseAuxClick);
      this.element.addEventListener('wheel', this.onMouseWheel);
      this.camera.inputs.addPointers();
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (this.element && this.camera && event.key === 'Shift') {
      this.element.removeEventListener('auxclick', this.onMouseAuxClick);
      this.element.removeEventListener('wheel', this.onMouseWheel);
      this.camera.inputs.removeByType('ArcRotateCameraPointersInput');
    }
  }
}
