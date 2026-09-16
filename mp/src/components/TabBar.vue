<script setup lang="ts">
import Icon from './Icon.vue'
import { useAchievementsStore } from '@/stores/achievements'

const props = defineProps<{ current: string }>()
const achievements = useAchievementsStore()

const tabs = [
  { path: '/pages/explore/explore', key: 'explore', label: '探索', icon: 'compass' },
  { path: '/pages/checkin/checkin', key: 'checkin', label: '打卡', icon: 'footprints' },
  { path: '/pages/achievement/achievement', key: 'achievement', label: '成就', icon: 'medal' },
  { path: '/pages/profile/profile', key: 'profile', label: '我的', icon: 'user' },
]

function go(t: (typeof tabs)[number]) {
  if (t.key === props.current) return
  uni.reLaunch({ url: t.path })
}
</script>

<template>
  <view class="safe-bottom fixed bottom-0 left-0 z-40 w-full border-t border-ink/5 bg-white">
    <view class="grid grid-cols-4">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="flex flex-col items-center gap-0.5 py-2.5"
        @click="go(t)"
      >
        <view class="relative">
          <view :class="props.current === t.key ? 'animate-tab-pop' : ''" class="flex">
            <Icon
              :name="t.icon"
              :size="24"
              :color="props.current === t.key ? 'brand600' : 'inkFaint'"
            />
          </view>
          <view
            v-if="t.key === 'achievement' && achievements.hasNew"
            class="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
          />
        </view>
        <text
          class="text-[11px]"
          :class="props.current === t.key ? 'font-semibold text-brand-700' : 'text-ink-faint'"
        >
          {{ t.label }}
        </text>
      </view>
    </view>
  </view>
</template>
