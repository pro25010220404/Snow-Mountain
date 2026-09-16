<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Icon from '@/components/Icon.vue'
import AchievementModal from '@/components/AchievementModal.vue'
import ShareCard from '@/components/ShareCard.vue'
import { replace, back } from '@/utils/nav'
import { ROUTES } from '@/mock/routes'
import { useRoutesStore } from '@/stores/routes'
import { useAchievementsStore } from '@/stores/achievements'
import { useUiStore } from '@/stores/ui'
import type { ExploreRoute, RoutePoint } from '@/types'

const routes = useRoutesStore()
const achievements = useAchievementsStore()
const ui = useUiStore()

const routeId = ref('')
const pointId = ref('')
onLoad((q) => {
  if (q && q.route) routeId.value = q.route as string
  if (q && q.point) pointId.value = q.point as string
})

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
  if (routeId.value && pointId.value) {
    const r = ROUTES.find((x) => x.id === routeId.value)
    const p = r?.points.find((x) => x.id === pointId.value)
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
      const r = ROUTES[Math.floor(Math.random() * ROUTES.length)]
      const p = r.points[Math.floor(Math.random() * r.points.length)]
      hit = { route: r, point: p }
    }
    scanning.value = false
    result.value = { ...hit, completed: false }
  }, 1100)
}

function realScan() {
  uni.scanCode({
    onlyFromCamera: false,
    success: (res) => {
      const hit = findPointByCode(res.result)
      if (hit) result.value = { ...hit, completed: false }
      else ui.toast('未识别的点位码，请对准景区二维码', 'warn')
    },
    fail: () => ui.toast('已取消扫码', 'info'),
  })
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
  if (routeId.value) {
    replace(`/explore/route/${routeId.value}`)
  } else {
    back()
  }
}

const title = computed(() => result.value?.point.name ?? '')
</script>

<template>
  <view class="relative min-h-screen bg-ink">
    <view class="relative flex min-h-screen flex-col">
      <view class="safe-top flex items-center justify-between px-4 pb-3 text-white">
        <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" @click="back()">
          <Icon name="close" :size="20" color="white" />
        </view>
        <view class="text-sm font-medium">扫码打卡</view>
        <view class="w-9" />
      </view>

      <view class="flex flex-1 flex-col items-center justify-center px-8">
        <view
          class="scan-frame relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/25 bg-gradient-to-br from-brand-800/40 to-brand-600/20"
        >
          <view class="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-brand-300" />
          <view class="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-brand-300" />
          <view class="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-brand-300" />
          <view class="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-brand-300" />

          <view v-if="!scanning && !result" class="scanline absolute inset-x-6" />

          <view v-if="scanning" class="text-center text-white">
            <Icon name="refresh" :size="32" color="white" />
            <view class="mt-3 text-sm text-white/80">正在识别点位…</view>
          </view>
          <view v-else-if="!result" class="text-center text-white/70">
            <Icon name="camera" :size="40" color="white" :opacity="0.7" />
            <view class="mt-3 text-sm">对准景区点位二维码</view>
          </view>
        </view>

        <view v-if="!result && !scanning" class="btn-primary mt-8 w-full py-4" @click="realScan">扫码打卡</view>
        <view v-if="!result && !scanning" class="btn-primary mt-3 w-full py-4" @click="simulateScan">模拟扫码</view>
        <view v-if="!result && !scanning" class="btn-ghost mt-3 w-full !border-white/20 !bg-white/5 !text-white" @click="showInput = true">
          手动输入点位码
        </view>

        <view v-if="routeId" class="mt-6 text-xs text-white/50">目标点位：{{ title }}</view>
      </view>
    </view>

    <!-- 打卡成功动画层 -->
    <view v-if="result" class="absolute inset-0 z-20 flex items-center justify-center bg-ink/80 p-8">
      <view class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center">
        <view class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
          <Icon name="check" :size="34" color="forest" />
        </view>
        <view class="mt-4 text-xs uppercase tracking-[.2em] text-brand-500">打卡成功</view>
        <view class="mt-2 text-xl font-bold text-ink">{{ result.point.name }}</view>
        <view class="mt-1 text-sm text-ink-soft">{{ result.point.desc }}</view>

        <view class="mt-4 flex items-center justify-center gap-1 text-xs text-ink-faint">
          <view class="flex items-center gap-1 rounded-full bg-paper px-3 py-1.5">
            <Icon name="sparkle" :size="14" color="brand500" />
            {{ result.route.name }}
          </view>
        </view>

        <view class="mt-5 flex gap-2">
          <view v-if="result.completed" class="btn-primary w-full" @click="finish">完成</view>
          <template v-else>
            <view class="btn-ghost flex-1" @click="finish">稍后</view>
            <view class="btn-primary flex-1" @click="claim">领取奖励</view>
          </template>
        </view>
      </view>
    </view>

    <!-- 手动输入弹层 -->
    <view v-if="showInput" class="absolute inset-0 z-20 flex items-center justify-center bg-ink/60 p-8" @click="showInput = false">
      <view class="w-full max-w-xs rounded-3xl bg-white p-6" @click.stop>
        <view class="text-base font-bold text-ink">输入点位码</view>
        <view class="mt-1 text-xs text-ink-faint">例如 XLS-001（见景区点位立牌）</view>
        <input
          v-model="manualCode"
          type="text"
          placeholder="XLS-000"
          class="num mt-4 w-full rounded-2xl border bg-paper px-4 py-3 text-center text-lg font-bold uppercase tracking-widest outline-none"
          :class="invalid ? 'border-rose-400' : 'border-ink/10'"
          @confirm="submitCode"
        />
        <view v-if="invalid" class="mt-2 text-center text-xs text-rose-500">点位码无效，请重试</view>
        <view class="mt-5 flex gap-2">
          <view class="btn-ghost flex-1" @click="showInput = false">取消</view>
          <view class="btn-primary flex-1" @click="submitCode">确认</view>
        </view>
      </view>
    </view>

    <AchievementModal />
    <ShareCard />
  </view>
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
</style>
