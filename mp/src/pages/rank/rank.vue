<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { back } from '@/utils/nav'
import { WEEK_RANK, MONTH_RANK, TOTAL_RANK } from '@/mock/leaderboard'
import { useUserStore } from '@/stores/user'
import { useAchievementsStore } from '@/stores/achievements'
import { useUiStore } from '@/stores/ui'
import type { LeaderboardEntry } from '@/types'

const user = useUserStore()
const achievements = useAchievementsStore()
const ui = useUiStore()

const period = ref<'week' | 'month' | 'total'>('week')

const PERIODS = [
  { key: 'week', label: '周榜' },
  { key: 'month', label: '月榜' },
  { key: 'total', label: '总榜' },
] as const

const list = computed<LeaderboardEntry[]>(() => {
  if (period.value === 'month') return MONTH_RANK
  if (period.value === 'total') return TOTAL_RANK
  return WEEK_RANK
})

const myRank = computed(() => list.value.findIndex((e) => e.isMe))

function rankStyle(i: number) {
  if (i === 0) return 'bg-gradient-to-br from-[#E9C96B] to-[#C2931F] text-white'
  if (i === 1) return 'bg-gradient-to-br from-[#C8CDD2] to-[#9AA3AB] text-white'
  if (i === 2) return 'bg-gradient-to-br from-[#DBA97C] to-[#B37A4C] text-white'
  return 'bg-paper text-ink-faint'
}

const showPk = ref(false)
const pkMetric = ref<'steps' | 'km'>('steps')
const pkOpponent = ref<LeaderboardEntry | null>(null)
const pkResult = ref<{ win: boolean; mine: number; theirs: number } | null>(null)

function openPk() {
  showPk.value = true
  pkResult.value = null
  pkOpponent.value = null
}

function startPk() {
  if (!pkOpponent.value) {
    ui.toast('请选择一位对手', 'warn')
    return
  }
  const base = pkMetric.value === 'km' ? 6.2 : 12400
  const mine = Math.round(base * (0.9 + Math.random() * 0.3))
  const theirs = Math.round((pkOpponent.value.value * (pkMetric.value === 'km' ? 1000 : 100)) * (0.85 + Math.random() * 0.35))
  pkResult.value = { win: mine >= theirs, mine, theirs }
  showPk.value = false
}

function invite() {
  const n = user.invite()
  achievements.evaluate(false)
  ui.toast(`已邀请第 ${n} 位好友，好友将加入你的战队`, 'success')
}
</script>

<template>
  <view class="min-h-screen pb-10">
    <view class="safe-top sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3">
      <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card" @click="back()">
        <Icon name="arrow-left" :size="20" color="ink" />
      </view>
      <view class="text-base font-bold text-ink">排行榜</view>
    </view>

    <view class="flex flex-col gap-5 px-5 pt-2">
      <!-- 榜单切换 -->
      <view class="grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5 shadow-card">
        <view
          v-for="p in PERIODS"
          :key="p.key"
          class="rounded-xl py-2 text-sm font-medium"
          :class="period === p.key ? 'bg-brand-600 text-white shadow-glow' : 'text-ink-soft'"
          @click="period = p.key"
        >
          {{ p.label }}
        </view>
      </view>

      <!-- 榜单 -->
      <view class="card overflow-hidden">
        <view>
          <view
            v-for="(e, i) in list"
            :key="e.id"
            class="flex items-center gap-3 border-b border-ink/5 px-4 py-3.5 last:border-0"
            :class="e.isMe ? 'bg-brand-50/70' : ''"
          >
            <view
              class="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              :class="rankStyle(i)"
            >
              {{ i + 1 }}
            </view>
            <view
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              :style="{ background: e.avatar }"
            >
              {{ e.nickname.slice(0, 1) }}
            </view>
            <view class="flex-1">
              <text class="text-sm font-medium text-ink">{{ e.nickname }}</text>
              <text v-if="e.isMe" class="ml-2 chip bg-brand-600 text-white">我</text>
            </view>
            <view class="num text-sm font-semibold text-ink">{{ e.value.toFixed(1) }}<text class="ml-0.5 text-xs font-normal text-ink-faint">km</text></view>
          </view>
        </view>
      </view>

      <!-- 我的排名提示 -->
      <view class="flex items-center justify-between rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-glow">
        <text class="text-sm">我的排名</text>
        <text class="num text-2xl font-bold">#{{ myRank + 1 }}</text>
      </view>

      <!-- 入口 -->
      <view class="grid grid-cols-2 gap-3">
        <view class="tap card flex flex-col items-center gap-2 py-5" @click="openPk">
          <Icon name="fire" :size="24" color="rose500" />
          <text class="text-sm font-medium text-ink">发起好友 PK</text>
          <text class="text-[11px] text-ink-faint">步数 / 里程对决</text>
        </view>
        <view class="tap card flex flex-col items-center gap-2 py-5" @click="invite">
          <Icon name="friends" :size="24" color="brand600" />
          <text class="text-sm font-medium text-ink">邀请好友</text>
          <text class="text-[11px] text-ink-faint">已邀 {{ user.inviteCount }} 位</text>
        </view>
      </view>
    </view>

    <!-- 发起 PK 弹层 -->
    <view v-if="showPk" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60" @click="showPk = false">
      <view class="safe-bottom w-full rounded-t-3xl bg-white p-6" @click.stop>
        <view class="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/10" />
        <view class="text-base font-bold text-ink">发起好友 PK</view>

        <view class="mt-4 text-sm font-semibold text-ink">对战指标</view>
        <view class="mt-2 grid grid-cols-2 gap-2">
          <view
            class="rounded-xl border py-2.5 text-sm"
            :class="pkMetric === 'steps' ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="pkMetric = 'steps'"
          >步数</view>
          <view
            class="rounded-xl border py-2.5 text-sm"
            :class="pkMetric === 'km' ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="pkMetric = 'km'"
          >里程</view>
        </view>

        <view class="mt-4 text-sm font-semibold text-ink">选择对手</view>
        <scroll-view scroll-y class="mt-2" style="max-height: 208px">
          <view class="flex flex-col gap-2">
            <view
              v-for="e in list.filter((x) => !x.isMe)"
              :key="e.id"
              class="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5"
              :class="pkOpponent?.id === e.id ? 'border-brand-500 bg-brand-50' : 'border-ink/10'"
              @click="pkOpponent = e"
            >
              <view class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" :style="{ background: e.avatar }">{{ e.nickname.slice(0, 1) }}</view>
              <text class="text-sm text-ink">{{ e.nickname }}</text>
              <text class="ml-auto num text-xs text-ink-faint">{{ e.value.toFixed(1) }} km</text>
            </view>
          </view>
        </scroll-view>

        <view class="btn-primary mt-5 w-full" @click="startPk">发起挑战</view>
      </view>
    </view>

    <!-- PK 结果 -->
    <view v-if="pkResult" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-8" @click="pkResult = null">
      <view class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift" @click.stop>
        <view class="text-xs uppercase tracking-[.2em] text-brand-500">PK 结果</view>
        <view class="mt-4 flex items-center justify-center gap-4">
          <view>
            <view class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">我</view>
            <view class="num mt-2 text-sm font-bold text-ink">{{ pkResult.mine.toLocaleString() }}</view>
          </view>
          <view class="num text-2xl font-bold text-ink-faint">VS</view>
          <view>
            <view class="flex h-14 w-14 items-center justify-center rounded-full bg-ink/15 text-lg font-bold text-ink-soft">{{ pkOpponent?.nickname.slice(0, 1) }}</view>
            <view class="num mt-2 text-sm font-bold text-ink">{{ pkResult.theirs.toLocaleString() }}</view>
          </view>
        </view>
        <view class="mt-4 flex items-center justify-center gap-2">
          <Icon :name="pkResult.win ? 'trophy' : 'refresh'" :size="20" :color="pkResult.win ? 'forest' : 'rose500'" />
          <text class="text-lg font-bold" :class="pkResult.win ? 'text-forest' : 'text-rose-500'">
            {{ pkResult.win ? '挑战成功' : '惜败，下次再战' }}
          </text>
        </view>
        <view class="btn-primary mt-5 w-full" @click="pkResult = null">完成</view>
      </view>
    </view>
  </view>
</template>
