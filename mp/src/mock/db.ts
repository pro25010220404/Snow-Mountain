// 极简本地持久化（模拟后端数据库）—— 小程序用 uni storage
const PREFIX = 'xiling:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = uni.getStorageSync(PREFIX + key)
    if (raw == null || raw === '') return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(PREFIX + key, JSON.stringify(value))
  } catch {
    /* 忽略写入失败 */
  }
}

export function clearAll(): void {
  try {
    const info = uni.getStorageInfoSync()
    for (const k of info.keys) {
      if (k.startsWith(PREFIX)) uni.removeStorageSync(k)
    }
  } catch {
    /* noop */
  }
}
