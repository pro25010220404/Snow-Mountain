<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { ROUTES, SEASON_LABEL } from '@/mock/routes'
import { useUiStore } from '@/stores/ui'
import type { ExploreRoute } from '@/types'

const router = useRouter()
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

// 规则打分（LLM 的本地兜底，演示用）
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
  if (result.value) router.push(`/explore/route/${result.value.route.id}`)
}
</script>

<template>
  <div class="min-h-screen pb-10">
    <header class="sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3 backdrop-blur">
      <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card" @click="router.back()">
        <Icon name="arrow-left" :size="20" />
      </button>
      <h1 class="text-base font-bold text-ink">AI 路线推荐</h1>
    </header>

    <main class="space-y-5 px-5 pt-2">
      <!-- 偏好表单 -->
      <section class="card p-5">
        <p class="text-sm font-semibold text-ink">运动强度</p>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <button
            v-for="s in STRENGTHS"
            :key="s.key"
            class="rounded-xl border py-2.5 text-sm transition"
            :class="strength === s.key ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="strength = s.key"
          >
            {{ s.label }}
          </button>
        </div>

        <p class="mt-5 text-sm font-semibold text-ink">兴趣点</p>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            v-for="it in INTERESTS"
            :key="it.key"
            class="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition"
            :class="interests.includes(it.key) ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="toggleInterest(it.key)"
          >
            <Icon :name="it.icon" :size="17" />
            {{ it.label }}
          </button>
        </div>

        <p class="mt-5 text-sm font-semibold text-ink">时间预算</p>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button
            class="rounded-xl border py-2.5 text-sm transition"
            :class="time === 'half' ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="time = 'half'"
          >
            半日
          </button>
          <button
            class="rounded-xl border py-2.5 text-sm transition"
            :class="time === 'full' ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700' : 'border-ink/10 text-ink-soft'"
            @click="time = 'full'"
          >
            一日
          </button>
        </div>
      </section>

      <!-- 生成按钮 -->
      <button class="btn-primary w-full py-4 text-base" :disabled="generating" @click="generate">
        <Icon :name="generating ? 'refresh' : 'sparkle'" :size="18" :class="generating ? 'animate-spin' : ''" />
        {{ generating ? '生成中…' : '帮我挑一条' }}
      </button>

      <!-- 结果 -->
      <Transition name="fade">
        <section v-if="result" class="card overflow-hidden">
          <div
            class="relative h-24"
            :style="{ background: `linear-gradient(120deg,${result.route.cover.from},${result.route.cover.to})` }"
          >
            <svg viewBox="0 0 400 100" class="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 100 L80 50 L150 70 L240 30 L320 70 L400 40 L400 100 Z" fill="#fff" opacity="0.25" />
            </svg>
            <div class="absolute left-4 top-3 flex items-center gap-2">
              <span class="chip bg-white/85 text-ink backdrop-blur">{{ SEASON_LABEL[result.route.season] }}</span>
              <span class="chip bg-brand-600 text-white">AI 推荐</span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-lg font-bold text-ink">{{ result.route.name }} · {{ time === 'half' ? '半日' : '一日' }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ result.reason }}</p>
            <div class="mt-3 flex gap-4 text-xs text-ink-faint">
              <span class="flex items-center gap-1"><Icon name="clock" :size="14" />{{ result.route.duration }}</span>
              <span class="flex items-center gap-1"><Icon name="route" :size="14" />{{ result.route.distanceKm }} km</span>
            </div>
            <div class="mt-4 flex gap-2">
              <button class="btn-ghost flex-1" @click="generate">
                <Icon name="refresh" :size="15" />换一条
              </button>
              <button class="btn-primary flex-1" @click="adopt">采纳此路线</button>
            </div>
          </div>
        </section>
      </Transition>

      <p v-if="!result && !generating" class="pt-6 text-center text-xs text-ink-faint">
        演示期由本地规则生成，离线也能用
      </p>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
