import { defineStore } from 'pinia'
import { load, save } from '@/mock/db'
import { todayStr } from '@/utils/track'
import type { Order, OrderStatus } from '@/types'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: load<Order[]>('orders', []),
  }),

  getters: {
    sorted(state): Order[] {
      return [...state.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    },
  },

  actions: {
    // 提交订单（mock，初始"待支付"）
    placeOrder(input: { serviceId: string; serviceName: string; date: string; price: number }) {
      const order: Order = {
        id: 'o-' + Math.random().toString(36).slice(2, 8),
        createdAt: todayStr(),
        status: 'pending',
        ...input,
      }
      this.orders.unshift(order)
      this.persist()
      return order
    },

    // 模拟支付成功
    markPaid(id: string) {
      const o = this.orders.find((x) => x.id === id)
      if (o) o.status = 'paid'
      this.persist()
    },

    // 演示用：把已支付订单标记为已完成
    setStatus(id: string, status: OrderStatus) {
      const o = this.orders.find((x) => x.id === id)
      if (o) o.status = status
      this.persist()
    },

    persist() {
      save('orders', this.orders)
    },

    reset() {
      this.orders = []
      save('orders', [])
    },
  },
})
