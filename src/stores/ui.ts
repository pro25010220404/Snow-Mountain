import { defineStore } from 'pinia'
import type { Medal } from '@/types'

export interface ToastItem {
  id: number
  text: string
  type: 'info' | 'success' | 'warn'
}

export interface SharePayload {
  kind: 'achievement' | 'record'
  title: string
  subtitle: string
  stats: { label: string; value: string }[]
  medal?: Medal
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [] as ToastItem[],
    share: null as SharePayload | null,
  }),

  actions: {
    toast(text: string, type: ToastItem['type'] = 'info') {
      const id = Math.random()
      this.toasts.push({ id, text, type })
      setTimeout(() => this.remove(id), 2600)
    },
    remove(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },
    openShare(payload: SharePayload) {
      this.share = payload
    },
    closeShare() {
      this.share = null
    },
  },
})
