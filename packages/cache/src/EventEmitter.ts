type Listener = (...args: any[]) => void

class EventEmitter {
  #eventMetadata = new Map<string, { index: number }>()
  #events = new Map<string, Map<Listener, { index: number }>>()

  on<T extends Listener = Listener>(event: string, listener: T): VoidFunction {
    if (!this.#events.has(event)) {
      this.#eventMetadata.set(event, { index: -1 })
      this.#events.set(event, new Map())
    }
    const callbacks = this.#events.get(event)
    if (callbacks && !callbacks.has(listener)) {
      const metadata = this.#eventMetadata.get(event)
      if (metadata) {
        callbacks.set(listener, { index: metadata.index + 1 })
        metadata.index += 1
      }
    }

    return () => {
      this.removeListener(event, listener)
    }
  }

  removeListener(event: string, listener: Listener): void {
    const callbacks = this.#events.get(event)
    if (callbacks) {
      callbacks.delete(listener)
      if (callbacks.size === 0) {
        this.#events.delete(event)
        this.#eventMetadata.delete(event)
      }
    }
  }

  emit(event: string, ...args: any[]): boolean {
    const callbacks = this.#events.get(event)
    if (callbacks) {
      let sortedCallbacks = Array.from(callbacks.entries()).sort((a, b) => a[1].index - b[1].index).map(a => a[0])
      sortedCallbacks.forEach((callback) => callback(...args))

      return true
    }
    else {
      return false
    }
  }
}

export default EventEmitter
