import { ArcRotateCamera, Camera, ICameraInput, Nullable, Scene, Vector3 } from '@babylonjs/core';

export class LevelCamera extends ArcRotateCamera {
  private _size: number;
  private _aspect: number;
  private _scale: number;

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
    this.updateCameraOrtho();
  }

  get aspect(): number {
    return this._aspect;
  }

  set aspect(value: number) {
    this._aspect = value;
    this.updateCameraOrtho();
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
    this.updateCameraOrtho();
  }

  private updateCameraOrtho() {
    const size = this.size / this._scale;

    this.mode = Camera.ORTHOGRAPHIC_CAMERA;
    this.orthoTop = size / this._aspect;
    this.orthoBottom = -size / this._aspect;
    this.orthoLeft = -size;
    this.orthoRight = size;
  }

  constructor(name: string, levelSize: number, scene: Scene, aspect = 1.75, scale = 1.00) {
    super(
      name,
      -Math.PI / 4, Math.PI / 3.4, levelSize * 30,
      new Vector3(0, 0, 0),
      scene,
    );

    this._size = levelSize;
    this._aspect = aspect;
    this._scale = scale;

    this.updateCameraOrtho();

    this.inputs.clear();
  }
}

export class LevelCameraInput implements ICameraInput<ArcRotateCamera> {

  constructor(public readonly minScale: number, public readonly maxScale: number) {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseAuxClick = this.onMouseAuxClick.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }
  camera: Nullable<LevelCamera> = null;

  checkInputs?: () => void;

  private defaults?: { scale: number, alpha: number, beta: number };
  private noPreventDefault?: boolean;
  private element?: HTMLElement;

  getClassName(): string {
    return 'LevelCameraInput';
  }

  getSimpleName(): string {
    return 'mouse';
  }

  detachControl(element: HTMLElement): void {
  }

  private onMouseMove(event: MouseEvent) {
    if (this.camera) {
      if (event.button === 1) {
      } else {
        this.camera.alpha -= event.movementX / 100;
        this.camera.beta -= event.movementY / 100;
      }
    }
  }

  private onMouseAuxClick(event: MouseEvent) {
    if (event.button === 1 && this.camera && this.defaults) {
      this.camera.target = Vector3.Zero();
      this.camera.scale = this.defaults.scale;
      this.camera.alpha = this.defaults.alpha;
      this.camera.beta = this.defaults.beta;

      if (this.noPreventDefault) event.preventDefault();
    }
  }

  private onMouseWheel(event: WheelEvent) {
    if (this.camera) {
      let scale = this.camera.scale;

      scale -= event.deltaY / (600 / scale);

      if (scale < this.minScale) scale = this.minScale;
      if (scale > this.maxScale) scale = this.maxScale;

      this.camera.scale = scale;

      if (this.noPreventDefault) event.preventDefault();
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.element && this.camera && event.key === 'Shift') {
      this.element.addEventListener('auxclick', this.onMouseAuxClick);
      this.element.addEventListener('wheel', this.onMouseWheel);
      this.camera.inputs.addPointers();
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (this.element && this.camera && event.key === 'Shift') {
      this.element.removeEventListener('auxclick', this.onMouseAuxClick);
      this.element.removeEventListener('wheel', this.onMouseWheel);
      this.camera.inputs.removeByType('ArcRotateCameraPointersInput');
    }
  }

  attachControl(element: HTMLElement, noPreventDefault?: boolean) {
    if (!this.camera) throw new Error('No camera!');

    this.defaults = {
      scale: this.camera.scale,
      alpha: this.camera.alpha,
      beta: this.camera.beta,
    };

    this.noPreventDefault = noPreventDefault;
    this.element = element;

    this.detachControl(element);

    element.addEventListener('keydown', this.onKeyDown);
    element.addEventListener('keyup', this.onKeyUp);
  }
}
