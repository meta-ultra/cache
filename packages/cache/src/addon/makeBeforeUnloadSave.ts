import { type Storage } from "../Cache"
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
  cache.onStatusChange((status) => {
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
