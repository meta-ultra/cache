import CacheStatus from "./CacheStatus";
import { now } from "./utils";

interface Storage {
  write(cache: Map<string, CacheItem>): Promise<boolean>;
  read(namespace: string): Promise<Map<string, CacheItem>>;
}

interface CacheOptions {
  namespace?: string;
  storage?: Storage;
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
  #cache: Map<string, CacheItem>; // The in-memory storage
  #storage: Storage;              // The external storage

  #setStatus(status: CacheStatus) {
    this.#status = status
    for (const callback of this.#callbacks.keys()) {
      callback(this.#status)
    }
  }

  #assertFulfilled() {
    if (this.#status !== CacheStatus.FULFILLED) {
      throw Error("[@meta-ultra/cache] The cache instance currently is not available.")
    }
  }

  get status() {
    return this.#status;
  }

  constructor(options?: CacheOptions) {
    if (options) {
      this.#namespace = options.namespace || this.#namespace
      this.#storage = options.storage || this.#storage
    }

    this.#cache = new Map()
    this.#callbacks = new Map()

    if (this.#storage) {
      this.#storage.read(this.#namespace).then(cache => {
        this.#cache = cache
        this.#setStatus(CacheStatus.FULFILLED)
      })
    }
    else {
      this.#setStatus(CacheStatus.FULFILLED)
    }
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
    this.#assertFulfilled()
    return this.#cache.delete(key)
  }

  removeAll(): void {
    this.#assertFulfilled()
    this.#cache.clear()
  }
}

export default Cache
