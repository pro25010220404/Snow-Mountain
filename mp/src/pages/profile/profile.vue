<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import AchievementModal from '@/components/AchievementModal.vue'
import ShareCard from '@/components/ShareCard.vue'
import { push, replace } from '@/utils/nav'
import { useUserStore, type Grants } from '@/stores/user'
import { useAchievementsStore } from '@/stores/achievements'
import { useRoutesStore } from '@/stores/routes'
import { useRecordsStore } from '@/stores/records'
import { useOrdersStore } from '@/stores/orders'
import { useMallStore } from '@/stores/mall'
import { useUiStore } from '@/stores/ui'

const user = useUserStore()
const achievements = useAchievementsStore()
const routes = useRoutesStore()
const records = useRecordsStore()
const orders = useOrdersStore()
const mall = useMallStore()
const ui = useUiStore()

const showPrivacy = ref(false)
const showLogout = ref(false)

const grantItems: { key: keyof Grants; label: string }[] = [
  { key: 'motion', label: '运动数据' },
  { key: 'location', label: '定位数据' },
  { key: 'heart', label: '心率等敏感数据' },
]

function toggleGrant(k: keyof Grants) {
  const patch: Partial<Grants> = {}
  patch[k] = !user.grants[k]
  user.setGrants(patch)
}

const shortcuts = [
  { label: '运动记录', icon: 'footprints', to: '/checkin' },
  { label: '成就勋章', icon: 'medal', to: '/achievement' },
  { label: '排行榜', icon: 'trophy', to: '/rank' },
]

const entries = [
  { label: 'AI 路线推荐', desc: '按强度与兴趣挑一条路线', icon: 'sparkle', to: '/explore/ai' },
  { label: '服务预订', desc: '住宿 · 餐饮 · 活动', icon: 'ticket', to: '/profile/booking' },
  { label: '积分商城', desc: '积分兑换折扣券与周边', icon: 'gift', to: '/profile/mall' },
  { label: '数据看板', desc: '运动周报 · 睡眠记录', icon: 'chart', to: '/profile/dashboard' },
]

function go(to?: string) {
  if (to) push(to)
}

function logout() {
  user.logout()
  showLogout.value = false
  replace('/login')
}

function resetAll() {
  user.resetProgress()
  routes.reset()
  records.reset()
  achievements.reset()
  orders.reset()
  mall.reset()
  ui.toast('演示数据已重置', 'success')
}
</script>

<template>
  <view class="pb-24">
    <view class="safe-top sticky top-0 z-30 bg-paper/80 px-5 pb-2">
      <view class="text-xl font-bold text-ink">我的</view>
    </view>

    <view class="flex flex-col gap-5 px-5">
      <!-- 个人信息卡 -->
      <view class="card relative overflow-hidden p-5">
        <view class="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-50" />
        <view class="relative flex items-center gap-4">
          <view
            class="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-glow"
            :style="{ background: user.current.avatar }"
          >
            {{ user.current.nickname.slice(0, 1) }}
          </view>
          <view class="flex-1">
            <view class="flex items-center gap-2">
              <view class="text-lg font-bold text-ink">{{ user.current.nickname }}</view>
              <view class="chip bg-brand-50 text-brand-700">Lv.{{ user.current.level }}</view>
            </view>
            <view class="mt-1 flex items-center gap-2">
              <view class="chip bg-amber/10 text-amber">
                <Icon name="star" :size="13" color="amber" />
                {{ achievements.title }}
              </view>
            </view>
          </view>
          <view class="text-center">
            <view class="num text-xl font-bold text-brand-700">{{ user.current.points }}</view>
            <view class="text-[11px] text-ink-faint">积分</view>
          </view>
        </view>
      </view>

      <!-- 数据快捷入口 -->
      <view class="grid grid-cols-3 gap-3">
        <view v-for="s in shortcuts" :key="s.label" class="tap card flex flex-col items-center gap-1.5 py-4" @click="push(s.to)">
          <Icon :name="s.icon" :size="22" color="brand600" />
          <text class="text-xs text-ink-soft">{{ s.label }}</text>
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="card overflow-hidden">
        <view
          v-for="(e, i) in entries"
          :key="e.label"
          class="tap flex w-full items-center gap-3 border-b border-ink/5 px-5 py-4 last:border-0"
          :class="{ 'border-0': i === entries.length - 1 }"
          @click="go(e.to)"
        >
          <view class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
            <Icon :name="e.icon" :size="19" color="brand600" />
          </view>
          <view class="flex-1">
            <view class="block text-sm font-medium text-ink">{{ e.label }}</view>
            <view class="mt-0.5 block text-xs text-ink-faint">{{ e.desc }}</view>
          </view>
          <Icon name="chevron-right" :size="18" color="inkFaint" />
        </view>
      </view>

      <!-- 设置 -->
      <view class="card overflow-hidden">
        <view class="tap flex w-full items-center gap-3 border-b border-ink/5 px-5 py-4" @click="showPrivacy = true">
          <Icon name="eye" :size="19" color="inkFaint" />
          <view class="flex-1 text-sm text-ink">隐私授权管理</view>
          <Icon name="chevron-right" :size="18" color="inkFaint" />
        </view>
        <view class="tap flex w-full items-center gap-3 border-b border-ink/5 px-5 py-4" @click="resetAll">
          <Icon name="refresh" :size="19" color="inkFaint" />
          <view class="flex-1 text-sm text-ink">重置演示数据</view>
        </view>
        <view class="tap flex w-full items-center gap-3 px-5 py-4" @click="showLogout = true">
          <Icon name="user" :size="19" color="rose500" />
          <view class="flex-1 text-sm text-rose-500">退出登录</view>
        </view>
      </view>

      <view class="text-center text-[11px] text-ink-faint">西岭雪山 · 轻康养探索者 · 演示版</view>
    </view>

    <!-- 隐私授权弹层 -->
    <view v-if="showPrivacy" class="fixed inset-0 z-50 flex items-center justify-center p-8">
      <view class="absolute inset-0 bg-ink/60" @click="showPrivacy = false" />
      <view class="relative w-full max-w-xs rounded-3xl bg-white p-6 shadow-lift">
        <view class="text-base font-bold text-ink">隐私授权管理</view>
        <view class="mt-1 text-xs text-ink-faint">以下授权可随时开关，心率等敏感数据默认关闭。</view>
        <view class="mt-4 flex flex-col gap-3">
          <view v-for="g in grantItems" :key="g.key" class="flex items-center justify-between">
            <text class="text-sm text-ink-soft">{{ g.label }}</text>
            <view
              class="switch relative h-6 w-11 rounded-full"
              :class="user.grants[g.key] ? 'bg-brand-500' : 'bg-ink/15'"
              @click="toggleGrant(g.key)"
            >
              <view
                class="switch-thumb absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow"
                :class="user.grants[g.key] ? 'switch-thumb-on' : ''"
              />
            </view>
          </view>
        </view>
        <view class="btn-primary mt-5 w-full" @click="showPrivacy = false">完成</view>
      </view>
    </view>

    <!-- 退出确认 -->
    <view v-if="showLogout" class="fixed inset-0 z-50 flex items-center justify-center p-8">
      <view class="absolute inset-0 bg-ink/60" @click="showLogout = false" />
      <view class="relative w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-lift">
        <view class="text-base font-bold text-ink">确认退出登录？</view>
        <view class="mt-1 text-xs text-ink-faint">退出后需重新进入演示账号</view>
        <view class="mt-5 flex gap-2">
          <view class="btn-ghost flex-1" @click="showLogout = false">取消</view>
          <view class="flex-1 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white" @click="logout">退出</view>
        </view>
      </view>
    </view>

    <TabBar current="profile" />
    <AchievementModal />
    <ShareCard />
  </view>
</template>
