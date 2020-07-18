import { Inspector } from './inspector';
import { Scene } from '@babylonjs/core';
import { LevelCamera, LevelCameraInput } from 'game/level-camera';

export class GameInspector extends Inspector {
  public constructor(scene: Scene, camera: LevelCamera) {
    super(scene);

    const controlElement = scene.getEngine().getRenderingCanvas();
    let cameraInput: LevelCameraInput = null;

    this.addEventListener('show', event => {
      if (!cameraInput) {
        cameraInput = new LevelCameraInput(camera.scale / 3, camera.scale * 105);

        camera.attachControl(controlElement, false);
        camera.inputs.add(cameraInput);
      }
    });

    this.addEventListener('hide', event => {
      if (cameraInput) {
        cameraInput.reset();

        camera.detachControl(controlElement);
        camera.inputs.remove(cameraInput);

        cameraInput = null;
      }
    });
  }
}
