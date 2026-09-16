import { ref, watch, onUnmounted } from 'vue'

// 数字滚动动画：从旧值平滑过渡到新值（小程序无 requestAnimationFrame，用 setInterval 兜底）
export function useCountUp(
  target: () => number,
  opts: { duration?: number; decimals?: number } = {},
) {
  const { duration = 700, decimals = 0 } = opts
  const display = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  function animate(from: number, to: number) {
    if (timer) clearInterval(timer)
    const start = Date.now()
    timer = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const raw = from + (to - from) * eased
      display.value = decimals > 0 ? +raw.toFixed(decimals) : Math.round(raw)
      if (t >= 1) {
        display.value = decimals > 0 ? +to.toFixed(decimals) : Math.round(to)
        if (timer) clearInterval(timer)
        timer = undefined
      }
    }, 16)
  }

  watch(target, (to, from) => animate(from ?? 0, to), { immediate: true })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return display
}
