<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '@/components/Icon.vue'
import { useUserStore } from '@/stores/user'
import { useAchievementsStore } from '@/stores/achievements'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const achievements = useAchievementsStore()

const nickname = ref('')
const agreed = ref(true)
const heart = ref(false)

function enter() {
  user.mockLogin()
  if (nickname.value.trim()) user.setProfile({ nickname: nickname.value.trim() })
  user.setGrants({ motion: true, location: true, heart: heart.value })
  // 静默初始化成就进度（不弹窗）
  achievements.evaluate(true)
  const redirect = (route.query.redirect as string) || '/explore'
  router.replace(redirect)
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!-- 顶部山景 -->
    <div class="relative flex-1 overflow-hidden bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500">
      <svg
        viewBox="0 0 400 320"
        preserveAspectRatio="xMidYMax slice"
        class="absolute inset-0 h-full w-full"
      >
        <path d="M0 320 L70 168 L130 236 L205 96 L272 210 L340 140 L400 236 L400 320 Z" fill="#EAF3F6" opacity="0.9" />
        <path d="M0 320 L120 210 L180 268 L270 180 L340 250 L400 216 L400 320 Z" fill="#D6E6EC" opacity="0.95" />
        <path d="M0 320 L180 260 L260 300 L400 250 L400 320 Z" fill="#BFD3DB" />
      </svg>
      <div class="relative z-10 px-8 pt-16 text-white">
        <div class="flex items-center gap-2 text-sm font-medium text-white/80">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <Icon name="mountain" :size="17" />
          </span>
          西岭雪山 · 官方认证探索伙伴
        </div>
        <h1 class="mt-4 text-3xl font-bold leading-tight tracking-wide">轻康养<br />探索者</h1>
        <p class="mt-3 text-sm text-white/85">把运动康养，玩成一场四季探索游戏</p>

        <div class="mt-6 flex gap-2">
          <span class="chip bg-white/15 text-white backdrop-blur">成就系统</span>
          <span class="chip bg-white/15 text-white backdrop-blur">AR 打卡</span>
          <span class="chip bg-white/15 text-white backdrop-blur">好友 PK</span>
        </div>
      </div>
    </div>

    <!-- 底部登录卡 -->
    <div class="safe-bottom relative -mt-6 rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-[0_-8px_30px_-12px_rgba(22,48,46,.25)]">
      <div class="flex items-center gap-3">
        <span class="chip bg-brand-50 text-brand-700">演示账号</span>
        <span class="flex-1" />
        <span class="text-xs text-ink-faint">本地数据 · 无需注册</span>
      </div>

      <div class="mt-4">
        <label class="text-xs font-medium text-ink-soft">昵称</label>
        <div class="mt-1.5 flex items-center gap-2 rounded-2xl border border-ink/10 bg-paper px-4 py-3 focus-within:border-brand-400">
          <Icon name="user" :size="18" class="text-ink-faint" />
          <input
            v-model="nickname"
            type="text"
            placeholder="山野旅人"
            maxlength="12"
            class="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint/60"
          />
        </div>
      </div>

      <!-- 授权 -->
      <div class="mt-4 rounded-2xl border border-ink/10 p-4">
        <div class="flex items-center justify-between py-1.5">
          <span class="text-sm text-ink-soft">运动数据</span>
          <span class="chip bg-forest/10 text-forest">已开启</span>
        </div>
        <div class="flex items-center justify-between py-1.5">
          <span class="text-sm text-ink-soft">定位数据</span>
          <span class="chip bg-forest/10 text-forest">已开启</span>
        </div>
        <div class="flex items-center justify-between py-1.5">
          <span class="text-sm text-ink-soft">心率等敏感数据</span>
          <button
            class="relative h-6 w-11 rounded-full transition"
            :class="heart ? 'bg-brand-500' : 'bg-ink/15'"
            @click="heart = !heart"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
              :class="heart ? 'left-[22px]' : 'left-0.5'"
            />
          </button>
        </div>
        <p class="mt-1 text-[11px] leading-relaxed text-ink-faint">敏感数据默认关闭，仅用于运动记录与健康生活方式，不涉及任何医疗用途。</p>
      </div>

      <button class="btn-primary mt-5 w-full py-4 text-base" @click="enter">
        开始探索
      </button>

      <div class="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-faint">
        <button class="mt-0.5 text-brand-500" @click="agreed = !agreed">
          <Icon :name="agreed ? 'check' : 'dot'" :size="14" :class="agreed ? 'text-brand-500' : 'text-ink/20'" />
        </button>
        <span>登录即表示同意《隐私政策》与《用户协议》，我们承诺不展示任何校名、校徽等身份信息。</span>
      </div>
    </div>
  </div>
</template>
