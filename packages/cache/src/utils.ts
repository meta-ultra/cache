const now = () => performance && performance.now && performance.now() || (+new Date())

const nextTick = (() => {
  const promise = Promise.resolve()
  return (fn: VoidFunction) => promise.then(fn)
})()

export {
  now,
  nextTick,
}
