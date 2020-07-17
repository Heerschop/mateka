export class Menu {
  private element: HTMLElement;

  public get visible(): boolean {
    return !!this.element;
  }

  public constructor(hotKey = 'Escape', private readonly elementId: string = 'menu') {
    this.element = document.getElementById(this.elementId);

    window.addEventListener('keydown', event => {
      if (event.code === hotKey) {
        if (this.visible) {
          this.hide();
        } else {
          this.show();
        }
      }
    });
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
        background: #00000060;
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
