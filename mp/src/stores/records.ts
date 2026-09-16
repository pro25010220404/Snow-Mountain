import { defineStore } from 'pinia'
import { SEED_RECORDS } from '@/mock/records'
import { load, save } from '@/mock/db'
import type { ExerciseRecord } from '@/types'

export const useRecordsStore = defineStore('records', {
  state: () => ({
    records: load<ExerciseRecord[]>('records', SEED_RECORDS),
    pending: load<ExerciseRecord[]>('pending-records', []),
    offline: false,
  }),

  getters: {
    totalDistanceKm(state): number {
      return state.records.reduce((sum, r) => sum + r.distanceKm, 0)
    },
    // 打卡覆盖的周数（连续成就用）
    distinctWeeks(state): number {
      const weeks = new Set<number>()
      for (const r of state.records) {
        const d = new Date(r.date)
        const oneJan = new Date(d.getFullYear(), 0, 1)
        const week = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7)
        weeks.add(week)
      }
      return weeks.size
    },
    todayStats(state) {
      const today = state.records[0]?.date ?? ''
      const list = state.records.filter((r) => r.date === today)
      return {
        steps: list.reduce((s, r) => s + r.steps, 0),
        km: +list.reduce((s, r) => s + r.distanceKm, 0).toFixed(1),
        count: list.length,
      }
    },
  },

  actions: {
    // 记录一条运动记录；离线时本地暂存（弱网打卡不丢）
    addRecord(record: ExerciseRecord) {
      if (this.offline) {
        this.pending.push(record)
        save('pending-records', this.pending)
        return 'queued'
      }
      this.records = [record, ...this.records]
      save('records', this.records)
      return 'ok'
    },

    // 网络恢复后批量上报
    flushPending() {
      if (!this.pending.length) return 0
      this.records = [...this.pending, ...this.records]
      this.pending = []
      save('records', this.records)
      save('pending-records', this.pending)
      return 1
    },

    setOffline(v: boolean) {
      this.offline = v
    },

    reset() {
      this.records = [...SEED_RECORDS]
      this.pending = []
      this.offline = false
      save('records', this.records)
      save('pending-records', [])
    },
  },
})
