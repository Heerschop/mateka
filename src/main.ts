import { environment } from 'environments/environment';
import { Color4, Engine, EngineInstrumentation, Scene, SceneInstrumentation, Vector3 } from '@babylonjs/core';
import { GameInspector } from 'debug/game-inspector';
import { Loader } from 'loader/loader';
import { Menu } from 'menu/menu';
import { Game } from 'game/game';
import { testStuff } from 'test-stuff';
import { VectorMap } from 'game/vector-map';
import { VectorSet } from 'game/vector-set';

async function main(canvasId: string): Promise<void> {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  const loader = new Loader('loading');
  const menu = new Menu();
  const game = new Game(scene);
  const inspector = new GameInspector(scene, game.camera);

  scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

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
// #!if debug === 'true'
console.log('Debug are checks enabled!');
// #!endif

main('scene');
const date = Date.now();
const vectorMap = new VectorMap<boolean>(-30, 30);

console.log(vectorMap.set(new Vector3(1, 1, 1), true));
console.log(vectorMap.set(new Vector3(2, 1, 1), true));
console.log(vectorMap.set(new Vector3(3, 1, 1), true));
console.log(vectorMap.set(new Vector3(-10, 1, 1), true));

console.log('size:', vectorMap.size);

// console.log(map.remove(new Vector3(1, 1, 1)));
// console.log(map.remove(new Vector3(2, 1, 1)));
// console.log(map.remove(new Vector3(3, 1, 1)));

console.log('timespan:', Date.now() - date);

for (const [key, value] of vectorMap.entries()) {
  console.log(key, value);
}

const set = new Set<number>();
set.add(1);
set.add(1);
set.add(2);
set.add(3);

for (const [v1, v2] of set.entries()) {
  console.log(v1, v2);
}

const map = new Map<number, string>();

map.set(1, 'aa');
map.set(1, 'aa');
map.set(2, 'bb');
map.set(3, 'bb');

for (const [v1, v2] of map.entries()) {
  console.log(v1, v2);
}

console.log('vectorSet--------------');
const vectorSet = new VectorSet(-30, +30);
vectorSet.add(new Vector3(1, 1, 1));
vectorSet.add(new Vector3(2, 1, 1));

for (const [key, value] of vectorSet.entries()) {
  console.log(key, value);
}
