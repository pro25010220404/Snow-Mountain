<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useRecordsStore } from '@/stores/records'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const router = useRouter()
const records = useRecordsStore()
const ui = useUiStore()

const id = route.params.id as string
const rec = computed(() => records.records.find((r) => r.id === id))

const startPt = computed(() => rec.value?.track[0])
const endPt = computed(() => rec.value?.track[rec.value!.track.length - 1])

const passedDots = computed(() => {
  const r = rec.value
  if (!r || !r.passedPoints.length) return []
  const n = r.track.length
  return r.passedPoints.map((p, i) => {
    const t = (i + 1) / (r.passedPoints.length + 1)
    return { ...p, pt: r.track[Math.min(n - 1, Math.round(t * (n - 1)))] }
  })
})

function share() {
  const r = rec.value
  if (!r) return
  ui.openShare({
    kind: 'record',
    title: `我在西岭雪山走了 ${r.distanceKm} 公里`,
    subtitle: `${r.date} · ${r.steps.toLocaleString()} 步`,
    stats: [
      { label: '步数', value: r.steps.toLocaleString() },
      { label: '里程', value: `${r.distanceKm} km` },
      { label: '时长', value: `${Math.floor(r.durationMin / 60)}h${r.durationMin % 60}m` },
    ],
    medal: { icon: 'mountain', hue: 'ice' },
  })
}
</script>

<template>
  <div v-if="rec" class="pb-10">
    <!-- 顶栏 -->
    <header class="sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-4 py-3 backdrop-blur">
      <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card" @click="router.back()">
        <Icon name="arrow-left" :size="20" />
      </button>
      <h1 class="text-base font-bold text-ink">运动记录</h1>
      <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-card" @click="share">
        <Icon name="share" :size="18" />
      </button>
    </header>

    <!-- 轨迹地图 -->
    <div class="mx-4 mt-2 overflow-hidden rounded-3xl bg-white p-3 shadow-card">
      <svg viewBox="0 0 100 64" class="w-full">
        <defs>
          <linearGradient id="trackline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3E8BA0" />
            <stop offset="100%" stop-color="#2F5D5A" />
          </linearGradient>
        </defs>
        <line v-for="i in 5" :key="'v' + i" :x1="i * 20" y1="0" :x2="i * 20" y2="64" stroke="#00000010" />
        <line v-for="i in 3" :key="'h' + i" x1="0" :y1="i * 16" x2="100" :y2="i * 16" stroke="#00000010" />
        <polyline
          :points="rec.track.map((p) => `${p.x},${p.y}`).join(' ')"
          fill="none"
          stroke="url(#trackline)"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle v-if="startPt" :cx="startPt.x" :cy="startPt.y" r="3" fill="#3E7C59" stroke="#fff" stroke-width="1.5" />
        <circle v-if="endPt" :cx="endPt.x" :cy="endPt.y" r="3" fill="#2F5D5A" stroke="#fff" stroke-width="1.5" />
        <g v-for="d in passedDots" :key="d.name">
          <circle :cx="d.pt.x" :cy="d.pt.y" r="2.6" :fill="d.checked ? '#3E7C59' : '#fff'" :stroke="d.checked ? '#3E7C59' : '#D98A3D'" stroke-width="1.6" />
        </g>
      </svg>
      <div class="mt-2 flex items-center gap-4 px-1 text-[11px] text-ink-faint">
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-forest" />起点</span>
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-brand-600" />终点</span>
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full border border-amber" />途经点</span>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="mx-4 mt-4 grid grid-cols-4 divide-x divide-ink/5 rounded-2xl bg-white py-4 shadow-card">
      <div class="text-center">
        <div class="num text-lg font-bold text-ink">{{ rec.steps.toLocaleString() }}</div>
        <p class="mt-0.5 text-[11px] text-ink-faint">步数</p>
      </div>
      <div class="text-center">
        <div class="num text-lg font-bold text-ink">{{ rec.distanceKm }}</div>
        <p class="mt-0.5 text-[11px] text-ink-faint">里程 km</p>
      </div>
      <div class="text-center">
        <div class="num text-lg font-bold text-ink">{{ Math.floor(rec.durationMin / 60) }}h{{ rec.durationMin % 60 }}m</div>
        <p class="mt-0.5 text-[11px] text-ink-faint">时长</p>
      </div>
      <div class="text-center">
        <div class="num text-lg font-bold text-ink">{{ rec.date.slice(5).replace('-', '/') }}</div>
        <p class="mt-0.5 text-[11px] text-ink-faint">日期</p>
      </div>
    </div>

    <!-- 途经打卡点 -->
    <div v-if="rec.passedPoints.length" class="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-card">
      <h2 class="section-title">途经打卡点</h2>
      <ul class="mt-3 space-y-3">
        <li v-for="p in rec.passedPoints" :key="p.name" class="flex items-center gap-3">
          <span class="flex h-6 w-6 items-center justify-center rounded-full" :class="p.checked ? 'bg-forest text-white' : 'bg-ink/8 text-ink-faint'">
            <Icon v-if="p.checked" name="check" :size="14" />
            <Icon v-else name="pin" :size="13" />
          </span>
          <span class="text-sm" :class="p.checked ? 'text-ink' : 'text-ink-faint'">{{ p.name }}</span>
        </li>
      </ul>
    </div>

    <p class="mt-6 px-4 text-center text-[11px] text-ink-faint">轨迹已做 GPS 漂移修正与抽稀处理</p>
  </div>
</template>
