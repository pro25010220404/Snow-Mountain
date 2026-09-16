<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import AchievementModal from '@/components/AchievementModal.vue'
import ShareCard from '@/components/ShareCard.vue'
import { push } from '@/utils/nav'
import { useRecordsStore } from '@/stores/records'
import { useAchievementsStore } from '@/stores/achievements'
import { useUiStore } from '@/stores/ui'
import { makeTrack, todayStr } from '@/utils/track'
import { useCountUp } from '@/utils/useCountUp'
import type { ExerciseRecord } from '@/types'

const records = useRecordsStore()
const achievements = useAchievementsStore()
const ui = useUiStore()

const stepsShown = useCountUp(() => records.todayStats.steps)
const kmShown = useCountUp(() => records.todayStats.km, { decimals: 1 })
const countShown = useCountUp(() => records.todayStats.count)

function buildRecord(steps: number, km: number, durationMin: number): ExerciseRecord {
  return {
    id: 'r-' + Math.random().toString(36).slice(2, 8),
    date: todayStr(),
    steps,
    distanceKm: +km.toFixed(2),
    durationMin,
    track: makeTrack(Math.floor(Math.random() * 20)),
    passedPoints: [],
  }
}

const recording = ref(false)
const elapsed = ref(0)
const steps = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function startRecord() {
  recording.value = true
  elapsed.value = 0
  steps.value = 0
  ui.toast('开始记录运动轨迹', 'info')
  timer = setInterval(() => {
    elapsed.value += 1
    steps.value += 32
  }, 1000)
}

function stopRecord() {
  if (timer) clearInterval(timer)
  timer = undefined
  recording.value = false
  const km = +(steps.value * 0.00065).toFixed(2)
  const mins = Math.max(1, Math.round(elapsed.value / 60))
  if (steps.value === 0) {
    ui.toast('记录已取消', 'info')
    return
  }
  const rec = buildRecord(steps.value, km, mins)
  const res = records.addRecord(rec)
  achievements.evaluate(false)
  ui.toast(
    res === 'queued' ? '弱网中，已本地保存，联网后自动同步' : `记录完成：${steps.value} 步 · ${km} km`,
    res === 'queued' ? 'warn' : 'success',
  )
  push(`/checkin/${rec.id}`)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const showManual = ref(false)
const manualSteps = ref(3600)
const manualKm = ref(2.4)

function addManual() {
  const rec = buildRecord(manualSteps.value, manualKm.value, Math.round((manualKm.value / 0.05) * 60))
  const res = records.addRecord(rec)
  achievements.evaluate(false)
  showManual.value = false
  ui.toast(res === 'queued' ? '弱网中，已本地保存' : '已补充一条运动记录', res === 'queued' ? 'warn' : 'success')
}

function toggleOffline() {
  records.setOffline(!records.offline)
  if (records.offline) {
    ui.toast('已进入弱网模式，打卡将本地暂存', 'warn')
  } else {
    const n = records.flushPending()
    ui.toast(n ? `网络已恢复，同步 ${n} 条记录` : '网络已恢复', 'success')
  }
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}
</script>

<template>
  <view class="pb-24">
    <view class="safe-top sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-5 pb-2">
      <view class="text-xl font-bold text-ink">打卡</view>
      <view class="flex items-center gap-2">
        <view
          class="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs"
          :class="records.offline ? 'border-amber/40 bg-amber/10 text-amber' : 'border-ink/10 bg-white text-ink-faint'"
          @click="toggleOffline"
        >
          <Icon name="wifi-off" :size="14" :color="records.offline ? 'amber' : 'inkFaint'" />
          {{ records.offline ? '弱网' : '在线' }}
        </view>
        <view class="btn-ghost !rounded-full !px-3 !py-1.5 text-xs" @click="push('/checkin/ar')">
          <Icon name="camera" :size="14" color="brand600" />
          扫码
        </view>
      </view>
    </view>

    <view class="flex flex-col gap-5 px-5">
      <!-- 今日概览 / 进行中 -->
      <view
        class="relative overflow-hidden rounded-3xl p-5 text-white shadow-card"
        :class="recording ? 'ring-2 ring-brand-300' : ''"
        style="background: linear-gradient(120deg, #2F5D5A, #4A8B84)"
      >
        <view v-if="!recording">
          <view class="text-xs text-white/75">今日运动</view>
          <view class="mt-3 flex items-end gap-6">
            <view>
              <view class="num text-3xl font-bold">{{ stepsShown.toLocaleString() }}</view>
              <view class="mt-1 text-xs text-white/75">步数</view>
            </view>
            <view>
              <view class="num text-3xl font-bold">{{ kmShown }}</view>
              <view class="mt-1 text-xs text-white/75">里程 km</view>
            </view>
            <view>
              <view class="num text-3xl font-bold">{{ countShown }}</view>
              <view class="mt-1 text-xs text-white/75">打卡次数</view>
            </view>
          </view>
        </view>
        <view v-else class="animate-fade-slide">
          <view class="text-xs text-white/75">正在记录 · 实时采集</view>
          <view class="mt-3 flex items-end gap-6">
            <view>
              <view class="num text-3xl font-bold tabular-nums">{{ steps.toLocaleString() }}</view>
              <view class="mt-1 text-xs text-white/75">步数</view>
            </view>
            <view>
              <view class="num text-3xl font-bold">{{ fmtTime(elapsed) }}</view>
              <view class="mt-1 text-xs text-white/75">时长</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 开始/结束 -->
      <view
        v-if="!recording"
        class="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-semibold text-brand-700 shadow-card"
        @click="startRecord"
      >
        <Icon name="footprints" :size="20" color="brand700" />
        开始记录运动
      </view>
      <view v-else class="btn-primary animate-ring-pulse w-full py-4 text-base" @click="stopRecord">
        结束并保存
      </view>

      <!-- 记录列表 -->
      <view>
        <view class="mb-3 flex items-center justify-between">
          <view class="section-title">运动记录</view>
          <view class="flex items-center gap-1 text-xs text-brand-600" @click="showManual = true">
            <Icon name="plus" :size="14" color="brand600" />
            手动补充
          </view>
        </view>

        <view v-if="records.pending.length" class="mb-3 flex items-center gap-2 rounded-xl bg-amber/10 px-4 py-2.5 text-xs text-amber">
          <Icon name="wifi-off" :size="15" color="amber" />
          {{ records.pending.length }} 条记录待同步，联网后自动上传
        </view>

        <view class="flex flex-col gap-3">
          <view
            v-for="(r, i) in records.records"
            :key="r.id"
            class="tap card flex w-full animate-fade-slide items-center gap-4 p-4"
            :style="{ animationDelay: `${i * 50}ms` }"
            @click="push(`/checkin/${r.id}`)"
          >
            <view class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <Icon name="footprints" :size="22" color="brand600" />
            </view>
            <view class="flex-1">
              <view class="block text-sm font-semibold text-ink">{{ r.date }}</view>
              <view class="mt-0.5 block text-xs text-ink-faint">{{ r.steps.toLocaleString() }} 步 · {{ r.distanceKm }} km</view>
            </view>
            <view class="num text-xs text-ink-faint">{{ Math.floor(r.durationMin / 60) }}h{{ r.durationMin % 60 }}m</view>
            <Icon name="chevron-right" :size="18" color="inkFaint" />
          </view>
        </view>
      </view>
    </view>

    <!-- 手动补充弹层 -->
    <view v-if="showManual" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60" @click="showManual = false">
      <view class="safe-bottom w-full rounded-t-3xl bg-white p-6" @click.stop>
        <view class="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/10" />
        <view class="text-base font-bold text-ink">手动补充一条记录</view>
        <view class="mt-1 text-xs text-ink-faint">演示用：模拟一条运动记录，用于触发成就</view>
        <view class="mt-4 flex flex-col gap-3">
          <view class="rounded-2xl border border-ink/10 bg-paper px-4 py-3">
            <view class="text-xs text-ink-faint">步数</view>
            <input v-model.number="manualSteps" type="number" class="num mt-1 w-full bg-transparent text-lg font-bold text-ink outline-none" />
          </view>
          <view class="rounded-2xl border border-ink/10 bg-paper px-4 py-3">
            <view class="text-xs text-ink-faint">里程（km）</view>
            <input v-model.number="manualKm" type="number" step="0.1" class="num mt-1 w-full bg-transparent text-lg font-bold text-ink outline-none" />
          </view>
        </view>
        <view class="mt-5 flex gap-2">
          <view class="btn-ghost flex-1" @click="showManual = false">取消</view>
          <view class="btn-primary flex-1" @click="addManual">保存记录</view>
        </view>
      </view>
    </view>

    <TabBar current="checkin" />
    <AchievementModal />
    <ShareCard />
  </view>
</template>
