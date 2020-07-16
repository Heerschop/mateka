import { environment } from './environments/environment';
import { Engine, EngineInstrumentation, Scene, SceneInstrumentation } from '@babylonjs/core';
import { LevelEditor } from './editor/level-editor';
import { LevelCamera } from './level/level-camera';
import { Inspector } from './debug/inspector';
import { Loader } from './loader/loader';

class Main {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly loader: Loader;
  private readonly inspector: Inspector;

  public constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    const loader = new Loader('loading');
    const inspector = new Inspector(scene);

    console.log('version: ', environment.app.version + ' (' + environment.app.env + ')');

    window.addEventListener('resize', engine.resize.bind(engine));

    this.scene = scene;
    this.engine = engine;
    this.loader = loader;
    this.inspector = inspector;
  }

  public startGame(): void {
    const camera = new LevelCamera('LevelCamera', 16, this.scene);
    const editor = new LevelEditor(camera, document.documentElement, this.scene);
    const fps = document.getElementById('fps');
    const drawCounter = document.getElementById('draw-counter');
    const instrumentation = {
      engine: new EngineInstrumentation(this.engine),
      scene: new SceneInstrumentation(this.scene)
    };

    this.engine.runRenderLoop(() => {
      this.scene.render();
      fps.innerHTML = ' fps: ' + this.engine.getFps().toFixed();
      drawCounter.innerHTML = 'draw count: ' + instrumentation.scene.drawCallsCounter.current.toFixed();
    });

    this.loader.hide();
  }

  public stopGame(): void {
    this.engine.stopRenderLoop();
  }
}

const main = new Main('scene');

main.startGame();
