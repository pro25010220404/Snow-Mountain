import type { SleepRecord } from '@/types'

// P2 数据看板 —— 近 7 天步数趋势（demo 预置，与运动记录同口径"健康生活方式"）
export const STEP_TREND: { date: string; steps: number; km: number }[] = [
  { date: '09-07', steps: 6200, km: 2.8 },
  { date: '09-08', steps: 7600, km: 3.5 },
  { date: '09-09', steps: 5400, km: 2.3 },
  { date: '09-10', steps: 4500, km: 2.0 },
  { date: '09-11', steps: 9800, km: 4.1 },
  { date: '09-12', steps: 12800, km: 6.2 },
  { date: '09-13', steps: 8300, km: 3.9 },
]

// 近 7 天睡眠记录（敏感数据默认关闭，此处为"健康生活方式"示意）
export const SLEEP_RECORDS: SleepRecord[] = [
  { date: '09-07', hours: 6.5, deep: 1.8, quality: '一般' },
  { date: '09-08', hours: 7.2, deep: 2.4, quality: '好' },
  { date: '09-09', hours: 6.8, deep: 1.9, quality: '中' },
  { date: '09-10', hours: 5.9, deep: 1.5, quality: '一般' },
  { date: '09-11', hours: 7.5, deep: 2.6, quality: '好' },
  { date: '09-12', hours: 7.8, deep: 2.9, quality: '好' },
  { date: '09-13', hours: 7.0, deep: 2.2, quality: '中' },
]
