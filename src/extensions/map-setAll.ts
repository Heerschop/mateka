// tslint:disable:interface-name
// tslint:disable:only-arrow-functions

export {}; // This file needs to be a module

declare global {
  interface Map<K, V> {
    setAll(iterable: Iterable<readonly [K, V]>): Map<K, V>;
  }
}

if (typeof Map.prototype.setAll !== 'function') {
  (Map.prototype.setAll as any) = function (this: Map<any, any>, iterable: Iterable<readonly [any, any]>): Map<any, any> {
    for (const [key, value] of iterable) {
      this.set(key, value);
    }

    return this;
  };
}
