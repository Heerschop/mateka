import { EntityManager, ManagerMode } from 'game/entity-manager';
import { LevelLoader } from 'game/level-loader';
import { Color3, GlowLayer, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';
import { LevelEditor } from 'game/editor/level-editor';
import { LevelCamera } from 'game/level-camera';
import { Flame, Flashing, Lantern, Tile } from 'game/entities';

export class Game {
  private readonly entityManager: EntityManager;
  private readonly levelLoader: LevelLoader;
  private readonly levelEditor: LevelEditor;
  private readonly levelCamera: LevelCamera;

  public get camera(): LevelCamera {
    return this.levelCamera;
  }

  public constructor(private readonly scene: Scene) {
    const controlElement = scene.getEngine().getRenderingCanvas();
    const camera = new LevelCamera('LevelCamera', 16, scene);
    const editor = new LevelEditor(controlElement, scene);

    this.entityManager = new EntityManager(scene);
    this.levelLoader = new LevelLoader();

    this.levelCamera = camera;
    this.levelEditor = editor;

    editor.addEventListener('cursordown', event => {
      if (event.button === 0) {
        this.entityManager.appendEntity('D', event.position);
      }

      if (event.button === 2) {
        this.entityManager.removeEntity(event.position);
      }
    });
  }

  public async loadLevel(file: string): Promise<void> {
    const entities = await this.levelLoader.loadLevel(file);
    const ambientLight = new HemisphericLight('hemispher', new Vector3(0, 1, 0), this.scene);
    const glowLayer = new GlowLayer('glow', this.scene, { mainTextureSamples: 2 });

    glowLayer.intensity = 6;

    ambientLight.intensity = 0.4;
    // light.intensity = 0.55;
    ambientLight.diffuse = new Color3(0.8, 0.3, 0.3);
    ambientLight.specular = new Color3(0.0, 0.3, 0.0);
    ambientLight.groundColor = new Color3(0.3, 0.8, 0.3);

    this.entityManager.registerEntity({
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
      D: scene => new Flame(scene),
      E: scene => new Tile('lava', scene, glowLayer)
    });

    // this.entityManager.createEntity('0', new Vector3(0, 0, 0));
    // this.entityManager.createEntity('1', new Vector3(1, 0, 0));
    // this.entityManager.createEntity('1', new Vector3(1, 0, 1));
    // this.entityManager.createEntity('D', new Vector3(2, 0, 0));

    for (const entity of entities) {
      this.entityManager.appendEntity(entity.id, entity.position);
    }
  }

  public enterEdit(): void {
    this.entityManager.enterEdit();
    this.levelEditor.enable();
  }

  public leaveEdit(): void {
    this.entityManager.leaveEdit();
    this.levelEditor.disable();
  }

  public startGame(): void {
    this.entityManager.startGame();
    // this.scene.animationsEnabled = true;
  }

  public pauseGame(): void {
    this.entityManager.pauseGame();
    // this.scene.animationsEnabled = false;
  }

  public resetGame(): void {
    this.entityManager.resetGame();
  }
}
