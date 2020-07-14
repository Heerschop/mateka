export class Loader {
  private loadTime?: number;
  private element: HTMLElement;

  get visible(): boolean {
    return !!this.element;
  }

  constructor(private readonly elementId: string) {
    this.element = document.getElementById(this.elementId);
  }

  show(): void {
    const element = document.createElement('div');

    element.id = this.elementId;
    element.innerHTML = `
      <div>
        <h1>Mateka</h1>
        loading...
      </div>
    `;

    element.className = 'loading-fade-in';

    document.body.appendChild(element);

    this.element = element;
  }

  hide(): void {
    let timeout = 0;

    if (!this.loadTime) {
      this.loadTime = Date.now() - (window as any).appStartDate;

      if (this.loadTime < 1000) timeout = 1000 - this.loadTime;

      console.log('loadTime:', this.loadTime);
    }

    if (this.visible) {
      setTimeout(() => {
        const element = this.element;

        element.className = 'loading-fade-out';

        element.onanimationend = () => element.remove();

        this.element = null;
      }, timeout);
    }

  }
}
