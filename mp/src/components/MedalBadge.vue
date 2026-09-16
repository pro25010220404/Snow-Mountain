<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { Medal } from '@/types'

const props = withDefaults(
  defineProps<{ medal: Medal; size?: number; locked?: boolean }>(),
  { size: 56, locked: false },
)

const HUES: Record<Medal['hue'], [string, string]> = {
  emerald: ['#5FB0A6', '#2F5D5A'],
  ice: ['#8FB6D6', '#4A6E93'],
  amber: ['#E0A355', '#B9752C'],
  rose: ['#E08475', '#B9574A'],
  violet: ['#A68AD0', '#6E4F9E'],
  cyan: ['#4FA9BD', '#2C6B7C'],
  gold: ['#E9C96B', '#C2931F'],
}

const bg = computed(() => {
  const [a, b] = HUES[props.medal.hue]
  if (props.locked) return 'linear-gradient(145deg,#E3E8E6,#C3CCC9)'
  return `linear-gradient(145deg,${a},${b})`
})
</script>

<template>
  <view
    class="relative inline-flex shrink-0 items-center justify-center rounded-full"
    :class="locked ? '' : 'shadow-md'"
    :style="{ width: size + 'px', height: size + 'px', background: bg }"
  >
    <view
      class="absolute inset-[3px] rounded-full border"
      :style="{ borderColor: locked ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.35)' }"
    />
    <Icon :name="medal.icon" :size="Math.round(size * 0.46)" color="white" :opacity="locked ? 0.7 : 1" />
  </view>
</template>
