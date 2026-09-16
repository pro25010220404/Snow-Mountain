<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { back } from '@/utils/nav'
import { MALL_ITEMS } from '@/mock/mall'
import { useUserStore } from '@/stores/user'
import { useMallStore } from '@/stores/mall'
import { useUiStore } from '@/stores/ui'
import type { MallItem } from '@/types'

const user = useUserStore()
const mall = useMallStore()
const ui = useUiStore()

const tab = ref<'goods' | 'records'>('goods')

const detail = ref<MallItem | null>(null)
const redeemed = ref<{ itemName: string; code: string } | null>(null)

function openDetail(item: MallItem) {
  detail.value = item
}

const canRedeem = computed(() => {
  if (!detail.value) return false
  return user.current.points >= detail.value.cost
})

function redeem() {
  if (!detail.value) return
  if (!canRedeem.value) {
    ui.toast(`积分不足，还差 ${detail.value.cost - user.current.points} 分`, 'warn')
    return
  }
  const item = detail.value
  const ok = mall.redeem({ name: item.name, cost: item.cost, value: item.value })
  if (ok) {
    const last = mall.sorted[0]
    redeemed.value = { itemName: item.name, code: last?.code ?? '' }
    detail.value = null
  }
}
</script>

<template>
  <view class="min-h-screen pb-28">
    <view class="safe-top sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3">
      <view class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card" @click="back()">
        <Icon name="arrow-left" :size="20" color="ink" />
      </view>
      <view class="flex-1 text-base font-bold text-ink">积分商城</view>
      <view class="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5">
        <Icon name="star" :size="15" color="amber" />
        <text class="num text-sm font-semibold text-brand-700">{{ user.current.points }}</text>
        <text class="text-xs text-brand-500">积分</text>
      </view>
    </view>

    <view class="flex flex-col gap-4 px-5 pt-2">
      <!-- 商品 / 兑换记录 -->
      <view class="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 shadow-card">
        <view
          v-for="t in [{ k: 'goods', l: '兑换好物' }, { k: 'records', l: '我的兑换' }] as const"
          :key="t.k"
          class="rounded-xl py-2 text-sm font-medium"
          :class="tab === t.k ? 'bg-brand-600 text-white shadow-glow' : 'text-ink-soft'"
          @click="tab = t.k"
        >
          {{ t.l }}
        </view>
      </view>

      <!-- 商品列表 -->
      <view v-if="tab === 'goods'" class="grid grid-cols-2 gap-3">
        <view
          v-for="item in MALL_ITEMS"
          :key="item.id"
          class="tap card overflow-hidden"
          @click="openDetail(item)"
        >
          <view class="flex h-24 items-center justify-center" :style="{ background: `linear-gradient(140deg,${item.cover.from},${item.cover.to})` }">
            <Icon :name="item.type === 'coupon' ? 'ticket' : 'gift'" :size="30" color="white" :opacity="0.9" />
          </view>
          <view class="p-3">
            <view class="truncate text-sm font-semibold text-ink">{{ item.name }}</view>
            <view class="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-faint">{{ item.desc }}</view>
            <view class="mt-2 flex items-center justify-between">
              <view class="flex items-center gap-0.5 text-sm font-bold text-brand-700">
                <Icon name="star" :size="14" color="amber" />
                <text class="num">{{ item.cost }}</text>
              </view>
              <view class="text-[11px] text-ink-faint">库存 {{ item.stock }}</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 兑换记录 -->
      <view v-else>
        <view v-if="!mall.sorted.length" class="card flex flex-col items-center gap-2 py-14 text-center">
          <Icon name="gift" :size="36" color="inkFaint" :opacity="0.5" />
          <view class="text-sm text-ink-faint">还没有兑换记录，攒够积分来换好物</view>
        </view>
        <view v-else class="flex flex-col gap-3">
          <view v-for="r in mall.sorted" :key="r.id" class="card p-4">
            <view class="flex items-center justify-between gap-3">
              <view class="min-w-0">
                <view class="truncate text-sm font-semibold text-ink">{{ r.itemName }}</view>
                <view class="mt-0.5 text-xs text-ink-faint">{{ r.at }} · 消耗 {{ r.cost }} 积分</view>
              </view>
              <view class="chip bg-brand-50 text-brand-600">已兑换</view>
            </view>
            <view class="mt-3 flex items-center justify-between rounded-xl bg-paper px-3 py-2">
              <text class="text-xs text-ink-faint">兑换码</text>
              <text class="num text-sm font-semibold tracking-wider text-ink">{{ r.code }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view v-if="detail" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60" @click="detail = null">
      <view class="safe-bottom w-full rounded-t-3xl bg-white px-6 pb-6" @click.stop>
        <view class="mx-auto mb-4 mt-3 h-1 w-10 rounded-full bg-ink/10" />
        <view class="flex items-center gap-4">
          <view class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" :style="{ background: `linear-gradient(140deg,${detail.cover.from},${detail.cover.to})` }">
            <Icon :name="detail.type === 'coupon' ? 'ticket' : 'gift'" :size="26" color="white" :opacity="0.9" />
          </view>
          <view class="min-w-0 flex-1">
            <view class="text-lg font-bold text-ink">{{ detail.name }}</view>
            <view class="mt-0.5 text-xs text-ink-faint">{{ detail.desc }}</view>
          </view>
        </view>

        <view class="mt-4 rounded-2xl bg-paper p-4">
          <view class="flex items-center justify-between text-sm">
            <text class="text-ink-faint">兑换内容</text>
            <text class="font-semibold text-ink">{{ detail.value }}</text>
          </view>
          <view class="mt-2 flex items-center justify-between text-sm">
            <text class="text-ink-faint">所需积分</text>
            <view class="num flex items-center gap-1 font-bold text-brand-700">
              <Icon name="star" :size="15" color="amber" />{{ detail.cost }}
            </view>
          </view>
          <view class="mt-2 flex items-center justify-between text-sm">
            <text class="text-ink-faint">我的积分</text>
            <text class="num" :class="canRedeem ? 'text-ink' : 'text-rose-500'">{{ user.current.points }}</text>
          </view>
        </view>

        <view class="btn-primary mt-5 w-full py-4" @click="redeem">
          {{ canRedeem ? '立即兑换' : '积分不足' }}
        </view>
      </view>
    </view>

    <!-- 兑换成功 -->
    <view v-if="redeemed" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-8" @click="redeemed = null">
      <view class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift" @click.stop>
        <view class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <Icon name="gift" :size="30" color="brand600" />
        </view>
        <view class="mt-4 text-lg font-bold text-ink">兑换成功</view>
        <view class="mt-1 text-sm text-ink-soft">{{ redeemed.itemName }}</view>
        <view class="mt-4 rounded-2xl bg-paper px-4 py-3">
          <view class="text-xs text-ink-faint">兑换码</view>
          <view class="num mt-1 text-lg font-bold tracking-wider text-brand-700">{{ redeemed.code }}</view>
        </view>
        <view class="btn-primary mt-5 w-full" @click="redeemed = null">完成</view>
      </view>
    </view>
  </view>
</template>
