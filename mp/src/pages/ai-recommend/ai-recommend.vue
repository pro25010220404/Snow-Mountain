<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { push, back } from '@/utils/nav'
import { ROUTES, SEASON_LABEL } from '@/mock/routes'
import { useUiStore } from '@/stores/ui'
import type { ExploreRoute } from '@/types'

const ui = useUiStore()

const strength = ref<'easy' | 'moderate' | 'challenge'>('moderate')
const time = ref<'half' | 'full'>('half')
const interests = ref<string[]>([])

const STRENGTHS = [
  { key: 'easy', label: '轻松' },
  { key: 'moderate', label: '适中' },
  { key: 'challenge', label: '挑战' },
] as const

const INTERESTS = [
  { key: 'ski', label: '滑雪', icon: 'fire' },
  { key: 'hike', label: '徒步', icon: 'walking' },
  { key: 'photo', label: '摄影', icon: 'camera' },
  { key: 'forest', label: '森林浴', icon: 'mountain' },
]

function toggleInterest(k: string) {
  interests.value = interests.value.includes(k)
    ? interests.value.filter((x) => x !== k)
    : [...interests.value, k]
}

const generating = ref(false)
const result = ref<{ route: ExploreRoute; reason: string } | null>(null)
const tried = ref<string[]>([])

const SCORE: Record<string, Record<string, number>> = {
  winter: { ski: 3, challenge: 2, full: 1 },
  spring: { hike: 3, photo: 1, moderate: 2, half: 1 },
  summer: { forest: 3, hike: 1, easy: 2, half: 1 },
  autumn: { photo: 3, hike: 1, easy: 2, half: 1 },
}

const REASONS: Record<string, string> = {
  winter: '雪道从缓到陡，一路进阶；雪地反光、视野开阔，滑起来很解压。',
  spring: '海拔爬升缓和、杜鹃成片，边走边拍，一趟下来腿也练到了。',
  summer: '山里 22℃ 出头，沿溪流走到瀑布，水雾扑面，适合慢慢走。',
  autumn: '彩林和云海同框，随手一拍都出片；专心取景的时候，脑子反而清静。',
}

function pick() {
  const scored = ROUTES.filter((r) => !tried.value.includes(r.id))
    .map((r) => {
      let s = 0
      for (const i of interests.value) s += SCORE[r.id]?.[i] ?? 0
      s += SCORE[r.id]?.[strength.value] ?? 0
      s += SCORE[r.id]?.[time.value] ?? 0
      return { r, s }
    })
    .sort((a, b) => b.s - a.s)
  if (!scored.length) {
    tried.value = []
    return null
  }
  const chosen = scored[0].r
  tried.value.push(chosen.id)
  return { route: chosen, reason: REASONS[chosen.id] }
}

function generate() {
  if (!interests.value.length) {
    ui.toast('请至少选择一个兴趣点', 'warn')
    return
  }
  generating.value = true
  result.value = null
  setTimeout(() => {
    result.value = pick() ?? null
    generating.value = false
  }, 900)
}

function adopt() {
  if (result.value) push(`/explore/route/${result.value.route.id}`)
}
</script>

<template>
  <view class="min-h-screen pb-10">
    <view class="safe-top sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3">
      <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card" @click="back()">
        <Icon name="arrow-left" :size="20" color="ink" />
      </view>
      <view class="text-base font-bold text-ink">AI 路线推荐</view>
    </view>

    <view class="flex flex-col gap-5 px-5 pt-2">
      <!-- 偏好表单 -->
      <view class="card p-5">
        <view class="text-sm font-semibold text-ink">运动强度</view>
        <view class="mt-3 grid grid-cols-3 gap-2">
          <view
            v-for="s in STRENGTHS"
            :key="s.key"
            class="rounded-xl border py-2.5 text-sm"
            :class="strength === s.key ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="strength = s.key"
          >
            {{ s.label }}
          </view>
        </view>

        <view class="mt-5 text-sm font-semibold text-ink">兴趣点</view>
        <view class="mt-3 grid grid-cols-2 gap-2">
          <view
            v-for="it in INTERESTS"
            :key="it.key"
            class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
            :class="interests.includes(it.key) ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="toggleInterest(it.key)"
          >
            <Icon :name="it.icon" :size="17" :color="interests.includes(it.key) ? 'brand700' : 'inkSoft'" />
            {{ it.label }}
          </view>
        </view>

        <view class="mt-5 text-sm font-semibold text-ink">时间预算</view>
        <view class="mt-3 grid grid-cols-2 gap-2">
          <view
            class="rounded-xl border py-2.5 text-sm"
            :class="time === 'half' ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="time = 'half'"
          >
            半日
          </view>
          <view
            class="rounded-xl border py-2.5 text-sm"
            :class="time === 'full' ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="time = 'full'"
          >
            一日
          </view>
        </view>
      </view>

      <!-- 生成按钮 -->
      <view class="btn-primary w-full py-4 text-base" @click="generate">
        <Icon :name="generating ? 'refresh' : 'sparkle'" :size="18" color="white" />
        {{ generating ? '生成中…' : '帮我挑一条' }}
      </view>

      <!-- 结果 -->
      <view v-if="result" class="card animate-fade-slide overflow-hidden">
        <view
          class="relative h-24"
          :style="{ background: `linear-gradient(120deg,${result.route.cover.from},${result.route.cover.to})` }"
        >
          <image v-if="result.route.cover.image" :src="result.route.cover.image" mode="aspectFill" class="absolute inset-0 h-full w-full" />
          <view class="absolute left-4 top-3 flex items-center gap-2">
            <view class="chip bg-white/85 text-ink">{{ SEASON_LABEL[result.route.season] }}</view>
            <view class="chip bg-brand-600 text-white">AI 推荐</view>
          </view>
        </view>
        <view class="p-5">
          <view class="text-lg font-bold text-ink">{{ result.route.name }} · {{ time === 'half' ? '半日' : '一日' }}</view>
          <view class="mt-2 text-sm leading-relaxed text-ink-soft">{{ result.reason }}</view>
          <view class="mt-3 flex gap-4 text-xs text-ink-faint">
            <view class="flex items-center gap-1"><Icon name="clock" :size="14" color="inkFaint" />{{ result.route.duration }}</view>
            <view class="flex items-center gap-1"><Icon name="route" :size="14" color="inkFaint" />{{ result.route.distanceKm }} km</view>
          </view>
          <view class="mt-4 flex gap-2">
            <view class="btn-ghost flex-1" @click="generate">
              <Icon name="refresh" :size="15" color="brand600" />换一条
            </view>
            <view class="btn-primary flex-1" @click="adopt">采纳此路线</view>
          </view>
        </view>
      </view>

      <view v-if="!result && !generating" class="pt-6 text-center text-xs text-ink-faint">
        演示期由本地规则生成，离线也能用
      </view>
    </view>
  </view>
</template>
