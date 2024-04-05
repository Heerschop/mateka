// tslint:disable:interface-name
// tslint:disable:only-arrow-functions

export {}; // This file needs to be a module

declare global {
  interface Set<T> {
    deleteAll(...items: T[]): boolean;
  }
}

if (typeof Set.prototype.deleteAll !== 'function') {
  (Set.prototype.deleteAll as any) = function (this: Set<any>, ...items: any): boolean {
    let failed = false;

    for (const item of items) {
      if (!this.delete(item)) failed = true;
    }

    return !failed;
  };
}
