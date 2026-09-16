import { defineStore } from 'pinia'
import type { Medal } from '@/types'

export interface SharePayload {
  kind: 'achievement' | 'record'
  title: string
  subtitle: string
  stats: { label: string; value: string }[]
  medal?: Medal
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    share: null as SharePayload | null,
  }),

  actions: {
    toast(text: string, type: 'info' | 'success' | 'warn' = 'info') {
      const icon = type === 'success' ? 'success' : 'none'
      uni.showToast({ title: text, icon: icon as 'success' | 'none', duration: 2200 })
    },
    openShare(payload: SharePayload) {
      this.share = payload
    },
    closeShare() {
      this.share = null
    },
  },
})
