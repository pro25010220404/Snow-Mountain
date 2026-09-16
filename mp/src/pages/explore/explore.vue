<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import RouteCard from '@/components/RouteCard.vue'
import AchievementModal from '@/components/AchievementModal.vue'
import ShareCard from '@/components/ShareCard.vue'
import { push } from '@/utils/nav'
import { ROUTES } from '@/mock/routes'
import { useRoutesStore } from '@/stores/routes'
import { useUiStore } from '@/stores/ui'
import type { Season } from '@/types'

const routes = useRoutesStore()
const ui = useUiStore()

const month = new Date().getMonth() + 1
const season: Season = month === 12 || month <= 2 ? 'winter' : month <= 5 ? 'spring' : month <= 8 ? 'summer' : 'autumn'

const BANNER: Record<Season, { tag: string; title: string; desc: string; from: string; to: string }> = {
  winter: { tag: '冰雪季', title: '冬季 · 冰雪挑战者', desc: '滑雪进阶，从初雪到野雪区', from: '#5C84AC', to: '#9FB9D0' },
  spring: { tag: '花季', title: '春季 · 杜鹃探险家', desc: '高山杜鹃正盛，徒步赏花', from: '#6FA55A', to: '#A6C48F' },
  summer: { tag: '避暑季', title: '夏季 · 森林疗愈师', desc: '22℃ 天然空调，森林浴氧吧', from: '#3E8BA0', to: '#7FB2C2' },
  autumn: { tag: '彩林季', title: '秋季 · 彩林摄影师', desc: '层林尽染，云海红叶同框', from: '#C97B3D', to: '#E0A96A' },
}

const banner = computed(() => BANNER[season])

function openRoute(id: string) {
  const status = routes.statusOf(id)
  if (status === 'locked') {
    const r = routes.byId(id)
    const prev = r?.requires.map((x) => routes.byId(x)?.name).join('、')
    ui.toast(`先完成「${prev}」路线即可解锁`, 'info')
    return
  }
  push(`/explore/route/${id}`)
}
</script>

<template>
  <view class="pb-24">
    <!-- 顶栏 -->
    <view class="safe-top sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-5 pb-2">
      <view class="text-xl font-bold text-ink">探索</view>
      <view class="flex items-center gap-1 text-sm text-ink-soft" @click="push('/rank')">
        <Icon name="trophy" :size="18" color="inkSoft" />
        排行榜
      </view>
    </view>

    <view class="flex flex-col gap-5 px-5">
      <!-- 季节 Banner -->
      <view
        class="relative overflow-hidden rounded-3xl p-5 text-white shadow-card"
        :style="{ background: `linear-gradient(120deg,${banner.from},${banner.to})` }"
      >
        <view class="chip bg-white/20 text-white">{{ banner.tag }}</view>
        <view class="mt-3 text-lg font-bold">{{ banner.title }}</view>
        <view class="mt-1 text-sm text-white/85">{{ banner.desc }}</view>
      </view>

      <!-- AI 推荐入口 -->
      <view
        class="tap flex w-full items-center gap-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-4"
        @click="push('/explore/ai')"
      >
        <view class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 shadow-glow">
          <Icon name="sparkle" :size="22" color="white" />
        </view>
        <view class="flex-1">
          <view class="block text-sm font-semibold text-brand-700">让 AI 帮我挑一条路线</view>
          <view class="mt-0.5 block text-xs text-brand-500/80">按强度、兴趣和时间，选一条合适的</view>
        </view>
        <Icon name="chevron-right" :size="18" color="brand400" />
      </view>

      <!-- 路线列表 -->
      <view>
        <view class="mb-3 flex items-center justify-between">
          <view class="section-title">四季路线</view>
          <view class="text-xs text-ink-faint">完成前序路线解锁进阶</view>
        </view>
        <view class="flex flex-col gap-4">
          <RouteCard
            v-for="(r, i) in ROUTES"
            :key="r.id"
            class="animate-fade-slide"
            :style="{ animationDelay: `${i * 60}ms` }"
            :route="r"
            :status="routes.statusOf(r.id)"
            :progress="routes.progressOf(r.id).checkedPointIds.length / r.points.length"
            @click="openRoute(r.id)"
          />
        </view>
      </view>
    </view>

    <TabBar current="explore" />
    <AchievementModal />
    <ShareCard />
  </view>
</template>
