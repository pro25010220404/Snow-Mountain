<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import MedalBadge from '@/components/MedalBadge.vue'
import AchievementModal from '@/components/AchievementModal.vue'
import ShareCard from '@/components/ShareCard.vue'
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
  <view class="pb-24">
    <view class="safe-top sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-5 pb-2">
      <view class="text-xl font-bold text-ink">成就</view>
      <view class="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5">
        <Icon name="star" :size="15" color="amber" />
        <text class="num text-sm font-semibold text-brand-700">{{ pointsShown }}</text>
        <text class="text-xs text-brand-500">积分</text>
      </view>
    </view>

    <view class="flex flex-col gap-6 px-5">
      <!-- 勋章墙 -->
      <view class="card p-5">
        <view class="flex items-center justify-between">
          <view class="section-title">勋章墙</view>
          <view class="num text-xs text-ink-faint">{{ achievements.unlockedCount }}/{{ achievements.view.length }} 已点亮</view>
        </view>
        <view class="mt-4 grid grid-cols-4 gap-x-3 gap-y-4">
          <view
            v-for="a in achievements.view"
            :key="a.id"
            class="flex flex-col items-center gap-1.5"
            @click="a.unlocked ? openDetail(a) : ui.toast(a.condition, 'info')"
          >
            <MedalBadge :medal="a.medal" :size="58" :locked="!a.unlocked" />
            <text class="w-full truncate text-center text-[11px]" :class="a.unlocked ? 'text-ink' : 'text-ink-faint/70'">
              {{ a.name }}
            </text>
          </view>
        </view>
      </view>

      <!-- 成就分组列表 -->
      <view v-for="g in achievements.grouped" :key="g.type" class="card overflow-hidden">
        <view class="flex items-center justify-between px-5 pt-5">
          <view class="section-title">{{ g.label }}</view>
          <view class="num text-xs text-ink-faint">{{ g.items.filter((i) => i.unlocked).length }}/{{ g.items.length }}</view>
        </view>
        <view class="mt-2 pb-2">
          <view
            v-for="a in g.items"
            :key="a.id"
            class="tap flex items-center gap-3 border-b border-ink/5 px-5 py-3.5 last:border-0"
            @click="openDetail(a)"
          >
            <MedalBadge :medal="a.medal" :size="40" :locked="!a.unlocked" />
            <view class="min-w-0 flex-1">
              <view class="flex items-center gap-2">
                <text class="text-sm font-semibold" :class="a.unlocked ? 'text-ink' : 'text-ink-soft'">{{ a.name }}</text>
                <view v-if="a.unlocked" class="chip bg-forest/10 text-forest">已达成</view>
              </view>
              <view class="mt-0.5 truncate text-xs text-ink-faint">{{ a.condition }}</view>
              <view class="mt-2 flex items-center gap-2">
                <view class="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
                  <view
                    class="h-full rounded-full"
                    :class="a.unlocked ? 'bg-forest' : 'bg-brand-500'"
                    :style="{ width: Math.min(100, (a.progress / a.target) * 100) + '%' }"
                  />
                </view>
                <text class="num shrink-0 text-[11px] text-ink-faint">{{ progressText(a) }}</text>
              </view>
            </view>
            <Icon name="chevron-right" :size="18" color="inkFaint" />
          </view>
        </view>
      </view>
    </view>

    <!-- 成就详情弹层 -->
    <view v-if="detail" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-8" @click="detail = null">
      <view class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift" @click.stop>
        <view class="absolute right-4 top-4" @click="detail = null">
          <Icon name="close" :size="20" color="inkFaint" />
        </view>
        <view class="text-xs font-semibold uppercase tracking-[.2em] text-brand-500">{{ detail.type }}</view>
        <view class="mt-4 flex justify-center">
          <MedalBadge :medal="detail.medal" :size="80" :locked="!detail.unlocked" />
        </view>
        <view class="mt-4 text-xl font-bold text-ink">{{ detail.name }}</view>
        <view class="mt-2 text-sm text-ink-soft">{{ detail.condition }}</view>

        <view class="mt-4 rounded-2xl bg-paper p-4 text-left">
          <view class="flex items-center justify-between text-xs">
            <text class="text-ink-faint">当前进度</text>
            <text class="num font-semibold text-brand-700">{{ progressText(detail) }}</text>
          </view>
          <view class="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
            <view
              class="h-full rounded-full"
              :class="detail.unlocked ? 'bg-forest' : 'bg-brand-500'"
              :style="{ width: Math.min(100, (detail.progress / detail.target) * 100) + '%' }"
            />
          </view>
          <view class="mt-3 flex items-center justify-between text-xs">
            <text class="text-ink-faint">奖励</text>
            <text class="font-semibold text-ink">{{ detail.reward }}</text>
          </view>
          <view v-if="detail.unlocked && detail.unlockedAt" class="mt-1 flex items-center justify-between text-xs">
            <text class="text-ink-faint">达成时间</text>
            <text class="text-ink">{{ detail.unlockedAt }}</text>
          </view>
        </view>

        <view class="mt-5 flex gap-2">
          <view class="btn-ghost flex-1" @click="detail = null">关闭</view>
          <view class="btn-primary flex-1" :disabled="!detail.unlocked" @click="share(detail)">
            <Icon name="share" :size="16" color="white" />
            炫耀一下
          </view>
        </view>
      </view>
    </view>

    <TabBar current="achievement" />
    <AchievementModal />
    <ShareCard />
  </view>
</template>
