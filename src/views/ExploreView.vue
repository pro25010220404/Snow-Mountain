<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import TabBar from '@/components/TabBar.vue'
import RouteCard from '@/components/RouteCard.vue'
import { ROUTES } from '@/mock/routes'
import { useRoutesStore } from '@/stores/routes'
import { useUiStore } from '@/stores/ui'
import type { Season } from '@/types'

const router = useRouter()
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
  router.push(`/explore/route/${id}`)
}
</script>

<template>
  <div class="pb-24">
    <!-- 顶栏 -->
    <header class="sticky top-0 z-30 flex items-center justify-between bg-paper/80 px-5 pb-2 pt-5 backdrop-blur">
      <h1 class="text-xl font-bold text-ink">探索</h1>
      <button class="flex items-center gap-1 text-sm text-ink-soft" @click="router.push('/rank')">
        <Icon name="trophy" :size="18" />
        排行榜
      </button>
    </header>

    <main class="space-y-5 px-5">
      <!-- 季节 Banner -->
      <section
        class="relative overflow-hidden rounded-3xl p-5 text-white shadow-card"
        :style="{ background: `linear-gradient(120deg,${banner.from},${banner.to})` }"
      >
        <svg viewBox="0 0 400 140" class="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 140 L80 70 L150 96 L230 40 L300 90 L400 50 L400 140 Z" fill="#fff" opacity="0.2" />
        </svg>
        <span class="chip bg-white/20 text-white backdrop-blur">{{ banner.tag }}</span>
        <h2 class="mt-3 text-lg font-bold">{{ banner.title }}</h2>
        <p class="mt-1 text-sm text-white/85">{{ banner.desc }}</p>
      </section>

      <!-- AI 推荐入口 -->
      <button
        class="tap flex w-full items-center gap-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-4 text-left"
        @click="router.push('/explore/ai')"
      >
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-glow">
          <Icon name="sparkle" :size="22" />
        </span>
        <span class="flex-1">
          <span class="block text-sm font-semibold text-brand-700">让 AI 帮我挑一条路线</span>
          <span class="mt-0.5 block text-xs text-brand-500/80">按强度、兴趣和时间，选一条合适的</span>
        </span>
        <Icon name="chevron-right" :size="18" class="text-brand-400" />
      </button>

      <!-- 路线列表 -->
      <section>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="section-title">四季路线</h2>
          <span class="text-xs text-ink-faint">完成前序路线解锁进阶</span>
        </div>
        <div class="space-y-4">
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
        </div>
      </section>
    </main>

    <TabBar />
  </div>
</template>
