import { environment } from 'environments/environment';
import { Color3, Engine, EngineInstrumentation, HemisphericLight, Scene, SceneInstrumentation, Vector3 } from '@babylonjs/core';
import { LevelEditor } from 'editor/level-editor';
import { LevelCamera } from 'level/level-camera';
import { Inspector } from 'debug/inspector';
import { Loader } from 'loader/loader';
import { LevelBuilder } from 'level/level-builder';
import { Flame, Flashing, Lantern, Tile } from 'entities';
import { Menu } from 'menu/menu';

class Main {
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly loader: Loader;
  private readonly inspector: Inspector;
  private readonly menu: Menu;

  public constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    const loader = new Loader('loading');
    const inspector = new Inspector(scene);
    const menu = new Menu();

    console.log('version: ', environment.app.version + ' (' + environment.app.env + ')');

    window.addEventListener('resize', engine.resize.bind(engine));

    this.scene = scene;
    this.engine = engine;
    this.loader = loader;
    this.inspector = inspector;
    this.menu = menu;
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
    const builder = new LevelBuilder(this.scene);

    builder.registerEntity({
      0: scene => new Tile('ruin-tile-01', scene),
      1: scene => new Tile('stylized-bush-01', scene),
      2: scene => new Tile('stylized-floor-tile-01', scene),
      3: scene => new Tile('stylized-ground-02', scene),
      4: scene => new Tile('stylized-ground-rock-09', scene),
      5: scene => new Tile('stylized-tree-bark-04', scene),
      6: scene => new Tile('stylized-wall-rock-01', scene),
      7: scene => new Tile('random-stone-tiles-02', scene),
      8: scene => new Tile('broken-tiles-dry', scene),
      9: scene => new Tile('abandon-brick-wall-03', scene),
      A: scene => new Tile('stone-and-sand', scene),
      B: scene => new Lantern(scene),
      C: scene => new Flashing(scene),
      D: scene => new Flame(scene)
      // E: (scene) => new Tile('lava', scene, glowLayer),
    });

    builder.createEntity('0', new Vector3(0, 0, 0));
    builder.createEntity('1', new Vector3(1, 0, 0));
    builder.createEntity('1', new Vector3(1, 0, 1));
    builder.createEntity('D', new Vector3(2, 0, 0));

    builder.entityManager.enterEdit();

    const light = new HemisphericLight('hemispher', new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.3;
    // light.intensity = 0.55;
    light.diffuse = new Color3(0.8, 0.3, 0.3);
    light.specular = new Color3(0.0, 0.3, 0.0);
    light.groundColor = new Color3(0.3, 0.8, 0.3);

    this.engine.runRenderLoop(() => {
      this.scene.render();
      fps.innerHTML = ' fps: ' + this.engine.getFps().toFixed();
      drawCounter.innerHTML = 'draw count: ' + instrumentation.scene.drawCallsCounter.current.toFixed();
    });

    this.menu.show();

    this.loader.hide();
  }

  public stopGame(): void {
    this.engine.stopRenderLoop();
  }
}

const main = new Main('scene');

main.startGame();
