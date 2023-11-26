import Cache from "../Cache"

const makeAddons = (...addons: any) => (cache: Cache) => {
  for (let i = addons.length - 1; i >= 0; i--) {
    cache = addons[i](cache)
  }

  return cache
}

export default makeAddons
