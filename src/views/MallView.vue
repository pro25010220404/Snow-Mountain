<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { MALL_ITEMS } from '@/mock/mall'
import { useUserStore } from '@/stores/user'
import { useMallStore } from '@/stores/mall'
import { useUiStore } from '@/stores/ui'
import type { MallItem } from '@/types'

const router = useRouter()
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
  <div class="min-h-screen pb-28">
    <header class="sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3 backdrop-blur">
      <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card" @click="router.back()">
        <Icon name="arrow-left" :size="20" />
      </button>
      <h1 class="flex-1 text-base font-bold text-ink">积分商城</h1>
      <div class="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5">
        <Icon name="star" :size="15" class="text-amber" />
        <span class="num text-sm font-semibold text-brand-700">{{ user.current.points }}</span>
        <span class="text-xs text-brand-500">积分</span>
      </div>
    </header>

    <main class="space-y-4 px-5 pt-2">
      <!-- 商品 / 兑换记录 -->
      <div class="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 shadow-card">
        <button
          v-for="t in [{ k: 'goods', l: '兑换好物' }, { k: 'records', l: '我的兑换' }] as const"
          :key="t.k"
          class="rounded-xl py-2 text-sm font-medium transition"
          :class="tab === t.k ? 'bg-brand-600 text-white shadow-glow' : 'text-ink-soft'"
          @click="tab = t.k"
        >
          {{ t.l }}
        </button>
      </div>

      <!-- 商品列表 -->
      <div v-if="tab === 'goods'" class="grid grid-cols-2 gap-3">
        <button
          v-for="item in MALL_ITEMS"
          :key="item.id"
          class="tap card overflow-hidden text-left"
          @click="openDetail(item)"
        >
          <div class="flex h-24 items-center justify-center" :style="{ background: `linear-gradient(140deg,${item.cover.from},${item.cover.to})` }">
            <Icon :name="item.type === 'coupon' ? 'ticket' : 'gift'" :size="30" class="text-white/90" />
          </div>
          <div class="p-3">
            <p class="truncate text-sm font-semibold text-ink">{{ item.name }}</p>
            <p class="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-faint">{{ item.desc }}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="flex items-center gap-0.5 text-sm font-bold text-brand-700">
                <Icon name="star" :size="14" class="text-amber" />
                <span class="num">{{ item.cost }}</span>
              </span>
              <span class="text-[11px] text-ink-faint">库存 {{ item.stock }}</span>
            </div>
          </div>
        </button>
      </div>

      <!-- 兑换记录 -->
      <div v-else>
        <div v-if="!mall.sorted.length" class="card flex flex-col items-center gap-2 py-14 text-center">
          <Icon name="gift" :size="36" class="text-ink-faint/50" />
          <p class="text-sm text-ink-faint">还没有兑换记录，攒够积分来换好物</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="r in mall.sorted" :key="r.id" class="card p-4">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-ink">{{ r.itemName }}</p>
                <p class="mt-0.5 text-xs text-ink-faint">{{ r.at }} · 消耗 {{ r.cost }} 积分</p>
              </div>
              <span class="chip bg-brand-50 text-brand-600">已兑换</span>
            </div>
            <div class="mt-3 flex items-center justify-between rounded-xl bg-paper px-3 py-2">
              <span class="text-xs text-ink-faint">兑换码</span>
              <span class="num text-sm font-semibold tracking-wider text-ink">{{ r.code }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 商品详情 -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="detail" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm" @click.self="detail = null">
          <div class="safe-bottom w-full max-w-md rounded-t-3xl bg-white px-6 pb-6">
            <div class="mx-auto mb-4 mt-3 h-1 w-10 rounded-full bg-ink/10" />
            <div class="flex items-center gap-4">
              <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" :style="{ background: `linear-gradient(140deg,${detail.cover.from},${detail.cover.to})` }">
                <Icon :name="detail.type === 'coupon' ? 'ticket' : 'gift'" :size="26" class="text-white/90" />
              </span>
              <div class="min-w-0 flex-1">
                <h2 class="text-lg font-bold text-ink">{{ detail.name }}</h2>
                <p class="mt-0.5 text-xs text-ink-faint">{{ detail.desc }}</p>
              </div>
            </div>

            <div class="mt-4 rounded-2xl bg-paper p-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-ink-faint">兑换内容</span>
                <span class="font-semibold text-ink">{{ detail.value }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="text-ink-faint">所需积分</span>
                <span class="num flex items-center gap-1 font-bold text-brand-700">
                  <Icon name="star" :size="15" class="text-amber" />{{ detail.cost }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="text-ink-faint">我的积分</span>
                <span class="num" :class="canRedeem ? 'text-ink' : 'text-rose-500'">{{ user.current.points }}</span>
              </div>
            </div>

            <button class="btn-primary mt-5 w-full py-4" :disabled="!canRedeem" @click="redeem">
              {{ canRedeem ? '立即兑换' : '积分不足' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 兑换成功 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="redeemed" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-8 backdrop-blur-sm" @click.self="redeemed = null">
          <div class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="gift" :size="30" />
            </div>
            <h3 class="mt-4 text-lg font-bold text-ink">兑换成功</h3>
            <p class="mt-1 text-sm text-ink-soft">{{ redeemed.itemName }}</p>
            <div class="mt-4 rounded-2xl bg-paper px-4 py-3">
              <p class="text-xs text-ink-faint">兑换码</p>
              <p class="num mt-1 text-lg font-bold tracking-wider text-brand-700">{{ redeemed.code }}</p>
            </div>
            <button class="btn-primary mt-5 w-full" @click="redeemed = null">完成</button>
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
