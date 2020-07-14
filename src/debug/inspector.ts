import { Scene } from '@babylonjs/core';

export class Inspector {
  get visible(): boolean {
    return this.scene.debugLayer.isVisible();
  }

  constructor(private readonly scene: Scene, private readonly element: HTMLElement) {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyI') {
        if (this.visible) {
          this.hide();
        }
        else {
          this.show();
        }
      }
    });

    if (window.location.search.includes('inspect=true')) {
      setTimeout(() => {
        this.show();
      }, 2000);
    }
  }

  public show(): void {
    if (!this.visible) {
      this.scene.debugLayer.show({
        overlay: false,
        globalRoot: this.element,
        embedMode: true,
      });
    }

    this.updateLocation(true);
  }

  public hide(): void {
    this.scene.debugLayer.hide();

    this.updateLocation(false);
  }

  private updateLocation(visible: boolean): void {
    const location = window.location.href.replace('?inspect=true', '').replace('?inspect=false', '');

    window.history.replaceState({}, window.location.pathname, location + '?inspect=' + visible);
  }
}
