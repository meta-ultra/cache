const now = () => performance && performance.now && performance.now() || (+new Date())

export {
  now
}
