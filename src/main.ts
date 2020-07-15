import { environment } from './environments/environment';
import { Engine, EngineInstrumentation, Scene, SceneInstrumentation } from '@babylonjs/core';
import { LevelEditor } from './editor/level-editor';
import '@babylonjs/inspector';
import { LevelCamera } from './level/level-camera';
import { Inspector } from './debug/inspector';
import { Loader } from './loader/loader';

class Main {
  constructor() {

  }

  public runRenderLoop(): void {

  }

}

async function main(): Promise<void> {
  console.log('version: ', environment.app.version + ' (' + environment.app.env + ')');

  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  const controlElement = document.documentElement;
  const scene = new Scene(engine);
  const camera = new LevelCamera('LevelCamera', 16, scene);
  const editor = new LevelEditor(camera, controlElement, scene);
  const loader = new Loader('loading');
  const instrumentation = {
    engine: new EngineInstrumentation(engine),
    scene: new SceneInstrumentation(scene),
  };

  const fps = document.getElementById('fps');
  const drawCounter = document.getElementById('draw-counter');
  const inspector = new Inspector(scene, document.getElementById('inspector'));

  engine.runRenderLoop(() => {
    scene.render();
    fps.innerHTML = ' fps: ' + engine.getFps().toFixed();
    drawCounter.innerHTML = 'draw count: ' + instrumentation.scene.drawCallsCounter.current.toFixed();
  });

  window.addEventListener('resize', engine.resize.bind(engine));

  loader.hide();

  window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyL') {
      if (loader.visible) {
        loader.hide();
      }
      else {
        loader.show();
      }
    }
  });

}

main();
