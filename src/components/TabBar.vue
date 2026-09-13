<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Icon from './Icon.vue'
import { useAchievementsStore } from '@/stores/achievements'

const route = useRoute()
const router = useRouter()
const achievements = useAchievementsStore()

const tabs = [
  { path: '/explore', label: '探索', icon: 'compass' },
  { path: '/checkin', label: '打卡', icon: 'footprints' },
  { path: '/achievement', label: '成就', icon: 'medal' },
  { path: '/profile', label: '我的', icon: 'user' },
]

function go(path: string) {
  if (route.path === path) return
  router.push(path)
}
</script>

<template>
  <nav
    class="safe-bottom fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-ink/5 bg-white/90 backdrop-blur-lg"
  >
    <div class="grid grid-cols-4">
      <button
        v-for="t in tabs"
        :key="t.path"
        class="group flex flex-col items-center gap-0.5 py-2.5 transition active:scale-95"
        @click="go(t.path)"
      >
        <span class="relative">
          <span :class="route.path.startsWith(t.path) ? 'animate-tab-pop' : ''" class="flex">
            <Icon
              :name="t.icon"
              :size="24"
              :stroke="route.path.startsWith(t.path) ? 2 : 1.7"
              :class="route.path.startsWith(t.path) ? 'text-brand-600' : 'text-ink-faint'"
            />
          </span>
          <span
            v-if="t.path === '/achievement' && achievements.hasNew"
            class="absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
          />
        </span>
        <span
          class="text-[11px]"
          :class="route.path.startsWith(t.path) ? 'font-semibold text-brand-700' : 'text-ink-faint'"
        >
          {{ t.label }}
        </span>
      </button>
    </div>
  </nav>
</template>
