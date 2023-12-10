import CacheStatus from "./CacheStatus"

enum CacheEvent {
  STATUS = "status",
  VALUE = "value",
}

type CacheEventStatusCallback = (status: CacheStatus) => void
type CacheEventValueCallback = (type: "create" | "remove" | "change", key: string, newValue: any, oldValue?: any) => void

export type { CacheEventStatusCallback, CacheEventValueCallback }
export default CacheEvent
