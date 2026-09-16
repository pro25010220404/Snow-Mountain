<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Icon from '@/components/Icon.vue'
import AchievementModal from '@/components/AchievementModal.vue'
import ShareCard from '@/components/ShareCard.vue'
import { push, back } from '@/utils/nav'
import { SEASON_LABEL } from '@/mock/routes'
import { useRoutesStore } from '@/stores/routes'
import { useUiStore } from '@/stores/ui'
import { makeTrack } from '@/utils/track'
import type { RoutePoint } from '@/types'

const routes = useRoutesStore()
const ui = useUiStore()

const id = ref('')
onLoad((q) => {
  if (q && q.id) id.value = q.id as string
})

const r = computed(() => routes.byId(id.value))
const status = computed(() => routes.statusOf(id.value))
const prog = computed(() => routes.progressOf(id.value))

const locked = computed(() => status.value === 'locked')
const started = computed(() => prog.value.started)
const completed = computed(() => prog.value.completed)

const mapPts = computed(() => {
  const n = r.value?.points.length ?? 0
  if (!n) return []
  const tr = makeTrack(id.value.length + n, n)
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
  push(`/checkin/ar?route=${id.value}&point=${pid}`)
}

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
    routes.start(id.value)
    ui.toast('挑战开始，前往打卡点吧', 'success')
    return
  }
  const next = r.value?.points.find((p) => !prog.value.checkedPointIds.includes(p.id))
  if (next) push(`/checkin/ar?route=${id.value}&point=${next.id}`)
}

const ctaText = computed(() => {
  if (locked.value) return '未解锁'
  if (completed.value) return '已完成'
  if (started.value) return '继续打卡'
  return '开始挑战'
})
</script>

<template>
  <view v-if="r" class="pb-28">
    <!-- 头图 -->
    <view class="relative h-56 overflow-hidden" :style="{ background: `linear-gradient(140deg,${r.cover.from},${r.cover.to})` }">
      <view
        class="absolute left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/25"
        style="top: calc(var(--status-bar-height, 0px) + 12px)"
        @click="back()"
      >
        <Icon name="arrow-left" :size="20" color="white" />
      </view>
      <view class="absolute inset-x-0 bottom-0 p-5 text-white">
        <view class="flex items-center gap-2">
          <view class="chip bg-white/20 text-white">{{ SEASON_LABEL[r.season] }}</view>
          <view v-if="completed" class="chip bg-forest text-white">已完成</view>
        </view>
        <view class="mt-2 text-2xl font-bold">{{ r.name }}</view>
        <view class="mt-0.5 text-sm text-white/85">{{ r.subtitle }}</view>
      </view>
    </view>

    <view class="flex flex-col gap-5 px-5 pt-5">
      <!-- 概览 -->
      <view class="card grid grid-cols-3 p-4">
        <view class="text-center">
          <view class="flex justify-center">
            <view v-for="n in 5" :key="n" class="mx-0.5 h-2 w-2 rounded-full" :class="n <= r.difficulty ? 'bg-amber' : 'bg-ink/10'" />
          </view>
          <view class="mt-1.5 text-[11px] text-ink-faint">难度 {{ r.difficulty }}/5</view>
        </view>
        <view class="text-center">
          <view class="num text-lg font-bold text-ink">{{ r.duration.replace('约 ', '') }}</view>
          <view class="mt-0.5 text-[11px] text-ink-faint">预估时长</view>
        </view>
        <view class="text-center">
          <view class="num text-lg font-bold text-ink">{{ r.distanceKm }}</view>
          <view class="mt-0.5 text-[11px] text-ink-faint">里程 km</view>
        </view>
      </view>

      <!-- 介绍 -->
      <view class="card p-5">
        <view class="section-title">路线介绍</view>
        <view class="mt-2 text-sm leading-relaxed text-ink-soft">{{ r.intro }}</view>
        <view class="mt-3 flex gap-2 rounded-xl bg-brand-50 p-3">
          <Icon name="sparkle" :size="18" color="brand500" />
          <view class="text-xs leading-relaxed text-brand-700">{{ r.wellness }}</view>
        </view>
      </view>

      <!-- 打卡点位 -->
      <view class="card overflow-hidden">
        <view class="flex items-center justify-between px-5 pt-5">
          <view class="section-title">打卡点位</view>
          <view class="num text-xs text-ink-faint">{{ prog.checkedPointIds.length }}/{{ r.points.length }}</view>
        </view>

        <!-- 路线地图（点阵近似） -->
        <view class="mx-5 mt-3">
          <view class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-snow-50 to-snow-100 ring-1 ring-ink/5" style="height: 200px">
            <view
              v-for="(p, i) in mapPts"
              :key="p.id"
              class="absolute flex items-center justify-center rounded-full"
              style="width: 22px; height: 22px; border: 2px solid"
              :style="{
                left: 'calc(' + p.x + '% - 11px)',
                top: 'calc(' + (p.y / 64) * 100 + '% - 11px)',
                background: pointState(p.id) === 'done' ? '#3E7C59' : pointState(p.id) === 'todo' ? '#2F5D5A' : '#fff',
                borderColor: pointState(p.id) === 'done' ? '#3E7C59' : pointState(p.id) === 'todo' ? '#2F5D5A' : '#4A8B84',
              }"
              @click="openNav(p)"
            >
              <text class="text-xs font-bold" :style="{ color: pointState(p.id) === 'done' || pointState(p.id) === 'todo' ? '#fff' : '#2F5D5A' }">{{ i + 1 }}</text>
            </view>
          </view>
          <view class="flex items-center justify-between border-t border-ink/5 bg-white/70 px-3 py-1.5 text-[10px] text-ink-faint">
            <view class="flex items-center gap-1"><view class="h-2 w-2 rounded-full bg-forest" />已打卡</view>
            <view class="flex items-center gap-1"><view class="h-2 w-2 rounded-full border border-brand-400 bg-white" />待打卡</view>
            <view class="flex items-center gap-1 text-brand-600"><Icon name="pin" :size="11" color="brand600" />点按点位查看怎么走</view>
          </view>
        </view>

        <view class="mt-2 pb-2">
          <view
            v-for="(p, i) in r.points"
            :key="p.id"
            class="tap flex items-center gap-3 border-b border-ink/5 px-5 py-3.5 last:border-0"
            @click="tapPoint(p.id)"
          >
            <view
              class="num flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              :class="
                pointState(p.id) === 'done'
                  ? 'bg-forest text-white'
                  : pointState(p.id) === 'todo'
                    ? 'bg-brand-600 text-white ring-2 ring-brand-200'
                    : 'bg-ink/8 text-ink-faint'
              "
            >
              <Icon v-if="pointState(p.id) === 'done'" name="check" :size="14" color="white" />
              <Icon v-else-if="pointState(p.id) === 'locked'" name="lock" :size="13" color="inkFaint" />
              <text v-else>{{ i + 1 }}</text>
            </view>
            <view class="flex-1">
              <view class="block text-sm font-medium" :class="pointState(p.id) === 'done' ? 'text-ink-faint' : 'text-ink'">{{ p.name }}</view>
              <view class="mt-0.5 block text-xs text-ink-faint">{{ p.desc }}</view>
            </view>
            <view v-if="pointState(p.id) === 'todo'" class="chip bg-brand-50 text-brand-600">去打卡</view>
            <view v-else-if="pointState(p.id) === 'done'">
              <Icon name="check" :size="18" color="forest" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部 CTA -->
    <view class="safe-bottom fixed bottom-0 left-0 z-30 w-full border-t border-ink/5 bg-white/90 px-5 py-3">
      <view
        class="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold"
        :class="locked ? 'btn-ghost opacity-50' : completed ? 'bg-paper text-forest' : 'btn-primary'"
        @click="primaryAction"
      >
        <Icon v-if="completed" name="check" :size="18" color="forest" />
        <Icon v-else-if="locked" name="lock" :size="18" color="brand600" />
        {{ ctaText }}
      </view>
    </view>

    <!-- 怎么走 · 导航弹层 -->
    <view v-if="navPoint" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60" @click="navPoint = null">
      <view class="safe-bottom w-full rounded-t-3xl bg-white" @click.stop>
        <view class="mx-auto mb-3 mt-3 h-1 w-10 rounded-full bg-ink/10" />
        <view class="px-6 pb-6">
          <view class="flex items-start justify-between gap-3">
            <view class="min-w-0">
              <view class="text-xs text-brand-500">{{ navPoint.nav.from }} → 本站</view>
              <view class="mt-0.5 text-lg font-bold text-ink">{{ navPoint.name }}</view>
              <view class="mt-0.5 text-xs text-ink-faint">{{ navPoint.desc }}</view>
            </view>
            <view class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5" @click="navPoint = null">
              <Icon name="close" :size="18" color="inkFaint" />
            </view>
          </view>

          <view class="mt-4 grid grid-cols-2 gap-2">
            <view class="rounded-xl bg-paper px-3 py-2 text-center">
              <view class="num text-base font-bold text-brand-700">{{ navPoint.nav.meters ? navPoint.nav.meters + ' 米' : '乘缆车' }}</view>
              <view class="mt-0.5 text-[11px] text-ink-faint">距离</view>
            </view>
            <view class="rounded-xl bg-paper px-3 py-2 text-center">
              <view class="num text-base font-bold text-brand-700">{{ navPoint.nav.minutes }} 分钟</view>
              <view class="mt-0.5 text-[11px] text-ink-faint">预计用时</view>
            </view>
          </view>

          <view class="mt-4 text-sm font-semibold text-ink">路线指引</view>
          <view class="mt-2 flex flex-col gap-3">
            <view v-for="(s, i) in navPoint.nav.steps" :key="i" class="flex items-start gap-3">
              <view class="num flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{{ i + 1 }}</view>
              <text class="pt-0.5 text-sm leading-relaxed text-ink-soft">{{ s }}</text>
            </view>
          </view>

          <view class="mt-5">
            <view v-if="pointState(navPoint.id) === 'todo'" class="btn-primary w-full py-4" @click="goCheckin(navPoint.id)">
              <Icon name="camera" :size="18" color="white" /> 去打卡
            </view>
            <view v-else-if="pointState(navPoint.id) === 'done'" class="flex items-center justify-center gap-2 rounded-2xl bg-forest/10 py-4 text-sm font-medium text-forest">
              <Icon name="check" :size="18" color="forest" /> 已打卡完成
            </view>
            <view v-else class="rounded-2xl bg-ink/5 py-4 text-center text-sm text-ink-faint">
              {{ locked ? '路线未解锁' : '先开始挑战，再前往打卡' }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <AchievementModal />
    <ShareCard />
  </view>
</template>
