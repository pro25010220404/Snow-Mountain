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
  <article
    class="tap card overflow-hidden"
    :class="locked ? 'opacity-80' : ''"
  >
    <!-- 封面 -->
    <div
      class="relative h-24 overflow-hidden"
      :style="{
        background: locked
          ? 'linear-gradient(120deg,#D6DBD8,#C2C9C6)'
          : `linear-gradient(120deg,${route.cover.from},${route.cover.to})`,
      }"
    >
      <svg viewBox="0 0 400 120" class="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none">
        <path d="M0 120 L70 60 L130 88 L200 30 L270 84 L340 50 L400 90 L400 120 Z" fill="#ffffff" opacity="0.28" />
      </svg>
      <div class="absolute left-3 top-3 flex items-center gap-1.5">
        <span class="chip bg-white/85 text-ink backdrop-blur">
          {{ SEASON_LABEL[route.season] }}
        </span>
      </div>
      <div
        v-if="locked"
        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/30 text-white backdrop-blur"
      >
        <Icon name="lock" :size="16" />
      </div>
      <div
        v-else-if="done"
        class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white"
      >
        <Icon name="check" :size="16" />
      </div>
      <div v-else class="absolute right-3 top-3 chip bg-white/85 text-brand-700 backdrop-blur">
        {{ statusText }}
      </div>
    </div>

    <!-- 内容 -->
    <div class="p-4">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="text-base font-bold text-ink">{{ route.name }}</h3>
          <p class="mt-0.5 text-xs text-ink-faint">{{ route.subtitle }}</p>
        </div>
        <div class="flex gap-0.5 pt-1" aria-label="难度">
          <span
            v-for="n in 5"
            :key="n"
            class="h-1.5 w-1.5 rounded-full"
            :class="n <= route.difficulty ? 'bg-amber' : 'bg-ink/10'"
          />
        </div>
      </div>

      <div class="mt-3 flex items-center gap-3 text-xs text-ink-faint">
        <span class="flex items-center gap-1">
          <Icon name="clock" :size="14" />{{ route.duration }}
        </span>
        <span class="flex items-center gap-1">
          <Icon name="route" :size="14" />{{ route.distanceKm }} km
        </span>
      </div>

      <!-- 进度 -->
      <div class="mt-3">
        <div class="flex items-center justify-between text-[11px] text-ink-faint">
          <span>{{ locked ? '完成前序路线解锁' : `已打卡 ${pct}%` }}</span>
          <span v-if="!locked" class="num font-semibold text-brand-700">{{ pct }}%</span>
        </div>
        <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/8">
          <div
            class="h-full rounded-full"
            :class="done ? 'bg-forest' : 'bg-brand-500 progress-shimmer'"
            :style="{ width: pct + '%' }"
          />
        </div>
      </div>
    </div>
  </article>
</template>
