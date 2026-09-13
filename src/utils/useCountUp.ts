import { ref, watch, onUnmounted } from 'vue'

// 数字滚动动画：从旧值平滑过渡到新值
export function useCountUp(
  target: () => number,
  opts: { duration?: number; decimals?: number } = {},
) {
  const { duration = 700, decimals = 0 } = opts
  const display = ref(0)
  let raf = 0

  function animate(from: number, to: number) {
    cancelAnimationFrame(raf)
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const raw = from + (to - from) * eased
      display.value = decimals > 0 ? +raw.toFixed(decimals) : Math.round(raw)
      if (t < 1) raf = requestAnimationFrame(tick)
      else display.value = decimals > 0 ? +to.toFixed(decimals) : Math.round(to)
    }
    raf = requestAnimationFrame(tick)
  }

  watch(target, (to, from) => animate(from ?? 0, to), { immediate: true })

  onUnmounted(() => cancelAnimationFrame(raf))

  return display
}
