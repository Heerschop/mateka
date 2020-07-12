import { environment } from './environments/environment';
import { ArcRotateCamera, Engine, EngineInstrumentation, HemisphericLight, MeshBuilder, Scene, SceneInstrumentation, Vector3 } from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

async function main(): Promise<void> {
  console.log('version: ', environment.app.version + ' (' + environment.app.env + ')');

  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  const controlElement = document.documentElement;
  const scene = new Scene(engine);

  // Create a basic BJS Scene object.
  // Create a ArcRotateCamera, and set its Target to (x:0, y:1, z:0).
  const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 2.5, 8, new Vector3(0, 1, 0), scene);

  // Attach the camera to the canvas.
  camera.attachControl(controlElement, false);

  // Create a basic light, aiming 0,1,0 - meaning, to the sky.
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);

  // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
  const sphere = MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: 2 }, scene);

  // Move the sphere upward 1/2 of its height.
  sphere.position.y = 1;

  // Create a built-in "ground" shape.
  const ground = MeshBuilder.CreateGround('ground', { width: 6, height: 6, subdivisions: 2 }, scene);

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
