import { Color3, Color4, Engine, EngineInstrumentation, HemisphericLight, MeshBuilder, Scene, SceneInstrumentation, Vector3 } from '@babylonjs/core';
import { WireBuilder } from 'common/wire-builder';
import { EntityBuilder } from 'game/editor/entity-builder';

export async function testStuff(scene: Scene): Promise<void> {
  const ambientLight = new HemisphericLight('hemispher', new Vector3(0, 1, 0), scene);

  ambientLight.intensity = 0.55;
  ambientLight.diffuse = new Color3(0.8, 0.3, 0.3);
  ambientLight.specular = new Color3(0.0, 0.3, 0.0);
  ambientLight.groundColor = new Color3(0.3, 0.8, 0.3);

  const options = {
    size: 3,
    width: 2
    // height: 2,
    // depth: 3
  };

  // const box1 = MeshBuilder.CreateBox('Example', options as any);
  // // const box2 = WireBuilder.createBox('Example', options as any);

  // // box1.enableEdgesRendering(1 - 0.000000000000001);
  // box1.enableEdgesRendering();
  // box1.edgesWidth = 8;
  // box1.edgesColor = new Color4(1, 1, 1, 1);
  // box1.visibility = 0.4;

  const mesh = EntityBuilder.createCone('Example');
}
