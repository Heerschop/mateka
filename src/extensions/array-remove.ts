// tslint:disable:interface-name
// tslint:disable:only-arrow-functions

export {}; // This file needs to be a module

declare global {
  interface Array<T> {
    remove(...items: T[]): void;
  }
}

if (typeof Array.prototype.remove !== 'function') {
  (Array.prototype.remove as any) = function (this: any[], ...items: any): void {
    for (const item of items) {
      let index: number;

      while ((index = this.indexOf(item)) !== -1) {
        this.splice(index, 1);
      }
    }
  };
}
