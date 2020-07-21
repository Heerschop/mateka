export class AutoMap<K, V> extends Map<K, V> {
  public default: (key: K) => V = () => null as any;

  public get(key: K): V {
    let value = super.get(key);

    if (!value) {
      value = this.default(key);

      super.set(key, value);
    }

    return value;
  }
}
