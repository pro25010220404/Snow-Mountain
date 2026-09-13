import { defineStore } from 'pinia'
import { ACHIEVEMENTS } from '@/mock/achievements'
import { load, save } from '@/mock/db'
import { useRoutesStore } from './routes'
import { useRecordsStore } from './records'
import { useUserStore } from './user'
import { todayStr } from '@/utils/track'
import type { AchievementDef, AchievementType } from '@/types'

interface AchieveState {
  id: string
  progress: number
  unlocked: boolean
  unlockedAt?: string
}

export interface AchievementView extends AchievementDef {
  progress: number
  unlocked: boolean
  unlockedAt?: string
}

export const useAchievementsStore = defineStore('achievements', {
  state: () => ({
    state: load<AchieveState[]>('achievements', []),
    modalQueue: [] as AchievementDef[],
    hasNew: false,
  }),

  getters: {
    view(state): AchievementView[] {
      return ACHIEVEMENTS.map((def) => {
        const s = state.state.find((x) => x.id === def.id)
        return {
          ...def,
          progress: s?.progress ?? 0,
          unlocked: s?.unlocked ?? false,
          unlockedAt: s?.unlockedAt,
        }
      })
    },

    unlockedCount(state): number {
      return state.state.filter((s) => s.unlocked).length
    },

    currentModal(state): AchievementDef | null {
      return state.modalQueue[0] ?? null
    },

    grouped(): { type: AchievementType; label: string; items: AchievementView[] }[] {
      const order: AchievementType[] = ['explore', 'sport', 'streak', 'social', 'challenge']
      const label: Record<string, string> = {
        explore: '探索成就',
        sport: '运动成就',
        streak: '连续成就',
        social: '社交成就',
        challenge: '挑战成就',
      }
      return order.map((type) => ({
        type,
        label: label[type],
        items: this.view.filter((a) => a.type === type),
      }))
    },

    title(): string {
      const unlocked = new Set(this.state.filter((s) => s.unlocked).map((s) => s.id))
      if (unlocked.has('extreme')) return '极限突破者'
      if (unlocked.has('four-seasons')) return '四季探索大师'
      if (unlocked.has('walker-50km')) return '雪山行者'
      if (unlocked.has('first-route')) return '轻户外新手'
      return '初来乍到'
    },
  },

  actions: {
    metricValue(def: AchievementDef): number {
      const routes = useRoutesStore()
      const records = useRecordsStore()
      const user = useUserStore()
      switch (def.metric) {
        case 'routes_completed':
          return routes.completedCount
        case 'total_distance':
          return records.totalDistanceKm
        case 'invite_count':
          return user.inviteCount
        case 'streak_weeks':
          return records.distinctWeeks
        case 'advanced_route':
          return routes.progressOf(def.metricParam ?? 'winter').completed ? 1 : 0
        default:
          return 0
      }
    },

    // 重新计算所有成就进度，静默模式不弹窗（登录初始化用）
    evaluate(silent = true): AchievementDef[] {
      const user = useUserStore()
      const newly: AchievementDef[] = []
      for (const def of ACHIEVEMENTS) {
        const value = this.metricValue(def)
        const progress = Math.min(value, def.target)
        let entry = this.state.find((x) => x.id === def.id)
        if (!entry) {
          const unlocked = progress >= def.target
          entry = {
            id: def.id,
            progress,
            unlocked,
            unlockedAt: unlocked ? todayStr() : undefined,
          }
          this.state.push(entry)
        } else {
          if (!entry.unlocked && progress >= def.target) {
            entry.unlocked = true
            entry.unlockedAt = todayStr()
            newly.push(def)
          }
          entry.progress = progress
        }
      }
      for (const def of newly) user.addPoints(def.points)
      save('achievements', this.state)
      if (!silent && newly.length) {
        this.modalQueue.push(...newly)
        this.hasNew = true
      }
      this.syncTitle()
      return newly
    },

    syncTitle() {
      useUserStore().setTitle(this.title)
    },

    dismissModal() {
      this.modalQueue.shift()
    },

    markSeen() {
      this.hasNew = false
    },

    reset() {
      this.state = []
      this.modalQueue = []
      save('achievements', [])
    },
  },
})
