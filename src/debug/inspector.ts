import { Scene } from '@babylonjs/core';

declare const require: (id: string) => any;

export class Inspector {
  private inspectorLoaded = false;
  public get visible(): boolean {
    return this.inspectorLoaded && this.scene.debugLayer.isVisible();
  }

  public constructor(private readonly scene: Scene, hotKey = 'KeyI', private element: HTMLElement = null) {
    window.addEventListener('keydown', event => {
      if (event.code === hotKey) {
        if (this.visible) {
          this.hide();
        } else {
          this.show();
        }
      }
    });

    if (window.location.search.includes('inspect=true')) {
      setTimeout(() => {
        this.show();
      }, 1000);
    }
  }

  public show(): void {
    if (!this.element) {
      require('@babylonjs/inspector');

      this.inspectorLoaded = true;

      this.element = this.createInspectorElement();
    }

    if (!this.visible) {
      document.body.appendChild(this.element);

      this.scene.debugLayer.show({
        overlay: false,
        globalRoot: this.element,
        embedMode: true
      });
    }

    this.updateLocation(true);
  }

  public hide(): void {
    this.scene.debugLayer.hide();

    this.updateLocation(false);

    document.body.removeChild(this.element);
  }

  private createInspectorElement(): HTMLElement {
    const element = document.createElement('div');

    element.id = 'inspector';

    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`
    #inspector {
      position: absolute;
      right: 0px;
      top: 0px;
      width: auto;
      height: 100%;
      opacity: 0.8;
      z-index: 8000;
    }
    `);

    return element;
  }

  private updateLocation(visible: boolean): void {
    const location = window.location.href.replace('?inspect=true', '').replace('?inspect=false', '');

    window.history.replaceState({}, window.location.pathname, location + '?inspect=' + visible);
  }
}
