import Cache from "../Cache"

interface Addon {
  (cache: Cache): Cache;
}

const makeAddons = (...addons: Addon[]) => (cache: Cache) => {
  for (let i = addons.length - 1; i >= 0; i--) {
    cache = addons[i](cache)
  }

  return cache
}

export type { Addon }
export default makeAddons
