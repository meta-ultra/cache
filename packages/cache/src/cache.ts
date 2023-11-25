import CacheStatus from "./CacheStatus";

interface CacheOptions {
  prefix?: string;
}

interface CacheItem {
  value: unknown;
  expires?: Date;
  persist: boolean;
}

class Cache {
  #prefix: string = "@meta-ultra/cache";
  #cache: Map<string, CacheItem>;
  #status: CacheStatus = CacheStatus.PENDING;

  constructor(options?: CacheOptions) {
    if (options) {
      this.#prefix = options.prefix || this.#prefix
    }

    this.#cache = new Map()
  }

  get(key: string): unknown {
    return this.#cache.get(key)
  }

  set(key: string, value: unknown) {
    this.#cache.set(key, {
      value,
      persist: false
    })
  }

  remove(key: string): boolean {
    return this.#cache.delete(key)
  }

  removeAll() {
    this.#cache.clear()
  }
}

export default Cache
