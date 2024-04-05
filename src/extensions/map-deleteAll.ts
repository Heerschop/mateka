// tslint:disable:interface-name
// tslint:disable:only-arrow-functions

export {}; // This file needs to be a module

declare global {
  interface Map<K, V> {
    deleteAll(...keys: K[]): boolean;
  }
}

if (typeof Map.prototype.deleteAll !== 'function') {
  (Map.prototype.deleteAll as any) = function (this: Map<any, any>, ...keys: any): boolean {
    let failed = false;

    for (const key of keys) {
      if (!this.delete(key)) failed = true;
    }

    return !failed;
  };
}
