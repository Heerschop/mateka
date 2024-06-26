import { Scene } from '@babylonjs/core';

declare const require: (id: string) => any;

export class Inspector {
  private inspectorLoaded = false;
  private readonly eventTarget: EventTarget;

  public get visible(): boolean {
    return this.inspectorLoaded && this.scene.debugLayer.isVisible();
  }

  public constructor(private readonly scene: Scene, hotKey = 'KeyI', private element: HTMLElement = null) {
    this.eventTarget = new EventTarget();

    window.addEventListener('keydown', event => {
      const target = event.target as HTMLElement;

      if (target.nodeName !== 'INPUT' && event.code === hotKey) {
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

  public addEventListener(type: 'hide' | 'show', listener: (this: Inspector, event: Event) => void, options?: boolean | AddEventListenerOptions): void {
    this.eventTarget.addEventListener(type, event => listener.call(this, event), options);
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

      this.eventTarget.dispatchEvent(new Event('show'));
    }

    this.updateLocation(true);
  }

  public hide(): void {
    if (this.visible) {
      this.eventTarget.dispatchEvent(new Event('hide'));

      this.scene.debugLayer.hide();

      this.updateLocation(false);

      document.body.removeChild(this.element);
    }
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
