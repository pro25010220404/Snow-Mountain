<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { SERVICES, CATEGORY_LABEL } from '@/mock/services'
import { useOrdersStore } from '@/stores/orders'
import { useUiStore } from '@/stores/ui'
import type { ServiceCategory, ServiceItem } from '@/types'

const router = useRouter()
const orders = useOrdersStore()
const ui = useUiStore()

const tab = ref<'list' | 'orders'>('list')
const category = ref<ServiceCategory | 'all'>('all')

const CATEGORIES: { key: ServiceCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'stay', label: '住宿' },
  { key: 'food', label: '餐饮' },
  { key: 'activity', label: '活动' },
]

const list = computed(() =>
  category.value === 'all' ? SERVICES : SERVICES.filter((s) => s.category === category.value),
)

// —— 日期选择（未来 7 天）——
function nextDays(n: number): { label: string; value: string }[] {
  const days: { label: string; value: string }[] = []
  const base = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    days.push({
      label: i === 0 ? '今天' : `${mm}/${dd}`,
      value: `${d.getFullYear()}-${mm}-${dd}`,
    })
  }
  return days
}
const dates = nextDays(7)

// —— 详情与下单 ——
const detail = ref<ServiceItem | null>(null)
const pickedDate = ref('')
const paid = ref(false)

function openDetail(s: ServiceItem) {
  detail.value = s
  pickedDate.value = dates[0].value
  paid.value = false
}

function submitOrder() {
  if (!detail.value) return
  orders.placeOrder({
    serviceId: detail.value.id,
    serviceName: detail.value.name,
    date: pickedDate.value,
    price: detail.value.price,
  })
  paid.value = true
  ui.toast('订单已提交，模拟支付成功', 'success')
}

function closeDetail() {
  detail.value = null
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: '待支付', cls: 'bg-amber/10 text-amber' },
  paid: { label: '已支付', cls: 'bg-brand-50 text-brand-600' },
  done: { label: '已完成', cls: 'bg-forest/10 text-forest' },
}
</script>

<template>
  <div class="min-h-screen pb-28">
    <header class="sticky top-0 z-30 flex items-center gap-3 bg-paper/80 px-4 py-3 backdrop-blur">
      <button class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card" @click="router.back()">
        <Icon name="arrow-left" :size="20" />
      </button>
      <h1 class="text-base font-bold text-ink">服务预订</h1>
    </header>

    <main class="space-y-4 px-5 pt-2">
      <!-- 套餐 / 我的订单 -->
      <div class="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 shadow-card">
        <button
          v-for="t in [{ k: 'list', l: '套餐' }, { k: 'orders', l: '我的订单' }] as const"
          :key="t.k"
          class="rounded-xl py-2 text-sm font-medium transition"
          :class="tab === t.k ? 'bg-brand-600 text-white shadow-glow' : 'text-ink-soft'"
          @click="tab = t.k"
        >
          {{ t.l }}
        </button>
      </div>

      <!-- 套餐列表 -->
      <template v-if="tab === 'list'">
        <div class="flex gap-2">
          <button
            v-for="c in CATEGORIES"
            :key="c.key"
            class="chip transition"
            :class="category === c.key ? 'bg-brand-600 text-white' : 'bg-white text-ink-soft'"
            @click="category = c.key"
          >
            {{ c.label }}
          </button>
        </div>

        <div class="space-y-3">
          <button
            v-for="s in list"
            :key="s.id"
            class="tap card w-full overflow-hidden text-left"
            @click="openDetail(s)"
          >
            <div class="flex items-center gap-3 p-4">
              <span
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                :style="{ background: `linear-gradient(140deg,${s.cover.from},${s.cover.to})` }"
              >
                <Icon :name="s.category === 'stay' ? 'pin' : s.category === 'food' ? 'fire' : 'walking'" :size="24" class="text-white/90" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="chip bg-ink/5 text-ink-faint">{{ CATEGORY_LABEL[s.category] }}</span>
                  <span v-for="t in s.tags" :key="t" class="chip bg-brand-50 text-brand-600">{{ t }}</span>
                </span>
                <span class="mt-1.5 block truncate text-sm font-semibold text-ink">{{ s.name }}</span>
                <span class="mt-0.5 block truncate text-xs text-ink-faint">{{ s.desc }}</span>
              </span>
              <span class="shrink-0 text-right">
                <span class="num text-base font-bold text-brand-700">¥{{ s.price }}</span>
                <span class="block text-[11px] text-ink-faint">{{ s.unit }}</span>
              </span>
            </div>
          </button>
        </div>

        <p class="pt-2 text-center text-[11px] text-ink-faint">演示数据 · 不接入真实支付与库存</p>
      </template>

      <!-- 我的订单 -->
      <template v-else>
        <div v-if="!orders.sorted.length" class="card flex flex-col items-center gap-2 py-14 text-center">
          <Icon name="ticket" :size="36" class="text-ink-faint/50" />
          <p class="text-sm text-ink-faint">还没有订单，去挑一个套餐吧</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="o in orders.sorted" :key="o.id" class="card p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-ink">{{ o.serviceName }}</p>
                <p class="mt-0.5 text-xs text-ink-faint">{{ o.date }} · 订单号 {{ o.id.toUpperCase() }}</p>
              </div>
              <span class="chip" :class="STATUS[o.status].cls">{{ STATUS[o.status].label }}</span>
            </div>
            <div class="mt-3 flex items-center justify-between border-t border-ink/5 pt-3">
              <span class="num text-sm font-bold text-brand-700">¥{{ o.price }}</span>
              <button
                v-if="o.status === 'pending'"
                class="btn-ghost !rounded-full !px-3 !py-1.5 text-xs"
                @click="orders.markPaid(o.id); ui.toast('模拟支付成功', 'success')"
              >
                去支付
              </button>
              <span v-else class="text-xs text-ink-faint">已提交，凭订单号到店核销</span>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- 套餐详情 / 下单 -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="detail" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm" @click.self="closeDetail">
          <div class="safe-bottom w-full max-w-md rounded-t-3xl bg-white">
            <div class="relative overflow-hidden rounded-t-3xl px-6 pb-5 pt-6 text-white" :style="{ background: `linear-gradient(140deg,${detail.cover.from},${detail.cover.to})` }">
              <button class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white" @click="closeDetail">
                <Icon name="close" :size="18" />
              </button>
              <p class="text-xs text-white/75">{{ CATEGORY_LABEL[detail.category] }}</p>
              <h2 class="mt-1 text-xl font-bold">{{ detail.name }}</h2>
              <p class="mt-0.5 text-sm text-white/85">{{ detail.desc }}</p>
              <div class="mt-2 flex items-baseline gap-1">
                <span class="num text-2xl font-bold">¥{{ detail.price }}</span>
                <span class="text-xs text-white/75">{{ detail.unit }}</span>
              </div>
            </div>

            <div class="px-6 pb-6">
              <!-- 包含项 -->
              <div class="mt-4">
                <p class="text-sm font-semibold text-ink">包含内容</p>
                <ul class="mt-2 grid grid-cols-1 gap-1.5">
                  <li v-for="inc in detail.includes" :key="inc" class="flex items-center gap-2 text-sm text-ink-soft">
                    <Icon name="check" :size="15" class="text-forest" />
                    {{ inc }}
                  </li>
                </ul>
              </div>

              <!-- 日期选择 -->
              <div class="mt-4">
                <p class="text-sm font-semibold text-ink">选择日期</p>
                <div class="mt-2 flex gap-2 overflow-x-auto">
                  <button
                    v-for="d in dates"
                    :key="d.value"
                    class="shrink-0 rounded-xl border px-3 py-2 text-center transition"
                    :class="pickedDate === d.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink/10 text-ink-soft'"
                    @click="pickedDate = d.value"
                  >
                    <span class="block text-xs font-medium">{{ d.label }}</span>
                  </button>
                </div>
              </div>

              <button class="btn-primary mt-5 w-full py-4" @click="submitOrder">提交订单 ¥{{ detail.price }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 支付成功 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="paid" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-8 backdrop-blur-sm" @click.self="paid = false">
          <div class="w-full max-w-xs animate-medal-pop rounded-3xl bg-white p-7 text-center shadow-lift">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest">
              <Icon name="check" :size="34" :stroke="2.5" />
            </div>
            <h3 class="mt-4 text-lg font-bold text-ink">模拟支付成功</h3>
            <p class="mt-1 text-sm text-ink-soft">订单已提交，可在「我的订单」查看</p>
            <div class="mt-5 flex gap-2">
              <button class="btn-ghost flex-1" @click="paid = false">继续逛逛</button>
              <button class="btn-primary flex-1" @click="paid = false; closeDetail(); tab = 'orders'">查看订单</button>
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
