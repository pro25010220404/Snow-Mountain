import { defineStore } from 'pinia'
import { load, save } from '@/mock/db'
import { useUserStore } from './user'
import { todayStr } from '@/utils/track'
import type { Redemption } from '@/types'

// 生成一个兑换码（模拟券码）
function genCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `XL-${code.slice(0, 4)}-${code.slice(4, 8)}`
}

export const useMallStore = defineStore('mall', {
  state: () => ({
    redemptions: load<Redemption[]>('redemptions', []),
  }),

  getters: {
    sorted(state): Redemption[] {
      return [...state.redemptions].sort((a, b) => (a.at < b.at ? 1 : -1))
    },
  },

  actions: {
    // 兑换：扣积分 → 生成兑换码。积分不足返回 false
    redeem(item: { name: string; cost: number; value: string }): boolean {
      const user = useUserStore()
      if (user.current.points < item.cost) return false
      user.spendPoints(item.cost)
      const rec: Redemption = {
        id: 'rd-' + Math.random().toString(36).slice(2, 8),
        itemName: item.name,
        code: genCode(),
        cost: item.cost,
        at: todayStr(),
      }
      this.redemptions.unshift(rec)
      this.persist()
      return true
    },

    persist() {
      save('redemptions', this.redemptions)
    },

    reset() {
      this.redemptions = []
      save('redemptions', [])
    },
  },
})
