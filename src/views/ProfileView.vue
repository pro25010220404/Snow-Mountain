<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import { useUserStore, type Grants } from '@/stores/user'
import { useAchievementsStore } from '@/stores/achievements'
import { useRoutesStore } from '@/stores/routes'
import { useRecordsStore } from '@/stores/records'
import { useOrdersStore } from '@/stores/orders'
import { useMallStore } from '@/stores/mall'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
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

function go(entry: { to?: string }) {
  if (entry.to) router.push(entry.to)
}

function logout() {
  user.logout()
  showLogout.value = false
  router.replace('/login')
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
  <div class="pb-24">
    <header class="sticky top-0 z-30 bg-paper/80 px-5 pb-2 pt-5 backdrop-blur">
      <h1 class="text-xl font-bold text-ink">我的</h1>
    </header>

    <main class="space-y-5 px-5">
      <!-- 个人信息卡 -->
      <section class="card relative overflow-hidden p-5">
        <div class="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-50" />
        <div class="relative flex items-center gap-4">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-glow"
            :style="{ background: user.current.avatar }"
          >
            {{ user.current.nickname.slice(0, 1) }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-ink">{{ user.current.nickname }}</h2>
              <span class="chip bg-brand-50 text-brand-700">Lv.{{ user.current.level }}</span>
            </div>
            <div class="mt-1 flex items-center gap-2">
              <span class="chip bg-amber/10 text-amber">
                <Icon name="star" :size="13" />
                {{ achievements.title }}
              </span>
            </div>
          </div>
          <div class="text-center">
            <div class="num text-xl font-bold text-brand-700">{{ user.current.points }}</div>
            <p class="text-[11px] text-ink-faint">积分</p>
          </div>
        </div>
      </section>

      <!-- 数据快捷入口 -->
      <section class="grid grid-cols-3 gap-3">
        <button v-for="s in shortcuts" :key="s.label" class="tap card flex flex-col items-center gap-1.5 py-4" @click="router.push(s.to)">
          <Icon :name="s.icon" :size="22" class="text-brand-600" />
          <span class="text-xs text-ink-soft">{{ s.label }}</span>
        </button>
      </section>

      <!-- 功能入口 -->
      <section class="card overflow-hidden">
        <button
          v-for="(e, i) in entries"
          :key="e.label"
          class="tap flex w-full items-center gap-3 border-b border-ink/5 px-5 py-4 text-left last:border-0"
          :class="{ 'border-0': i === entries.length - 1 }"
          @click="go(e)"
        >
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon :name="e.icon" :size="19" />
          </span>
          <span class="flex-1">
            <span class="block text-sm font-medium text-ink">{{ e.label }}</span>
            <span class="mt-0.5 block text-xs text-ink-faint">{{ e.desc }}</span>
          </span>
          <Icon name="chevron-right" :size="18" class="text-ink-faint" />
        </button>
      </section>

      <!-- 设置 -->
      <section class="card overflow-hidden">
        <button class="tap flex w-full items-center gap-3 border-b border-ink/5 px-5 py-4 text-left" @click="showPrivacy = true">
          <Icon name="eye" :size="19" class="text-ink-faint" />
          <span class="flex-1 text-sm text-ink">隐私授权管理</span>
          <Icon name="chevron-right" :size="18" class="text-ink-faint" />
        </button>
        <button class="tap flex w-full items-center gap-3 border-b border-ink/5 px-5 py-4 text-left" @click="resetAll">
          <Icon name="refresh" :size="19" class="text-ink-faint" />
          <span class="flex-1 text-sm text-ink">重置演示数据</span>
        </button>
        <button class="tap flex w-full items-center gap-3 px-5 py-4 text-left" @click="showLogout = true">
          <Icon name="user" :size="19" class="text-rose-500" />
          <span class="flex-1 text-sm text-rose-500">退出登录</span>
        </button>
      </section>

      <p class="text-center text-[11px] text-ink-faint">西岭雪山 · 轻康养探索者 · 演示版</p>
    </main>

    <!-- 隐私授权弹层 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPrivacy" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-8 backdrop-blur-sm" @click.self="showPrivacy = false">
          <div class="w-full max-w-xs rounded-3xl bg-white p-6 shadow-lift">
            <h3 class="text-base font-bold text-ink">隐私授权管理</h3>
            <p class="mt-1 text-xs text-ink-faint">以下授权可随时开关，心率等敏感数据默认关闭。</p>
            <div class="mt-4 space-y-3">
              <div v-for="g in grantItems" :key="g.key" class="flex items-center justify-between">
                <span class="text-sm text-ink-soft">{{ g.label }}</span>
                <button
                  class="relative h-6 w-11 rounded-full transition"
                  :class="user.grants[g.key] ? 'bg-brand-500' : 'bg-ink/15'"
                  @click="toggleGrant(g.key)"
                >
                  <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="user.grants[g.key] ? 'left-[22px]' : 'left-0.5'" />
                </button>
              </div>
            </div>
            <button class="btn-primary mt-5 w-full" @click="showPrivacy = false">完成</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 退出确认 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showLogout" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-8 backdrop-blur-sm" @click.self="showLogout = false">
          <div class="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-lift">
            <h3 class="text-base font-bold text-ink">确认退出登录？</h3>
            <p class="mt-1 text-xs text-ink-faint">退出后需重新进入演示账号</p>
            <div class="mt-5 flex gap-2">
              <button class="btn-ghost flex-1" @click="showLogout = false">取消</button>
              <button class="flex-1 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white active:scale-[.98]" @click="logout">退出</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <TabBar />
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
