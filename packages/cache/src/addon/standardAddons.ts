import Cache, { type Storage } from "../Cache"
import makeAddons from "./makeAddons"
import makePeriodicSave from "./makePeriodicSave"
import makeBeforeUnloadSave from "./makeBeforeUnloadSave"
import makeInitialize from "./makeInitialize"

const standardAddons = (cache: Cache, storage?: Storage, interval = 8 * 60 * 1000) => {
  let addons;
  if (storage) {
    addons = makeAddons(makePeriodicSave(storage, interval), makeBeforeUnloadSave(storage), makeInitialize(storage));
  }
  else {
    addons = makeAddons(makeInitialize());
  }
  return addons(cache);
}

export default standardAddons;
