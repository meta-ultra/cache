import { type Storage } from "../Cache"
import CacheStatus from "../CacheStatus";
import { Addon } from "./makeAddons";

interface MakePeriodicSave {
  (storage: Storage, timeout: number): Addon
}

const makePeriodicSave: MakePeriodicSave = (storage, timeout) => (cache) => {
  const handler = () => {
    storage.write(cache.namespace, cache.valueOf());
  };

  let hd;
  if (cache.status === CacheStatus.FULFILLED) {
    hd = setInterval(handler, timeout);
  }

  cache.onStatusChange((status) => {
    if (status === CacheStatus.FULFILLED) {
      hd = setInterval(handler, timeout);
    }
    else {
      clearInterval(hd)
    }
  })

  return cache
}

export type { MakePeriodicSave }
export default makePeriodicSave
