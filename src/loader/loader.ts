export class Loader {
  private loadTime?: number;
  private element: HTMLElement;

  public get visible(): boolean {
    return !!this.element;
  }

  public constructor(private readonly elementId: string) {
    this.element = document.getElementById(this.elementId);
  }

  public show(): void {
    const element = document.createElement('div');

    element.id = this.elementId;
    element.innerHTML = `
      <div>
        <h1>Mateka</h1>
        loading...
      </div>
    `;

    element.className = 'content-fade-in';

    document.body.appendChild(element);

    this.element = element;
  }

  public hide(): void {
    let timeout = 0;

    if (!this.loadTime) {
      this.loadTime = Date.now() - (window as any).appStartDate;

      if (this.loadTime < 1000) timeout = 1000 - this.loadTime;

      console.log('loadTime:', this.loadTime);
    }

    if (this.visible) {
      setTimeout(() => {
        const element = this.element;

        element.className = 'content-fade-out';

        element.onanimationend = () => element.remove();

        this.element = null;
      }, timeout);
    }
  }
}
