// 全局类型定义（与后端"核心数据模型"对齐，demo 期由 mock 层提供）

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export interface User {
  id: string
  nickname: string
  avatar: string // 头像色 token
  title: string // 当前称号
  points: number
  level: number
}

export interface PointNav {
  from: string // 出发点（上一站或入口）
  meters: number // 距离（米）
  minutes: number // 步行/交通耗时（分钟）
  steps: string[] // 分步指引
}

export interface RoutePoint {
  id: string
  name: string
  desc: string
  code: string // 点位打卡码（模拟 AR 扫码）
  nav: PointNav
}

export type RouteStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface ExploreRoute {
  id: string
  season: Season
  name: string
  subtitle: string
  difficulty: number // 1-5
  duration: string
  distanceKm: number
  cover: { from: string; to: string } // 封面渐变
  intro: string
  wellness: string // 康养价值文案
  points: RoutePoint[]
  requires: string[] // 前置路线 id，空数组 = 无前置
}

export interface RouteProgress {
  routeId: string
  started: boolean
  completed: boolean
  checkedPointIds: string[]
}

export interface TrackPoint {
  x: number
  y: number
}

export interface ExerciseRecord {
  id: string
  date: string // YYYY-MM-DD
  steps: number
  distanceKm: number
  durationMin: number
  track: TrackPoint[]
  passedPoints: { name: string; checked: boolean }[]
}

export type AchievementType = 'explore' | 'sport' | 'social' | 'streak' | 'challenge'
export type AchievementMetric =
  | 'routes_completed'
  | 'total_distance'
  | 'invite_count'
  | 'streak_weeks'
  | 'advanced_route'

export interface Medal {
  icon: string // Icon 组件图标名
  hue: 'emerald' | 'ice' | 'amber' | 'rose' | 'violet' | 'cyan' | 'gold'
}

export interface AchievementDef {
  id: string
  type: AchievementType
  name: string
  condition: string
  reward: string
  metric: AchievementMetric
  target: number
  points: number
  medal: Medal
  metricParam?: string
}

export interface UserAchievement {
  achievementId: string
  progress: number
  unlocked: boolean
  unlockedAt?: string
}

export interface LeaderboardEntry {
  id: string
  nickname: string
  avatar: string
  value: number
  isMe?: boolean
}

// —— P2 服务预订 / 积分商城 ——

export type ServiceCategory = 'stay' | 'food' | 'activity'

export interface ServiceItem {
  id: string
  category: ServiceCategory
  name: string
  desc: string
  price: number // 元
  unit: string // 计价单位，如 /晚 /份 /位
  tags: string[]
  includes: string[]
  cover: { from: string; to: string }
}

export type OrderStatus = 'pending' | 'paid' | 'done'

export interface Order {
  id: string
  serviceId: string
  serviceName: string
  date: string // 出行日期 YYYY-MM-DD
  price: number
  status: OrderStatus
  createdAt: string
}

export interface MallItem {
  id: string
  name: string
  desc: string
  cost: number // 所需积分
  type: 'coupon' | 'goods'
  value: string // 兑换物描述（折扣券/兑换码文案）
  cover: { from: string; to: string }
  stock: number
}

export interface Redemption {
  id: string
  itemName: string
  code: string
  cost: number
  at: string
}

// —— P2 数据看板 ——

export interface SleepRecord {
  date: string
  hours: number // 总时长（小时）
  deep: number // 深睡时长（小时）
  quality: '好' | '中' | '一般'
}
