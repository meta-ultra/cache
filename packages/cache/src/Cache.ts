import CacheStatus from "./CacheStatus";
import { now } from "./utils";

/**------------------------------------------------------------------------
 *                           Pure In-memory Cache
 *
 * const addons = makeAddons(makeInitialize())
 * const cache = addons(new Cache())
 *
 * const storage = new WebStorage()
 * const addons = makeAddons(makePeriodicSave(storage), makeBeforeUnloadSave(storage), makeInitialize(storage))
 * const cache = addons(new Cache())
 *------------------------------------------------------------------------**/

interface Storage {
  write(namespace: string, cache: IterableIterator<[string, CacheItem]>): Promise<boolean>;
  read(namespace: string): Promise<IterableIterator<[string, CacheItem]>>;
}

interface CacheOptions {
  namespace?: string;
}

interface CacheItem {
  value: unknown;
  expires?: number;
  persist: boolean;
}

interface StatusChangeCallback {
  (status: CacheStatus): void
}

interface SetCacheOptions {
  persist?: boolean;
  maxAge?: number;
}

class Cache {
  // #version: string = process.env.VERSION;
  #namespace: string = "@meta-ultra/cache";
  #status: CacheStatus = CacheStatus.PENDING;
  #callbacks: Map<StatusChangeCallback, StatusChangeCallback>;
  #cache: Map<string, CacheItem>;

  #assertFulfilled() {
    if (this.#status !== CacheStatus.FULFILLED) {
      throw Error("[@meta-ultra/cache] The cache instance currently is not available.")
    }
  }

  get namespace() {
    return this.#namespace;
  }

  set status(status: CacheStatus) {
    this.#status = status
    for (const callback of this.#callbacks.keys()) {
      callback(this.#status)
    }
  }

  get status() {
    return this.#status;
  }

  constructor(options?: CacheOptions) {
    if (options) {
      this.#namespace = options.namespace || this.#namespace
    }

    this.#cache = new Map()
    this.#callbacks = new Map()
  }

  onStatusChange(callback: StatusChangeCallback): () => void {
    if (!this.#callbacks.has(callback)) {
      this.#callbacks.set(callback, () => {
        this.#callbacks.delete(callback)
      })
    }

    return this.#callbacks.get(callback) as () => void
  }

  get(key: string): unknown {
    this.#assertFulfilled()
    const cacheItem = this.#cache.get(key)
    let value: unknown = undefined
    if (cacheItem) {
      value = cacheItem.value
      if (cacheItem.expires !== undefined && now() >= cacheItem.expires) {
        this.remove(key);
        value = undefined
      }
    }

    return value;
  }

  set(key: string, value: unknown, options?: number | SetCacheOptions): boolean {
    this.#assertFulfilled();

    // Setting cache item to undefined means remove that cache item.
    if (value === undefined) {
      this.remove(key);
      return false;
    }

    let persist = false
    let expires: undefined | number = undefined
    if (options) {
      if (typeof options === "number") {
        expires = now() + options;
      }
      else if (options.maxAge) {
        expires = now() + options.maxAge;
      }
      else if (options.persist) {
        persist = true;
      }
    }

    // Remove the cache item when expires.
    if (expires !== undefined && now() >= expires) {
      this.remove(key);
      return false;
    }

    this.#cache.set(key, {
      value,
      expires,
      persist,
    });

    return true;
  }

  remove(key: string): boolean {
    this.#assertFulfilled();
    return this.#cache.delete(key);
  }

  removeAll(): void {
    this.#assertFulfilled();
    this.#cache.clear();
  }

  valueOf(): IterableIterator<[string, CacheItem]> {
    return this.#cache.entries()
  }
}

export { Storage }
export default Cache
