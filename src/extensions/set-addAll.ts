// tslint:disable:interface-name
// tslint:disable:only-arrow-functions

export {}; // This file needs to be a module

declare global {
  interface Set<T> {
    addAll(...items: T[]): Set<T>;
  }
}

if (typeof Set.prototype.addAll !== 'function') {
  (Set.prototype.addAll as any) = function (this: Set<any>, item: any) {
    for (const argument of arguments) {
      this.add(argument);
    }

    return this;
  };
}
