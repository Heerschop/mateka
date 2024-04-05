export class Menu {
  private element: HTMLElement;
  private readonly eventTarget: EventTarget;

  public get visible(): boolean {
    return !!this.element;
  }

  public constructor(hotKey = 'Escape', private readonly elementId: string = 'menu') {
    let editMode = false;
    let pausegame = true;

    this.element = document.getElementById(this.elementId);
    this.eventTarget = new EventTarget();

    window.addEventListener('keydown', event => {
      if (event.code === hotKey) {
        if (this.visible) {
          this.hide();
        } else {
          this.show();
        }
      }

      switch (event.code) {
        case 'KeyE':
          if (editMode) {
            this.eventTarget.dispatchEvent(new Event('leaveedit'));
          } else {
            this.eventTarget.dispatchEvent(new Event('enteredit'));
          }
          editMode = !editMode;
          break;
        case 'KeyS':
          this.eventTarget.dispatchEvent(new Event('startgame'));
          pausegame = false;
          break;
        case 'KeyR':
          this.eventTarget.dispatchEvent(new Event('resetgame'));
          break;
        case 'KeyP':
          if (pausegame) {
            this.eventTarget.dispatchEvent(new Event('startgame'));
          } else {
            this.eventTarget.dispatchEvent(new Event('pausegame'));
          }
          pausegame = !pausegame;
          break;
      }
    });

    const element = document.createElement('div');

    element.innerHTML = `
      <h2 style="position: absolute;bottom: 32px;left:32px">(E)dit&nbsp;&nbsp;&nbsp;(S)tart&nbsp;&nbsp;&nbsp;(R)eset&nbsp;&nbsp;&nbsp;(P)ause</h2>
    `;
    document.body.appendChild(element);
  }

  public addEventListener(type: 'enteredit' | 'leaveedit' | 'startgame' | 'pausegame' | 'resetgame', listener: (this: Menu, event: Event) => void, options?: boolean | AddEventListenerOptions): void {
    this.eventTarget.addEventListener(type, event => listener.call(this, event), options);
  }

  public show(): void {
    const element = document.createElement('div');

    element.id = this.elementId;
    element.innerHTML =
      `
      <div id="` +
      this.elementId +
      `">
        <div>
          <h1>Continue</h1>
          <h1>New Game</h1>
          <h1>Level Editor</h1>
          <h1>Options</h1>
        </div>
      </div>
    `;

    element.className = 'content-fade-in';
    document.body.appendChild(element);

    this.element = element;

    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(
      `
      #` +
        this.elementId +
        ` {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        background: #00000040;
        display: flex;
      }
    `
    );

    style.sheet.insertRule(
      `
      #` +
        this.elementId +
        ` > div {
        user-select: none;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 1.3vw;
      }
    `
    );
  }

  public hide(): void {
    if (this.visible) {
      const element = this.element;

      element.className = 'content-fade-out';

      element.onanimationend = () => element.remove();

      this.element = null;
    }
  }
}
