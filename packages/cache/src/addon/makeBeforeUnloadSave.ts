import { type Storage} from "../Cache"
import CacheEvent, { type CacheEventStatusCallback } from "../CacheEvent"
import CacheStatus from "../CacheStatus";
import { Addon } from "./makeAddons";

interface MakeBeforeUnloadSave {
  (storage: Storage): Addon
}

const makeBeforeUnloadSave: MakeBeforeUnloadSave = (storage) => (cache) => {
  const handler = () => {
    storage.write(cache.namespace, cache.valueOf());
  };
  if (cache.status === CacheStatus.FULFILLED) {
    window.addEventListener("beforeunload", handler);
  }
  cache.on<CacheEventStatusCallback>(CacheEvent.STATUS, (status) => {
    if (status === CacheStatus.FULFILLED) {
      window.addEventListener("beforeunload", handler);
    }
    else {
      window.removeEventListener("beforeunload", handler);
    }
  })

  return cache
}

export type { MakeBeforeUnloadSave }
export default makeBeforeUnloadSave
