<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  // 登录守卫：已登录则直接进探索页，否则停在登录页
  const user = useUserStore()
  if (user.isLoggedIn) {
    uni.reLaunch({ url: '/pages/explore/explore' })
  }
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

page {
  background: #f7faf9;
  color: #16302e;
  -webkit-tap-highlight-color: transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei',
    'Segoe UI', sans-serif;
}

.card {
  @apply rounded-2xl bg-white shadow-card;
}
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold bg-brand-600 text-white shadow-glow;
}
.btn-ghost {
  @apply inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold border border-brand-200 bg-white text-brand-600;
}
.chip {
  @apply inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium;
}
.section-title {
  @apply text-[15px] font-bold tracking-wide text-ink;
}
.num {
  @apply font-num tabular-nums;
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
.safe-top {
  padding-top: calc(var(--status-bar-height, 0px) + 12px);
}
.tap {
  @apply transition;
}

.progress-shimmer {
  background-image: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 2.2s linear infinite;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: float-up 1.6s ease-out infinite;
}
</style>
