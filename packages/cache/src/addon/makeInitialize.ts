import { type Storage } from "../Cache"
import CacheStatus from "../CacheStatus";
import type { Addon } from "./makeAddons";
import { now } from "../utils";

interface MakeInitialize {
  (storage?: Storage): Addon;
}

const makeInitialize: MakeInitialize = (storage) => (cache) => {
  if (storage) {
    storage.read(cache.namespace).then(kvs => {
      const current = now()
      for (const [key, item] of kvs) {
        const { value, persist, expires } = item
        cache.set(key, value, {
          persist,
          maxAge: (expires || 0) - current
        })
      }

      cache.status = CacheStatus.FULFILLED
    }, (e) => {
      console.error(e)
      cache.status = CacheStatus.REJECTED
    })
  }
  else {
    // Turn into fulfilled immediately if it's an in-memory cache.
    cache.status = CacheStatus.FULFILLED
  }

  return cache
}

export type { MakeInitialize }
export default makeInitialize
