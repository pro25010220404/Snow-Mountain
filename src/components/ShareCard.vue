<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import MedalBadge from './MedalBadge.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const share = computed(() => ui.share)

const brand = computed(() =>
  share.value?.kind === 'achievement' ? '解锁成就' : '运动打卡',
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="share"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-6 backdrop-blur-sm"
        @click.self="ui.closeShare()"
      >
        <div class="w-full max-w-sm animate-medal-pop overflow-hidden rounded-3xl bg-white shadow-lift">
          <!-- 卡片头部：山形装饰 -->
          <div class="relative overflow-hidden bg-gradient-to-b from-brand-600 to-brand-500 px-6 pb-10 pt-6 text-white">
            <svg viewBox="0 0 400 60" class="absolute inset-x-0 bottom-0 w-full" preserveAspectRatio="none">
              <path d="M0 60 L60 22 L120 44 L190 10 L260 40 L330 18 L400 48 L400 60 Z" fill="#ffffff" opacity="0.14" />
            </svg>
            <div class="flex items-center gap-2 text-xs font-medium text-white/80">
              <Icon name="mountain" :size="15" />
              西岭雪山 · 轻康养探索者
            </div>
            <div class="mt-3 flex items-center gap-4">
              <MedalBadge v-if="share.medal" :medal="share.medal" :size="64" />
              <div>
                <p class="text-[11px] uppercase tracking-widest text-white/70">{{ brand }}</p>
                <h3 class="mt-1 text-lg font-bold leading-snug">{{ share.title }}</h3>
              </div>
            </div>
          </div>

          <!-- 数据区 -->
          <div class="px-6 py-5">
            <p class="text-sm text-ink-soft">{{ share.subtitle }}</p>
            <div class="mt-4 grid grid-cols-3 gap-3">
              <div v-for="s in share.stats" :key="s.label" class="rounded-xl bg-paper px-3 py-2.5 text-center">
                <div class="num text-lg font-bold text-brand-700">{{ s.value }}</div>
                <div class="mt-0.5 text-[11px] text-ink-faint">{{ s.label }}</div>
              </div>
            </div>

            <div class="mt-5 flex gap-2">
              <button class="btn-ghost flex-1" @click="ui.closeShare()">关闭</button>
              <button class="btn-primary flex-1" @click="ui.toast('分享图已生成，可保存转发', 'success')">
                <Icon name="share" :size="16" />
                保存分享图
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
