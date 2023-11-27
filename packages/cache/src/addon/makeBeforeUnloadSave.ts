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
  window.addEventListener("beforeunload", handler);
  cache.onStatusChange((status) => {
    if (status === CacheStatus.REJECTED) {
      window.removeEventListener("beforeunload", handler);
    }
  })

  return cache
}

export type { MakeBeforeUnloadSave }
export default makeBeforeUnloadSave
