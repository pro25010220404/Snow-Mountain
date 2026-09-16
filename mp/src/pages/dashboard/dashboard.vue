<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import { back } from '@/utils/nav'
import { STEP_TREND, SLEEP_RECORDS } from '@/mock/wellness'
import { useCountUp } from '@/utils/useCountUp'

const totalSteps = computed(() => STEP_TREND.reduce((s, d) => s + d.steps, 0))
const totalKm = computed(() => STEP_TREND.reduce((s, d) => s + d.km, 0))
const activeDays = computed(() => STEP_TREND.filter((d) => d.steps >= 6000).length)

const stepsShown = useCountUp(() => totalSteps.value)
const kmShown = useCountUp(() => totalKm.value, { decimals: 1 })

const maxSteps = Math.max(...STEP_TREND.map((d) => d.steps))
const maxKm = Math.max(...STEP_TREND.map((d) => d.km))

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
  <view class="min-h-screen pb-10">
    <view class="safe-top sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3">
      <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card" @click="back()">
        <Icon name="arrow-left" :size="20" color="ink" />
      </view>
      <view class="text-base font-bold text-ink">我的数据</view>
    </view>

    <view class="flex flex-col gap-4 px-5 pt-2">
      <!-- 汇总 -->
      <view class="grid grid-cols-3 gap-3">
        <view class="card p-4 text-center">
          <view class="num text-xl font-bold text-brand-700">{{ stepsShown.toLocaleString() }}</view>
          <view class="mt-0.5 text-[11px] text-ink-faint">本周步数</view>
        </view>
        <view class="card p-4 text-center">
          <view class="num text-xl font-bold text-brand-700">{{ kmShown }}</view>
          <view class="mt-0.5 text-[11px] text-ink-faint">里程 km</view>
        </view>
        <view class="card p-4 text-center">
          <view class="num text-xl font-bold text-brand-700">{{ activeDays }}</view>
          <view class="mt-0.5 text-[11px] text-ink-faint">活跃天数</view>
        </view>
      </view>

      <!-- 步数趋势（CSS 柱状） -->
      <view class="card p-5">
        <view class="flex items-center justify-between">
          <view class="section-title">步数趋势</view>
          <view class="text-xs text-ink-faint">近 7 天</view>
        </view>
        <view class="mt-4 flex items-end justify-between gap-1.5" style="height: 110px">
          <view v-for="d in STEP_TREND" :key="d.date" class="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <text class="num text-[9px] text-ink-faint">{{ d.steps >= 6000 ? (d.steps / 1000).toFixed(1) + 'k' : '' }}</text>
            <view class="w-full rounded-t bg-brand-400" :style="{ height: Math.round((d.steps / maxSteps) * 80) + 'px' }" />
            <text class="text-[9px] text-ink-faint">{{ d.date.slice(3) }}</text>
          </view>
        </view>
      </view>

      <!-- 里程柱状 -->
      <view class="card p-5">
        <view class="flex items-center justify-between">
          <view class="section-title">里程统计</view>
          <view class="text-xs text-ink-faint">单位 km</view>
        </view>
        <view class="mt-4 flex items-end justify-between gap-1.5" style="height: 110px">
          <view v-for="d in STEP_TREND" :key="d.date" class="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <view class="w-full rounded-t bg-brand-200" :style="{ height: Math.round((d.km / maxKm) * 80) + 'px' }" />
            <text class="text-[9px] text-ink-faint">{{ d.date.slice(3) }}</text>
          </view>
        </view>
      </view>

      <!-- 睡眠记录 -->
      <view class="card p-5">
        <view class="flex items-center justify-between">
          <view class="section-title">睡眠记录</view>
          <view class="text-xs text-ink-faint">平均 {{ sleepAvg }}h</view>
        </view>
        <view class="mt-3 flex flex-col gap-2.5">
          <view v-for="r in SLEEP_RECORDS" :key="r.date" class="flex items-center gap-3">
            <text class="num w-9 shrink-0 text-xs text-ink-faint">{{ r.date.slice(3) }}</text>
            <view class="relative h-2.5 flex-1 overflow-hidden rounded-full bg-ink/8">
              <view class="h-full rounded-full bg-brand-400" :style="{ width: (r.hours / 9) * 100 + '%' }" />
            </view>
            <text class="num w-8 shrink-0 text-xs font-medium text-ink">{{ r.hours }}h</text>
            <view class="chip shrink-0" :class="QUALITY_CLS[r.quality]">{{ r.quality }}</view>
          </view>
        </view>
      </view>

      <view class="pt-1 text-center text-[11px] text-ink-faint">睡眠数据为健康生活方式示意，敏感数据默认关闭</view>
    </view>
  </view>
</template>
