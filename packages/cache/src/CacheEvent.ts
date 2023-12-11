import CacheStatus from "./CacheStatus"

enum CacheEvent {
  STATUS = "status",
  VALUE = "value",
}

enum CacheValueEvent {
  ADD = "add",
  DELETE = "delete",
  CHANGE = "change",
}

type CacheEventStatusCallback = (status: CacheStatus) => void
type CacheEventValueCallback = (type: CacheValueEvent, key: string, newValue: any, oldValue?: any) => void

export type { CacheEventStatusCallback, CacheEventValueCallback }
export { CacheValueEvent }
export default CacheEvent
