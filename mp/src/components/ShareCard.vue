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
  <view
    v-if="share"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-6"
    @click="ui.closeShare()"
  >
    <view class="w-full max-w-sm animate-medal-pop overflow-hidden rounded-3xl bg-white shadow-lift" @click.stop>
      <!-- 卡片头部 -->
      <view class="relative overflow-hidden bg-gradient-to-b from-brand-600 to-brand-500 px-6 pb-10 pt-6 text-white">
        <view class="flex items-center gap-2 text-xs font-medium text-white/80">
          <Icon name="mountain" :size="15" color="white" :opacity="0.8" />
          西岭雪山 · 轻康养探索者
        </view>
        <view class="mt-3 flex items-center gap-4">
          <MedalBadge v-if="share.medal" :medal="share.medal" :size="64" />
          <view>
            <view class="text-[11px] uppercase tracking-widest text-white/70">{{ brand }}</view>
            <view class="mt-1 text-lg font-bold leading-snug">{{ share.title }}</view>
          </view>
        </view>
      </view>

      <!-- 数据区 -->
      <view class="px-6 py-5">
        <view class="text-sm text-ink-soft">{{ share.subtitle }}</view>
        <view class="mt-4 grid grid-cols-3 gap-3">
          <view v-for="s in share.stats" :key="s.label" class="rounded-xl bg-paper px-3 py-2.5 text-center">
            <view class="num text-lg font-bold text-brand-700">{{ s.value }}</view>
            <view class="mt-0.5 text-[11px] text-ink-faint">{{ s.label }}</view>
          </view>
        </view>

        <view class="mt-5 flex gap-2">
          <view class="btn-ghost flex-1" @click="ui.closeShare()">关闭</view>
          <view class="btn-primary flex-1" @click="ui.toast('分享图已生成，可保存转发', 'success')">
            <Icon name="share" :size="16" color="white" />
            保存分享图
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
