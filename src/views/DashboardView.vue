<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { STEP_TREND, SLEEP_RECORDS } from '@/mock/wellness'
import { useCountUp } from '@/utils/useCountUp'

const router = useRouter()

// —— 汇总 ——
const totalSteps = computed(() => STEP_TREND.reduce((s, d) => s + d.steps, 0))
const totalKm = computed(() => STEP_TREND.reduce((s, d) => s + d.km, 0))
const activeDays = computed(() => STEP_TREND.filter((d) => d.steps >= 6000).length)

const stepsShown = useCountUp(() => totalSteps.value)
const kmShown = useCountUp(() => totalKm.value, { decimals: 1 })

// —— 折线图坐标（步数趋势）——
const W = 320
const H = 140
const PAD = 14

const linePts = computed(() => {
  const max = Math.max(...STEP_TREND.map((d) => d.steps))
  const min = Math.min(...STEP_TREND.map((d) => d.steps))
  const range = max - min || 1
  return STEP_TREND.map((d, i) => {
    const x = PAD + (i * (W - PAD * 2)) / (STEP_TREND.length - 1)
    const y = H - PAD - ((d.steps - min) / range) * (H - PAD * 2 - 8)
    return { x: +x.toFixed(1), y: +y.toFixed(1), ...d }
  })
})

const polyline = computed(() => linePts.value.map((p) => `${p.x},${p.y}`).join(' '))
const area = computed(() => `${PAD},${H - PAD} ${polyline.value} ${W - PAD},${H - PAD}`)

// —— 柱状图（里程）——
const bars = computed(() => {
  const max = Math.max(...STEP_TREND.map((d) => d.km))
  return STEP_TREND.map((d, i) => ({
    ...d,
    h: Math.round((d.km / max) * 90),
    x: 24 + i * 40,
  }))
})

const sleepAvg = computed(() => {
  const avg = SLEEP_RECORDS.reduce((s, r) => s + r.hours, 0) / SLEEP_RECORDS.length
  return avg.toFixed(1)
})

const QUALITY_CLS: Record<string, string> = {
  好: 'bg-forest/10 text-forest',
  中: 'bg-brand-50 text-brand-600',
  一般: 'bg-amber/10 text-amber',
}
</script>

<template>
  <div class="min-h-screen pb-10">
    <header class="sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3 backdrop-blur">
      <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card" @click="router.back()">
        <Icon name="arrow-left" :size="20" />
      </button>
      <h1 class="text-base font-bold text-ink">我的数据</h1>
    </header>

    <main class="space-y-4 px-5 pt-2">
      <!-- 汇总 -->
      <section class="grid grid-cols-3 gap-3">
        <div class="card p-4 text-center">
          <div class="num text-xl font-bold text-brand-700">{{ stepsShown.toLocaleString() }}</div>
          <p class="mt-0.5 text-[11px] text-ink-faint">本周步数</p>
        </div>
        <div class="card p-4 text-center">
          <div class="num text-xl font-bold text-brand-700">{{ kmShown }}</div>
          <p class="mt-0.5 text-[11px] text-ink-faint">里程 km</p>
        </div>
        <div class="card p-4 text-center">
          <div class="num text-xl font-bold text-brand-700">{{ activeDays }}</div>
          <p class="mt-0.5 text-[11px] text-ink-faint">活跃天数</p>
        </div>
      </section>

      <!-- 步数趋势 -->
      <section class="card p-5">
        <div class="flex items-center justify-between">
          <h2 class="section-title">步数趋势</h2>
          <span class="text-xs text-ink-faint">近 7 天</span>
        </div>
        <svg :viewBox="`0 0 ${W} ${H}`" class="mt-3 w-full">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#4A8B84" stop-opacity="0.18" />
              <stop offset="100%" stop-color="#4A8B84" stop-opacity="0" />
            </linearGradient>
          </defs>
          <line v-for="i in 4" :key="i" :x1="PAD" :y1="(i * (H - PAD * 2)) / 4 + PAD" :x2="W - PAD" :y2="(i * (H - PAD * 2)) / 4 + PAD" stroke="#00000008" />
          <polygon :points="area" fill="url(#areaFill)" />
          <polyline
            :points="polyline"
            fill="none"
            stroke="#4A8B84"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="chart-line"
          />
          <circle v-for="p in linePts" :key="p.date" :cx="p.x" :cy="p.y" r="2.6" fill="#fff" stroke="#4A8B84" stroke-width="1.6" />
          <text v-for="(p, i) in linePts" :key="'t' + p.date" :x="p.x" :y="H - 2" text-anchor="middle" font-size="8" fill="#6E807E">{{ i % 2 === 0 ? p.date.slice(3) : '' }}</text>
        </svg>
      </section>

      <!-- 里程柱状 -->
      <section class="card p-5">
        <div class="flex items-center justify-between">
          <h2 class="section-title">里程统计</h2>
          <span class="text-xs text-ink-faint">单位 km</span>
        </div>
        <svg viewBox="0 0 320 130" class="mt-3 w-full">
          <line v-for="i in 4" :key="i" :x1="16" :y1="i * 25 + 10" :x2="304" :y2="i * 25 + 10" stroke="#00000008" />
          <g v-for="b in bars" :key="b.date">
            <rect :x="b.x" :y="110 - b.h" width="22" :height="b.h" rx="5" fill="#B2D0CA" class="bar" />
            <text :x="b.x + 11" :y="124" text-anchor="middle" font-size="8" fill="#6E807E">{{ b.date.slice(3) }}</text>
          </g>
        </svg>
      </section>

      <!-- 睡眠记录 -->
      <section class="card p-5">
        <div class="flex items-center justify-between">
          <h2 class="section-title">睡眠记录</h2>
          <span class="text-xs text-ink-faint">平均 {{ sleepAvg }}h</span>
        </div>
        <ul class="mt-3 space-y-2.5">
          <li v-for="r in SLEEP_RECORDS" :key="r.date" class="flex items-center gap-3">
            <span class="num w-9 shrink-0 text-xs text-ink-faint">{{ r.date.slice(3) }}</span>
            <div class="relative h-2.5 flex-1 overflow-hidden rounded-full bg-ink/8">
              <div class="h-full rounded-full bg-brand-400" :style="{ width: (r.hours / 9) * 100 + '%' }" />
            </div>
            <span class="num w-8 shrink-0 text-xs font-medium text-ink">{{ r.hours }}h</span>
            <span class="chip shrink-0" :class="QUALITY_CLS[r.quality]">{{ r.quality }}</span>
          </li>
        </ul>
      </section>

      <p class="pt-1 text-center text-[11px] text-ink-faint">睡眠数据为健康生活方式示意，敏感数据默认关闭</p>
    </main>
  </div>
</template>

<style scoped>
.chart-line {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: draw-line 1s ease-out forwards;
}
@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}
.bar {
  transform-origin: bottom;
  animation: grow-bar 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) both;
}
@keyframes grow-bar {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
