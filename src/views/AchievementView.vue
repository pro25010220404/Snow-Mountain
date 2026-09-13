<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import MedalBadge from '@/components/MedalBadge.vue'
import { useAchievementsStore, type AchievementView as AV } from '@/stores/achievements'
import { useUserStore } from '@/stores/user'
import { useUiStore } from '@/stores/ui'
import { useCountUp } from '@/utils/useCountUp'

const achievements = useAchievementsStore()
const user = useUserStore()
const ui = useUiStore()

const pointsShown = useCountUp(() => user.current.points)

onMounted(() => achievements.markSeen())

const detail = ref<AV | null>(null)

const UNIT: Record<string, string> = {
  routes_completed: '条路线',
  total_distance: 'km',
  invite_count: '人',
  streak_weeks: '周',
  advanced_route: '',
}

function progressText(a: AV) {
  const unit = UNIT[a.metric]
  const val = Math.min(a.progress, a.target)
  return `${val} / ${a.target}${unit ? ' ' + unit : ''}`
}

function openDetail(a: AV) {
  detail.value = a
}

function share(a: AV) {
  ui.openShare({
    kind: 'achievement',
    title: a.name,
    subtitle: a.condition,
    stats: [
      { label: '进度', value: progressText(a) },
      { label: '奖励', value: a.reward },
      { label: '积分', value: `+${a.points}` },
    ],
    medal: a.medal,
  })
}
</script>

<template>
  <div class="pb-24">
    <header class="sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-5 pb-2 pt-5 backdrop-blur">
      <h1 class="text-xl font-bold text-ink">成就</h1>
      <div class="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5">
        <Icon name="star" :size="15" class="text-amber" />
        <span class="num text-sm font-semibold text-brand-700">{{ pointsShown }}</span>
        <span class="text-xs text-brand-500">积分</span>
      </div>
    </header>

    <main class="space-y-6 px-5">
      <!-- 勋章墙 -->
      <section class="card p-5">
        <div class="flex items-center justify-between">
          <h2 class="section-title">勋章墙</h2>
          <span class="num text-xs text-ink-faint">{{ achievements.unlockedCount }}/{{ achievements.view.length }} 已点亮</span>
        </div>
        <div class="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
          <button
            v-for="a in achievements.view"
            :key="a.id"
            class="flex flex-col items-center gap-1.5"
            @click="a.unlocked ? openDetail(a) : ui.toast(a.condition, 'info')"
          >
            <MedalBadge :medal="a.medal" :size="58" :locked="!a.unlocked" />
            <span class="w-full truncate text-center text-[11px]" :class="a.unlocked ? 'text-ink' : 'text-ink-faint/70'">
              {{ a.name }}
            </span>
          </button>
        </div>
      </section>

      <!-- 成就分组列表 -->
      <section v-for="g in achievements.grouped" :key="g.type" class="card overflow-hidden">
        <div class="flex items-center justify-between px-5 pt-5">
          <h2 class="section-title">{{ g.label }}</h2>
          <span class="num text-xs text-ink-faint">{{ g.items.filter((i) => i.unlocked).length }}/{{ g.items.length }}</span>
        </div>
        <ul class="mt-2 pb-2">
          <li
            v-for="a in g.items"
            :key="a.id"
            class="tap flex items-center gap-3 border-b border-ink/5 px-5 py-3.5 last:border-0"
            @click="openDetail(a)"
          >
            <MedalBadge :medal="a.medal" :size="40" :locked="!a.unlocked" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold" :class="a.unlocked ? 'text-ink' : 'text-ink-soft'">{{ a.name }}</span>
                <span v-if="a.unlocked" class="chip bg-forest/10 text-forest">已达成</span>
              </div>
              <p class="mt-0.5 truncate text-xs text-ink-faint">{{ a.condition }}</p>
              <div class="mt-2 flex items-center gap-2">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
                  <div
                    class="h-full rounded-full"
                    :class="a.unlocked ? 'bg-forest' : 'bg-brand-500'"
                    :style="{ width: Math.min(100, (a.progress / a.target) * 100) + '%' }"
                  />
                </div>
                <span class="num shrink-0 text-[11px] text-ink-faint">{{ progressText(a) }}</span>
              </div>
            </div>
            <Icon name="chevron-right" :size="18" class="shrink-0 text-ink-faint" />
          </li>
        </ul>
      </section>
    </main>

    <!-- 成就详情弹层 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detail" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-8 backdrop-blur-sm" @click.self="detail = null">
          <div class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift">
            <button class="absolute right-4 top-4 text-ink-faint" @click="detail = null">
              <Icon name="close" :size="20" />
            </button>
            <p class="text-xs font-semibold uppercase tracking-[.2em] text-brand-500">{{ detail.type }}</p>
            <div class="mt-4 flex justify-center">
              <MedalBadge :medal="detail.medal" :size="80" :locked="!detail.unlocked" />
            </div>
            <h2 class="mt-4 text-xl font-bold text-ink">{{ detail.name }}</h2>
            <p class="mt-2 text-sm text-ink-soft">{{ detail.condition }}</p>

            <div class="mt-4 rounded-2xl bg-paper p-4 text-left">
              <div class="flex items-center justify-between text-xs">
                <span class="text-ink-faint">当前进度</span>
                <span class="num font-semibold text-brand-700">{{ progressText(detail) }}</span>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                <div
                  class="h-full rounded-full"
                  :class="detail.unlocked ? 'bg-forest' : 'bg-brand-500'"
                  :style="{ width: Math.min(100, (detail.progress / detail.target) * 100) + '%' }"
                />
              </div>
              <div class="mt-3 flex items-center justify-between text-xs">
                <span class="text-ink-faint">奖励</span>
                <span class="font-semibold text-ink">{{ detail.reward }}</span>
              </div>
              <div v-if="detail.unlocked && detail.unlockedAt" class="mt-1 flex items-center justify-between text-xs">
                <span class="text-ink-faint">达成时间</span>
                <span class="text-ink">{{ detail.unlockedAt }}</span>
              </div>
            </div>

            <div class="mt-5 flex gap-2">
              <button class="btn-ghost flex-1" @click="detail = null">关闭</button>
              <button class="btn-primary flex-1" :disabled="!detail.unlocked" @click="share(detail)">
                <Icon name="share" :size="16" />
                炫耀一下
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <TabBar />
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
