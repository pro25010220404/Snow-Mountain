import { defineStore } from 'pinia'
import { load, save, clearAll } from '@/mock/db'
import type { User } from '@/types'

const GUEST: User = {
  id: 'demo-user',
  nickname: '山野旅人',
  avatar: '#2F5D5A',
  title: '初来乍到',
  points: 0,
  level: 1,
}

export interface Grants {
  motion: boolean
  location: boolean
  heart: boolean // 心率等敏感项，默认关闭
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: load<User | null>('user', null),
    grants: load<Grants>('grants', { motion: true, location: true, heart: false }),
    inviteCount: load<number>('invites', 0),
  }),

  getters: {
    isLoggedIn: (s) => s.user != null,
    current: (s): User => s.user ?? GUEST,
  },

  actions: {
    // demo 一键登录，注入预置用户
    mockLogin() {
      this.user = { ...GUEST }
      save('user', this.user)
    },
    setProfile(patch: Partial<Pick<User, 'nickname' | 'avatar'>>) {
      if (!this.user) return
      this.user = { ...this.user, ...patch }
      save('user', this.user)
    },
    setGrants(patch: Partial<Grants>) {
      this.grants = { ...this.grants, ...patch }
      save('grants', this.grants)
    },
    addPoints(n: number) {
      if (!this.user) return
      this.user.points += n
      this.user.level = Math.floor(this.user.points / 100) + 1
      save('user', this.user)
    },
    // 消费积分（积分商城兑换用），积分不足返回 false
    spendPoints(n: number): boolean {
      if (!this.user || this.user.points < n) return false
      this.user.points -= n
      this.user.level = Math.max(1, Math.floor(this.user.points / 100) + 1)
      save('user', this.user)
      return true
    },
    setTitle(title: string) {
      if (!this.user) return
      this.user.title = title
      save('user', this.user)
    },
    invite() {
      this.inviteCount += 1
      save('invites', this.inviteCount)
      return this.inviteCount
    },
    logout() {
      this.user = null
      save('user', null)
    },
    // 演示用：重置进度（保留登录态）
    resetProgress() {
      if (this.user) {
        this.user = { ...this.user, points: 0, level: 1, title: '初来乍到' }
        save('user', this.user)
      }
      this.inviteCount = 0
      save('invites', 0)
    },
    // 演示用：重置全部本地数据并登出
    resetAll() {
      clearAll()
      this.user = null
      this.grants = { motion: true, location: true, heart: false }
      this.inviteCount = 0
    },
  },
})
