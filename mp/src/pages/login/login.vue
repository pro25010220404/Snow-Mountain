<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Icon from '@/components/Icon.vue'
import { replace } from '@/utils/nav'
import { useUserStore } from '@/stores/user'
import { useAchievementsStore } from '@/stores/achievements'

const user = useUserStore()
const achievements = useAchievementsStore()

const nickname = ref('')
const agreed = ref(true)
const heart = ref(false)
let redirect = '/explore'

onLoad((q) => {
  if (q && q.redirect) redirect = q.redirect as string
})

function enter() {
  user.mockLogin()
  if (nickname.value.trim()) user.setProfile({ nickname: nickname.value.trim() })
  user.setGrants({ motion: true, location: true, heart: heart.value })
  // 静默初始化成就进度（不弹窗）
  achievements.evaluate(true)
  replace(redirect)
}
</script>

<template>
  <view class="flex min-h-screen flex-col">
    <!-- 顶部山景 -->
    <view class="relative flex-1 overflow-hidden bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500">
      <view class="safe-top relative z-10 px-8 pt-6 text-white">
        <view class="flex items-center gap-2 text-sm font-medium text-white/80">
          <view class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
            <Icon name="mountain" :size="17" color="white" :opacity="0.8" />
          </view>
          西岭雪山 · 官方认证探索伙伴
        </view>
        <view class="mt-4 text-3xl font-bold leading-tight tracking-wide">轻康养</view>
        <view class="text-3xl font-bold leading-tight tracking-wide">探索者</view>
        <view class="mt-3 text-sm text-white/85">把运动康养，玩成一场四季探索游戏</view>

        <view class="mt-6 flex gap-2">
          <view class="chip bg-white/15 text-white">成就系统</view>
          <view class="chip bg-white/15 text-white">AR 打卡</view>
          <view class="chip bg-white/15 text-white">好友 PK</view>
        </view>
      </view>
    </view>

    <!-- 底部登录卡 -->
    <view class="safe-bottom relative -mt-6 rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-[0_-8px_30px_-12px_rgba(22,48,46,.25)]">
      <view class="flex items-center gap-3">
        <view class="chip bg-brand-50 text-brand-700">演示账号</view>
        <view class="flex-1" />
        <view class="text-xs text-ink-faint">本地数据 · 无需注册</view>
      </view>

      <view class="mt-4">
        <view class="text-xs font-medium text-ink-soft">昵称</view>
        <view class="mt-1.5 flex items-center gap-2 rounded-2xl border border-ink/10 bg-paper px-4 py-3">
          <Icon name="user" :size="18" color="inkFaint" />
          <input
            v-model="nickname"
            type="text"
            placeholder="山野旅人"
            maxlength="12"
            class="w-full bg-transparent text-sm outline-none"
          />
        </view>
      </view>

      <!-- 授权 -->
      <view class="mt-4 rounded-2xl border border-ink/10 p-4">
        <view class="flex items-center justify-between py-1.5">
          <view class="text-sm text-ink-soft">运动数据</view>
          <view class="chip bg-forest/10 text-forest">已开启</view>
        </view>
        <view class="flex items-center justify-between py-1.5">
          <view class="text-sm text-ink-soft">定位数据</view>
          <view class="chip bg-forest/10 text-forest">已开启</view>
        </view>
        <view class="flex items-center justify-between py-1.5">
          <view class="text-sm text-ink-soft">心率等敏感数据</view>
          <view class="relative h-6 w-11 rounded-full" :class="heart ? 'bg-brand-500' : 'bg-ink/15'" @click="heart = !heart">
            <view class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" :class="heart ? 'left-[22px]' : 'left-0.5'" />
          </view>
        </view>
        <view class="mt-1 text-[11px] leading-relaxed text-ink-faint">敏感数据默认关闭，仅用于运动记录与健康生活方式，不涉及任何医疗用途。</view>
      </view>

      <view class="btn-primary mt-5 w-full py-4 text-base" @click="enter">开始探索</view>

      <view class="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-faint">
        <view class="mt-0.5" @click="agreed = !agreed">
          <Icon :name="agreed ? 'check' : 'dot'" :size="14" :color="agreed ? 'brand500' : 'ink'" :opacity="agreed ? 1 : 0.2" />
        </view>
        <text>登录即表示同意《隐私政策》与《用户协议》，我们承诺不展示任何校名、校徽等身份信息。</text>
      </view>
    </view>
  </view>
</template>
