<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import MedalBadge from './MedalBadge.vue'
import { useAchievementsStore } from '@/stores/achievements'
import { useUiStore } from '@/stores/ui'

const store = useAchievementsStore()
const ui = useUiStore()

const current = computed(() => store.currentModal)

const confetti = computed(() => {
  const colors = ['#5FB0A6', '#E0A355', '#8FB6D6', '#E08475', '#A68AD0', '#E9C96B']
  return Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 7.3 + 4) % 96}%`,
    top: `${18 + (i % 5) * 12}%`,
    delay: `${(i % 6) * 0.12}s`,
    color: colors[i % colors.length],
    rot: `${i * 23}deg`,
  }))
})

function share() {
  if (!current.value) return
  ui.openShare({
    kind: 'achievement',
    title: current.value.name,
    subtitle: current.value.reward,
    stats: [
      { label: '达成条件', value: current.value.condition },
      { label: '奖励', value: current.value.reward },
      { label: '积分', value: `+${current.value.points}` },
    ],
    medal: current.value.medal,
  })
}
</script>

<template>
  <view
    v-if="current"
    class="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-8"
    @click="store.dismissModal()"
  >
    <!-- 撒花粒子 -->
    <view
      v-for="(c, i) in confetti"
      :key="i"
      class="confetti"
      :style="{ left: c.left, top: c.top, background: c.color, animationDelay: c.delay, transform: `rotate(${c.rot})` }"
    />

    <view class="relative w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift" @click.stop>
      <view class="absolute right-4 top-4 text-ink-faint" @click="store.dismissModal()">
        <Icon name="close" :size="20" color="inkFaint" />
      </view>

      <view class="text-xs font-semibold uppercase tracking-[.2em] text-brand-500">解锁新成就</view>

      <view class="mt-5 flex justify-center">
        <view class="relative">
          <view class="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-200/60" />
          <MedalBadge :medal="current.medal" :size="92" />
        </view>
      </view>

      <view class="mt-5 text-2xl font-bold text-ink">{{ current.name }}</view>
      <view class="mt-2 text-sm text-ink-soft">{{ current.condition }}</view>

      <view class="mt-4 rounded-2xl bg-paper px-4 py-3">
        <view class="text-xs text-ink-faint">奖励</view>
        <view class="mt-0.5 text-sm font-semibold text-brand-700">{{ current.reward }}</view>
      </view>

      <view class="mt-5 flex gap-2">
        <view class="btn-ghost flex-1" @click="store.dismissModal()">收下</view>
        <view class="btn-primary flex-1" @click="share">
          <Icon name="share" :size="16" color="white" />
          炫耀一下
        </view>
      </view>
    </view>
  </view>
</template>
