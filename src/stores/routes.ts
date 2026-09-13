import { defineStore } from 'pinia'
import { ROUTES } from '@/mock/routes'
import { load, save } from '@/mock/db'
import type { ExploreRoute, RouteProgress, RouteStatus } from '@/types'

interface State {
  progress: RouteProgress[]
  activeRouteId: string | null
}

export const useRoutesStore = defineStore('routes', {
  state: (): State => ({
    progress: load<RouteProgress[]>('route-progress', []),
    activeRouteId: null,
  }),

  getters: {
    byId: () => (id: string) => ROUTES.find((r) => r.id === id),

    statusMap(state): Record<string, RouteStatus> {
      const map: Record<string, RouteStatus> = {}
      for (const r of ROUTES) {
        const p = state.progress.find((x) => x.routeId === r.id)
        const depsDone = r.requires.every((dep) => {
          const dp = state.progress.find((x) => x.routeId === dep)
          return dp?.completed
        })
        if (p?.completed) map[r.id] = 'completed'
        else if (!depsDone) map[r.id] = 'locked'
        else if (p?.started) map[r.id] = 'in_progress'
        else map[r.id] = 'available'
      }
      return map
    },

    completedCount(state): number {
      return state.progress.filter((p) => p.completed).length
    },

    totalDistanceKm(): number {
      // 已打卡路线点位对应的路线距离（用于成就引擎）
      return 0
    },

    activeRoute(state): ExploreRoute | undefined {
      return ROUTES.find((r) => r.id === state.activeRouteId)
    },
  },

  actions: {
    statusOf(id: string): RouteStatus {
      return this.statusMap[id] ?? 'locked'
    },

    progressOf(id: string): RouteProgress {
      const found = this.progress.find((x) => x.routeId === id)
      return (
        found ?? { routeId: id, started: false, completed: false, checkedPointIds: [] }
      )
    },

    start(id: string) {
      this.activeRouteId = id
      const p = this.progressOf(id)
      if (!this.progress.includes(p)) this.progress.push(p)
      p.started = true
      this.persist()
    },

    // 完成一个点位打卡
    checkPoint(routeId: string, pointId: string) {
      const p = this.progressOf(routeId)
      if (!this.progress.includes(p)) this.progress.push(p)
      p.started = true
      if (!p.checkedPointIds.includes(pointId)) p.checkedPointIds.push(pointId)
      const route = this.byId(routeId)
      if (route && p.checkedPointIds.length >= route.points.length) {
        p.completed = true
      }
      this.persist()
      return p.completed
    },

    persist() {
      save('route-progress', this.progress)
    },

    reset() {
      this.progress = []
      this.activeRouteId = null
      save('route-progress', [])
    },
  },
})
