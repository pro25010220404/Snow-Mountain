<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import { SEASON_LABEL } from '@/mock/routes'
import type { ExploreRoute, RouteStatus } from '@/types'

const props = defineProps<{
  route: ExploreRoute
  status: RouteStatus
  progress: number // 0..1
}>()

const locked = computed(() => props.status === 'locked')
const done = computed(() => props.status === 'completed')

const statusText = computed(() => {
  switch (props.status) {
    case 'locked':
      return '未解锁'
    case 'available':
      return '可挑战'
    case 'in_progress':
      return '挑战中'
    case 'completed':
      return '已完成'
  }
})

const pct = computed(() => Math.round(props.progress * 100))
</script>

<template>
  <view class="tap card overflow-hidden" :class="locked ? 'opacity-80' : ''">
    <!-- 封面 -->
    <view
      class="relative h-24 overflow-hidden"
      :style="{
        background: locked
          ? 'linear-gradient(120deg,#D6DBD8,#C2C9C6)'
          : `linear-gradient(120deg,${route.cover.from},${route.cover.to})`,
      }"
    >
      <view class="absolute left-3 top-3 flex items-center gap-1.5">
        <view class="chip bg-white/85 text-ink">{{ SEASON_LABEL[route.season] }}</view>
      </view>
      <view
        v-if="locked"
        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/30"
      >
        <Icon name="lock" :size="16" color="white" />
      </view>
      <view
        v-else-if="done"
        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-forest"
      >
        <Icon name="check" :size="16" color="white" />
      </view>
      <view v-else class="absolute right-3 top-3 chip bg-white/85 text-brand-700">{{ statusText }}</view>
    </view>

    <!-- 内容 -->
    <view class="p-4">
      <view class="flex items-start justify-between gap-2">
        <view>
          <view class="text-base font-bold text-ink">{{ route.name }}</view>
          <view class="mt-0.5 text-xs text-ink-faint">{{ route.subtitle }}</view>
        </view>
        <view class="flex gap-0.5 pt-1">
          <view
            v-for="n in 5"
            :key="n"
            class="h-1.5 w-1.5 rounded-full"
            :class="n <= route.difficulty ? 'bg-amber' : 'bg-ink/10'"
          />
        </view>
      </view>

      <view class="mt-3 flex items-center gap-3 text-xs text-ink-faint">
        <view class="flex items-center gap-1">
          <Icon name="clock" :size="14" color="inkFaint" />{{ route.duration }}
        </view>
        <view class="flex items-center gap-1">
          <Icon name="route" :size="14" color="inkFaint" />{{ route.distanceKm }} km
        </view>
      </view>

      <!-- 进度 -->
      <view class="mt-3">
        <view class="flex items-center justify-between text-[11px] text-ink-faint">
          <text>{{ locked ? '完成前序路线解锁' : `已打卡 ${pct}%` }}</text>
          <text v-if="!locked" class="num font-semibold text-brand-700">{{ pct }}%</text>
        </view>
        <view class="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/8">
          <view
            class="h-full rounded-full"
            :class="done ? 'bg-forest' : 'bg-brand-500 progress-shimmer'"
            :style="{ width: pct + '%' }"
          />
        </view>
      </view>
    </view>
  </view>
</template>
