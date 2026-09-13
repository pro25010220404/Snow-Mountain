<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { ROUTES } from '@/mock/routes'
import { useRoutesStore } from '@/stores/routes'
import { useAchievementsStore } from '@/stores/achievements'
import { useUiStore } from '@/stores/ui'
import type { ExploreRoute, RoutePoint } from '@/types'

const route = useRoute()
const router = useRouter()
const routes = useRoutesStore()
const achievements = useAchievementsStore()
const ui = useUiStore()

const routeId = (route.query.route as string) || ''
const pointId = (route.query.point as string) || ''

const scanning = ref(false)
const result = ref<{ route: ExploreRoute; point: RoutePoint; completed: boolean } | null>(null)
const showInput = ref(false)
const manualCode = ref('')
const invalid = ref(false)

function findPointByCode(code: string) {
  const c = code.trim().toUpperCase()
  for (const r of ROUTES) {
    const p = r.points.find((x) => x.code.toUpperCase() === c)
    if (p) return { route: r, point: p }
  }
  return null
}

function target() {
  if (routeId && pointId) {
    const r = ROUTES.find((x) => x.id === routeId)
    const p = r?.points.find((x) => x.id === pointId)
    if (r && p) return { route: r, point: p }
  }
  return null
}

function simulateScan() {
  if (scanning.value) return
  scanning.value = true
  setTimeout(() => {
    let hit = target()
    if (!hit) {
      // 独立进入：随机扫到一个点位（演示用）
      const r = ROUTES[Math.floor(Math.random() * ROUTES.length)]
      const p = r.points[Math.floor(Math.random() * r.points.length)]
      hit = { route: r, point: p }
    }
    scanning.value = false
    result.value = { ...hit, completed: false }
  }, 1100)
}

function submitCode() {
  const hit = findPointByCode(manualCode.value)
  if (!hit) {
    invalid.value = true
    setTimeout(() => (invalid.value = false), 1600)
    return
  }
  result.value = { ...hit, completed: false }
  showInput.value = false
}

function claim() {
  if (!result.value) return
  const completed = routes.checkPoint(result.value.route.id, result.value.point.id)
  result.value.completed = completed
  achievements.evaluate(false)
  ui.toast(completed ? '路线全部打卡完成，新成就达成！' : '打卡成功', 'success')
}

function finish() {
  if (routeId) {
    router.replace(`/explore/route/${routeId}`)
  } else {
    router.back()
  }
}

const title = computed(() => result.value?.point.name ?? '')
</script>

<template>
  <div class="relative min-h-screen bg-ink">
    <!-- 扫码区 -->
    <div class="relative flex min-h-screen flex-col">
      <header class="flex items-center justify-between px-4 py-3 text-white">
        <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" @click="router.back()">
          <Icon name="close" :size="20" />
        </button>
        <span class="text-sm font-medium">扫码打卡</span>
        <span class="w-9" />
      </header>

      <div class="flex flex-1 flex-col items-center justify-center px-8">
        <div
          class="scan-frame relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/25 bg-gradient-to-br from-brand-800/40 to-brand-600/20"
        >
          <!-- 四角 -->
          <span class="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-brand-300" />
          <span class="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-brand-300" />
          <span class="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-brand-300" />
          <span class="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-brand-300" />

          <!-- 扫描线 -->
          <div v-if="!scanning && !result" class="scanline absolute inset-x-6" />

          <div v-if="scanning" class="text-center text-white">
            <Icon name="refresh" :size="32" class="mx-auto animate-spin" />
            <p class="mt-3 text-sm text-white/80">正在识别点位…</p>
          </div>
          <div v-else-if="!result" class="text-center text-white/70">
            <Icon name="camera" :size="40" />
            <p class="mt-3 text-sm">对准景区点位二维码</p>
          </div>
        </div>

        <button v-if="!result && !scanning" class="btn-primary mt-8 w-full py-4" @click="simulateScan">
          模拟扫码
        </button>
        <button v-if="!result && !scanning" class="btn-ghost mt-3 w-full !border-white/20 !bg-white/5 !text-white" @click="showInput = true">
          手动输入点位码
        </button>

        <p v-if="routeId" class="mt-6 text-xs text-white/50">目标点位：{{ title }}</p>
      </div>
    </div>

    <!-- 打卡成功动画层 -->
    <Transition name="modal">
      <div v-if="result" class="absolute inset-0 z-20 flex items-center justify-center bg-ink/80 p-8 backdrop-blur-sm">
        <div class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
            <Icon name="check" :size="34" :stroke="2.5" />
          </div>
          <p class="mt-4 text-xs uppercase tracking-[.2em] text-brand-500">打卡成功</p>
          <h2 class="mt-2 text-xl font-bold text-ink">{{ result.point.name }}</h2>
          <p class="mt-1 text-sm text-ink-soft">{{ result.point.desc }}</p>

          <div class="mt-4 flex items-center justify-center gap-1 text-xs text-ink-faint">
            <span class="flex items-center gap-1 rounded-full bg-paper px-3 py-1.5">
              <Icon name="sparkle" :size="14" class="text-brand-500" />
              {{ result.route.name }}
            </span>
          </div>

          <div class="mt-5 flex gap-2">
            <button v-if="result.completed" class="btn-primary w-full" @click="finish">完成</button>
            <template v-else>
              <button class="btn-ghost flex-1" @click="finish">稍后</button>
              <button class="btn-primary flex-1" @click="claim">领取奖励</button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 手动输入弹层 -->
    <Transition name="modal">
      <div v-if="showInput" class="absolute inset-0 z-20 flex items-center justify-center bg-ink/60 p-8 backdrop-blur-sm" @click.self="showInput = false">
        <div class="w-full max-w-xs rounded-3xl bg-white p-6">
          <h3 class="text-base font-bold text-ink">输入点位码</h3>
          <p class="mt-1 text-xs text-ink-faint">例如 XLS-001（见景区点位立牌）</p>
          <input
            v-model="manualCode"
            type="text"
            placeholder="XLS-000"
            class="num mt-4 w-full rounded-2xl border bg-paper px-4 py-3 text-center text-lg font-bold uppercase tracking-widest outline-none"
            :class="invalid ? 'border-rose-400' : 'border-ink/10 focus:border-brand-400'"
            @keyup.enter="submitCode"
          />
          <p v-if="invalid" class="mt-2 text-center text-xs text-rose-500">点位码无效，请重试</p>
          <div class="mt-5 flex gap-2">
            <button class="btn-ghost flex-1" @click="showInput = false">取消</button>
            <button class="btn-primary flex-1" @click="submitCode">确认</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.scan-frame {
  box-shadow: 0 0 0 8px rgba(74, 139, 132, 0.08), 0 24px 60px -20px rgba(0, 0, 0, 0.6);
}
.scanline {
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #7fb0a8, transparent);
  animation: scan 2.4s ease-in-out infinite;
}
@keyframes scan {
  0%,
  100% {
    transform: translateY(-90px);
  }
  50% {
    transform: translateY(90px);
  }
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
