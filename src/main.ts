import { environment } from 'environments/environment';
import { Engine, EngineInstrumentation, Scene, SceneInstrumentation } from '@babylonjs/core';
import { GameInspector } from 'debug/game-inspector';
import { Loader } from 'loader/loader';
import { Menu } from 'menu/menu';
import { Game } from 'game/game';
import { testStuff } from 'test-stuff';

async function main(canvasId: string): Promise<void> {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  const loader = new Loader('loading');
  const menu = new Menu();
  const game = new Game(scene);
  const inspector = new GameInspector(scene, game.camera);

  const promise = game.loadLevel('assets/levels/level-01.json');
  // const promise = testStuff(scene);

  window.addEventListener('resize', engine.resize.bind(engine));

  menu.addEventListener('enteredit', event => {
    game.enterEdit();
  });
  menu.addEventListener('leaveedit', event => {
    game.leaveEdit();
  });
  menu.addEventListener('startgame', event => {
    game.startGame();
  });
  menu.addEventListener('pausegame', event => {
    game.pauseGame();
  });
  menu.addEventListener('resetgame', event => {
    game.resetGame();
  });

  const fps = document.getElementById('fps');
  const drawCounter = document.getElementById('draw-counter');
  const instrumentation = {
    engine: new EngineInstrumentation(engine),
    scene: new SceneInstrumentation(scene)
  };

  engine.runRenderLoop(() => {
    scene.render();
    fps.innerHTML = ' fps: ' + engine.getFps().toFixed();
    drawCounter.innerHTML = 'draw count: ' + instrumentation.scene.drawCallsCounter.current.toFixed();
  });

  await promise;

  menu.show();
  loader.hide();
}

console.log('Version: ', environment.app.version + ' (' + environment.app.env + ')');

main('scene');
