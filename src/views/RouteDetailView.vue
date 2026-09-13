<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { SEASON_LABEL } from '@/mock/routes'
import { useRoutesStore } from '@/stores/routes'
import { useUiStore } from '@/stores/ui'
import { makeTrack } from '@/utils/track'
import type { RoutePoint } from '@/types'

const route = useRoute()
const router = useRouter()
const routes = useRoutesStore()
const ui = useUiStore()

const id = route.params.id as string
const r = computed(() => routes.byId(id))
const status = computed(() => routes.statusOf(id))
const prog = computed(() => routes.progressOf(id))

const locked = computed(() => status.value === 'locked')
const started = computed(() => prog.value.started)
const completed = computed(() => prog.value.completed)

// 点位在缩略地图上的位置
const mapPts = computed(() => {
  const n = r.value?.points.length ?? 0
  if (!n) return []
  const tr = makeTrack(id.length + n, n)
  return r.value!.points.map((p, i) => ({ ...p, x: tr[i].x, y: tr[i].y }))
})

function pointState(pid: string) {
  if (prog.value.checkedPointIds.includes(pid)) return 'done'
  if (locked.value) return 'locked'
  if (started.value) return 'todo'
  return 'idle'
}

function tapPoint(pid: string) {
  const s = pointState(pid)
  if (s === 'done') return
  if (s === 'locked' || s === 'idle') {
    ui.toast('先「开始挑战」再逐点打卡', 'info')
    return
  }
  router.push(`/checkin/ar?route=${id}&point=${pid}`)
}

// —— 点位导航（怎么走）——
const navPoint = ref<RoutePoint | null>(null)
function openNav(p: RoutePoint) {
  navPoint.value = p
}
function goCheckin(pid: string) {
  navPoint.value = null
  tapPoint(pid)
}

function primaryAction() {
  if (locked.value) return
  if (completed.value) return
  if (!started.value) {
    routes.start(id)
    ui.toast('挑战开始，前往打卡点吧', 'success')
    return
  }
  // 继续打卡 → 去下一个未打卡点位
  const next = r.value?.points.find((p) => !prog.value.checkedPointIds.includes(p.id))
  if (next) router.push(`/checkin/ar?route=${id}&point=${next.id}`)
}

const ctaText = computed(() => {
  if (locked.value) return '未解锁'
  if (completed.value) return '已完成'
  if (started.value) return '继续打卡'
  return '开始挑战'
})

function goBack() {
  router.back()
}
</script>

<template>
  <div v-if="r" class="pb-28">
    <!-- 头图 -->
    <div class="relative h-56 overflow-hidden" :style="{ background: `linear-gradient(140deg,${r.cover.from},${r.cover.to})` }">
      <svg viewBox="0 0 400 240" class="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none">
        <path d="M0 240 L80 120 L150 160 L240 70 L320 150 L400 100 L400 240 Z" fill="#fff" opacity="0.25" />
      </svg>
      <button
        class="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/25 text-white backdrop-blur"
        @click="goBack"
      >
        <Icon name="arrow-left" :size="20" />
      </button>
      <div class="absolute inset-x-0 bottom-0 p-5 text-white">
        <div class="flex items-center gap-2">
          <span class="chip bg-white/20 text-white backdrop-blur">{{ SEASON_LABEL[r.season] }}</span>
          <span v-if="completed" class="chip bg-forest text-white">已完成</span>
        </div>
        <h1 class="mt-2 text-2xl font-bold">{{ r.name }}</h1>
        <p class="mt-0.5 text-sm text-white/85">{{ r.subtitle }}</p>
      </div>
    </div>

    <div class="space-y-5 px-5 pt-5">
      <!-- 概览 -->
      <div class="card grid grid-cols-3 divide-x divide-ink/5 p-4">
        <div class="text-center">
          <div class="flex justify-center text-amber">
            <span v-for="n in 5" :key="n" class="mx-0.5 h-2 w-2 rounded-full" :class="n <= r.difficulty ? 'bg-amber' : 'bg-ink/10'" />
          </div>
          <p class="mt-1.5 text-[11px] text-ink-faint">难度 {{ r.difficulty }}/5</p>
        </div>
        <div class="text-center">
          <div class="num text-lg font-bold text-ink">{{ r.duration.replace('约 ', '') }}</div>
          <p class="mt-0.5 text-[11px] text-ink-faint">预估时长</p>
        </div>
        <div class="text-center">
          <div class="num text-lg font-bold text-ink">{{ r.distanceKm }}</div>
          <p class="mt-0.5 text-[11px] text-ink-faint">里程 km</p>
        </div>
      </div>

      <!-- 介绍 -->
      <section class="card p-5">
        <h2 class="section-title">路线介绍</h2>
        <p class="mt-2 text-sm leading-relaxed text-ink-soft">{{ r.intro }}</p>
        <div class="mt-3 flex gap-2 rounded-xl bg-brand-50 p-3">
          <Icon name="sparkle" :size="18" class="shrink-0 text-brand-500" />
          <p class="text-xs leading-relaxed text-brand-700">{{ r.wellness }}</p>
        </div>
      </section>

      <!-- 打卡点位 -->
      <section class="card overflow-hidden">
        <div class="flex items-center justify-between px-5 pt-5">
          <h2 class="section-title">打卡点位</h2>
          <span class="num text-xs text-ink-faint">{{ prog.checkedPointIds.length }}/{{ r.points.length }}</span>
        </div>

        <!-- 路线地图（点按点位查看怎么走） -->
        <div class="mx-5 mt-3">
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-snow-50 to-snow-100 ring-1 ring-ink/5">
            <svg viewBox="0 0 100 64" class="w-full">
              <line v-for="i in 5" :key="'v' + i" :x1="i * 20" y1="0" :x2="i * 20" y2="64" stroke="#00000008" />
              <line v-for="i in 4" :key="'h' + i" x1="0" :y1="i * 16" x2="100" :y2="i * 16" stroke="#00000008" />
              <polyline
                :points="mapPts.map((p) => `${p.x},${p.y}`).join(' ')"
                fill="none"
                stroke="#4A8B84"
                stroke-width="1.6"
                stroke-dasharray="3 2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g v-for="(p, i) in mapPts" :key="p.id" class="cursor-pointer" @click="openNav(p)">
                <circle :cx="p.x" :cy="p.y" r="9" fill="transparent" />
                <circle
                  :cx="p.x"
                  :cy="p.y"
                  r="3.6"
                  :fill="pointState(p.id) === 'done' ? '#3E7C59' : pointState(p.id) === 'todo' ? '#2F5D5A' : '#fff'"
                  :stroke="pointState(p.id) === 'done' ? '#3E7C59' : pointState(p.id) === 'todo' ? '#2F5D5A' : '#4A8B84'"
                  stroke-width="1.6"
                />
                <text
                  :x="p.x"
                  :y="p.y - 7"
                  text-anchor="middle"
                  font-size="4.6"
                  font-weight="600"
                  :fill="pointState(p.id) === 'done' ? '#3E7C59' : '#2F5D5A'"
                >
                  {{ i + 1 }}
                </text>
              </g>
            </svg>
            <div class="flex items-center justify-between border-t border-ink/5 bg-white/70 px-3 py-1.5 text-[10px] text-ink-faint">
              <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-forest" />已打卡</span>
              <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full border border-brand-400 bg-white" />待打卡</span>
              <span class="flex items-center gap-1 text-brand-600"><Icon name="pin" :size="11" />点按点位查看怎么走</span>
            </div>
          </div>
        </div>

        <ul class="mt-2 pb-2">
          <li
            v-for="(p, i) in r.points"
            :key="p.id"
            class="tap flex items-center gap-3 border-b border-ink/5 px-5 py-3.5 last:border-0"
            @click="tapPoint(p.id)"
          >
            <span
              class="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              :class="
                pointState(p.id) === 'done'
                  ? 'bg-forest text-white'
                  : pointState(p.id) === 'todo'
                    ? 'bg-brand-600 text-white ring-2 ring-brand-200'
                    : 'bg-ink/8 text-ink-faint'
              "
            >
              <Icon v-if="pointState(p.id) === 'done'" name="check" :size="14" />
              <Icon v-else-if="pointState(p.id) === 'locked'" name="lock" :size="13" />
              <span v-else>{{ i + 1 }}</span>
            </span>
            <span class="flex-1">
              <span class="block text-sm font-medium" :class="pointState(p.id) === 'done' ? 'text-ink-faint' : 'text-ink'">{{ p.name }}</span>
              <span class="mt-0.5 block text-xs text-ink-faint">{{ p.desc }}</span>
            </span>
            <span
              v-if="pointState(p.id) === 'todo'"
              class="chip bg-brand-50 text-brand-600"
            >去打卡</span>
            <span v-else-if="pointState(p.id) === 'done'" class="text-forest">
              <Icon name="check" :size="18" />
            </span>
          </li>
        </ul>
      </section>
    </div>

    <!-- 底部 CTA -->
    <div class="safe-bottom fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-ink/5 bg-white/90 px-5 py-3 backdrop-blur">
      <button
        class="btn w-full py-4 text-base"
        :class="locked ? 'btn-ghost opacity-50' : completed ? 'bg-paper text-forest' : 'btn-primary'"
        :disabled="locked || completed"
        @click="primaryAction"
      >
        <Icon v-if="completed" name="check" :size="18" />
        <Icon v-else-if="locked" name="lock" :size="18" />
        {{ ctaText }}
      </button>
    </div>

    <!-- 怎么走 · 导航弹层 -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="navPoint" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm" @click.self="navPoint = null">
          <div class="safe-bottom w-full max-w-md rounded-t-3xl bg-white">
            <div class="mx-auto mb-3 mt-3 h-1 w-10 rounded-full bg-ink/10" />
            <div class="px-6 pb-6">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-xs text-brand-500">{{ navPoint.nav.from }} → 本站</p>
                  <h3 class="mt-0.5 text-lg font-bold text-ink">{{ navPoint.name }}</h3>
                  <p class="mt-0.5 text-xs text-ink-faint">{{ navPoint.desc }}</p>
                </div>
                <button class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-faint" @click="navPoint = null">
                  <Icon name="close" :size="18" />
                </button>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2">
                <div class="rounded-xl bg-paper px-3 py-2 text-center">
                  <div class="num text-base font-bold text-brand-700">{{ navPoint.nav.meters ? navPoint.nav.meters + ' 米' : '乘缆车' }}</div>
                  <p class="mt-0.5 text-[11px] text-ink-faint">距离</p>
                </div>
                <div class="rounded-xl bg-paper px-3 py-2 text-center">
                  <div class="num text-base font-bold text-brand-700">{{ navPoint.nav.minutes }} 分钟</div>
                  <p class="mt-0.5 text-[11px] text-ink-faint">预计用时</p>
                </div>
              </div>

              <p class="mt-4 text-sm font-semibold text-ink">路线指引</p>
              <ol class="mt-2 space-y-3">
                <li v-for="(s, i) in navPoint.nav.steps" :key="i" class="flex items-start gap-3">
                  <span class="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{{ i + 1 }}</span>
                  <span class="pt-0.5 text-sm leading-relaxed text-ink-soft">{{ s }}</span>
                </li>
              </ol>

              <div class="mt-5">
                <button v-if="pointState(navPoint.id) === 'todo'" class="btn-primary w-full py-4" @click="goCheckin(navPoint.id)">
                  <Icon name="camera" :size="18" /> 去打卡
                </button>
                <div v-else-if="pointState(navPoint.id) === 'done'" class="flex items-center justify-center gap-2 rounded-2xl bg-forest/10 py-4 text-sm font-medium text-forest">
                  <Icon name="check" :size="18" /> 已打卡完成
                </div>
                <div v-else class="rounded-2xl bg-ink/5 py-4 text-center text-sm text-ink-faint">
                  {{ locked ? '路线未解锁' : '先开始挑战，再前往打卡' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.28s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
