<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Icon from '@/components/Icon.vue'
import ShareCard from '@/components/ShareCard.vue'
import { back } from '@/utils/nav'
import { useRecordsStore } from '@/stores/records'
import { useUiStore } from '@/stores/ui'

const records = useRecordsStore()
const ui = useUiStore()

const id = ref('')
onLoad((q) => {
  if (q && q.id) id.value = q.id as string
})

const rec = computed(() => records.records.find((r) => r.id === id.value))

const trackDots = computed(() => {
  const r = rec.value
  if (!r) return []
  return r.track.map((p) => ({ x: p.x, y: p.y }))
})

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
  <view v-if="rec" class="pb-10">
    <!-- 顶栏 -->
    <view class="safe-top sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-4 py-3">
      <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card" @click="back()">
        <Icon name="arrow-left" :size="20" color="ink" />
      </view>
      <view class="text-base font-bold text-ink">运动记录</view>
      <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card" @click="share">
        <Icon name="share" :size="18" color="brand600" />
      </view>
    </view>

    <!-- 轨迹地图（CSS 点阵近似） -->
    <view class="mx-4 mt-2 overflow-hidden rounded-3xl bg-white p-3 shadow-card">
      <view class="relative w-full" style="height: 200px; background: linear-gradient(0deg, rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px); background-size: 20% 25%">
        <view
          v-for="(p, i) in trackDots"
          :key="i"
          class="absolute rounded-full"
          style="width: 3px; height: 3px; background: #4A8B84"
          :style="{ left: p.x + '%', top: (p.y / 64) * 100 + '%' }"
        />
        <view v-if="startPt" class="absolute flex items-center justify-center rounded-full" style="width: 8px; height: 8px; background: #3E7C59; border: 1px solid #fff" :style="{ left: startPt.x + '%', top: (startPt.y / 64) * 100 + '%' }" />
        <view v-if="endPt" class="absolute flex items-center justify-center rounded-full" style="width: 8px; height: 8px; background: #2F5D5A; border: 1px solid #fff" :style="{ left: endPt.x + '%', top: (endPt.y / 64) * 100 + '%' }" />
        <view
          v-for="d in passedDots"
          :key="d.name"
          class="absolute flex items-center justify-center rounded-full"
          style="width: 8px; height: 8px; border: 1px solid #fff"
          :style="{ left: d.pt.x + '%', top: (d.pt.y / 64) * 100 + '%', background: d.checked ? '#3E7C59' : '#fff', borderColor: d.checked ? '#3E7C59' : '#D98A3D' }"
        />
      </view>
      <view class="mt-2 flex items-center gap-4 px-1 text-[11px] text-ink-faint">
        <view class="flex items-center gap-1"><view class="h-2 w-2 rounded-full bg-forest" />起点</view>
        <view class="flex items-center gap-1"><view class="h-2 w-2 rounded-full bg-brand-600" />终点</view>
        <view class="flex items-center gap-1"><view class="h-2 w-2 rounded-full border border-amber" />途经点</view>
      </view>
    </view>

    <!-- 数据概览 -->
    <view class="mx-4 mt-4 grid grid-cols-4 rounded-2xl bg-white py-4 shadow-card">
      <view class="text-center">
        <view class="num text-lg font-bold text-ink">{{ rec.steps.toLocaleString() }}</view>
        <view class="mt-0.5 text-[11px] text-ink-faint">步数</view>
      </view>
      <view class="text-center">
        <view class="num text-lg font-bold text-ink">{{ rec.distanceKm }}</view>
        <view class="mt-0.5 text-[11px] text-ink-faint">里程 km</view>
      </view>
      <view class="text-center">
        <view class="num text-lg font-bold text-ink">{{ Math.floor(rec.durationMin / 60) }}h{{ rec.durationMin % 60 }}m</view>
        <view class="mt-0.5 text-[11px] text-ink-faint">时长</view>
      </view>
      <view class="text-center">
        <view class="num text-lg font-bold text-ink">{{ rec.date.slice(5).replace('-', '/') }}</view>
        <view class="mt-0.5 text-[11px] text-ink-faint">日期</view>
      </view>
    </view>

    <!-- 途经打卡点 -->
    <view v-if="rec.passedPoints.length" class="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-card">
      <view class="section-title">途经打卡点</view>
      <view class="mt-3 flex flex-col gap-3">
        <view v-for="p in rec.passedPoints" :key="p.name" class="flex items-center gap-3">
          <view class="flex h-6 w-6 items-center justify-center rounded-full" :class="p.checked ? 'bg-forest text-white' : 'bg-ink/8 text-ink-faint'">
            <Icon v-if="p.checked" name="check" :size="14" color="white" />
            <Icon v-else name="pin" :size="13" color="inkFaint" />
          </view>
          <text class="text-sm" :class="p.checked ? 'text-ink' : 'text-ink-faint'">{{ p.name }}</text>
        </view>
      </view>
    </view>

    <view class="mt-6 px-4 text-center text-[11px] text-ink-faint">轨迹已做 GPS 漂移修正与抽稀处理</view>

    <ShareCard />
  </view>
</template>
