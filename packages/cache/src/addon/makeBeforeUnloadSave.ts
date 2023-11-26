import Cache, { type Storage } from "../Cache"
import CacheStatus from "../CacheStatus";

const makeBeforeUnloadSave = (storage: Storage) => (cache: Cache) => {
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

export default makeBeforeUnloadSave
