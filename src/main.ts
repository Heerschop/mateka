import { environment } from './environments/environment';
import { Engine, EngineInstrumentation, Scene, SceneInstrumentation } from '@babylonjs/core';
import { LevelEditor } from './editor/level-editor';
import '@babylonjs/inspector';
import { LevelCamera } from './level/level-camera';

class Main {
  constructor() {

  }

  runRenderLoop() {

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
  const instrumentation = {
    engine: new EngineInstrumentation(engine),
    scene: new SceneInstrumentation(scene),
  };

  const fps = document.getElementById('fps');
  const drawCounter = document.getElementById('draw-counter');

  engine.runRenderLoop(() => {
    scene.render();
    fps.innerHTML = ' fps: ' + engine.getFps().toFixed();
    drawCounter.innerHTML = 'draw count: ' + instrumentation.scene.drawCallsCounter.current.toFixed();
  });

  window.addEventListener('resize', engine.resize.bind(engine));

  if (window.location.search.includes('inspect=true')) {
    setTimeout(() => {
      showInspector(scene);
    }, 2000);
  }

  window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyI') {
      showInspector(scene);
    }
  });

  const loadTime = Date.now() - (window as any).appStartDate;
  let timeout = 1000 - loadTime;

  if (timeout < 0) timeout = 0;

  console.log('loadTime:', loadTime);

  setTimeout(() => {
    const loading = document.getElementById('loading');

    loading.className = 'loading';

    loading.onanimationend = () => loading.remove();
  }, timeout);
}

async function showInspector(scene: Scene): Promise<void> {
  const visible = scene.debugLayer.isVisible();

  if (!visible) {
    const layer = await scene.debugLayer.show({
      overlay: false,
      globalRoot: document.getElementById('inspector'),
      embedMode: true,
    });
  } else {
    scene.debugLayer.hide();
  }

  const location = window.location.href.replace('?inspect=true', '').replace('?inspect=false', '');

  window.history.replaceState({}, window.location.pathname, location + '?inspect=' + !visible);
}

main();
