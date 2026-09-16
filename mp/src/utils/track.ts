import type { TrackPoint } from '@/types'

// 确定性生成一条蜿蜒轨迹（无随机数，保证演示与回放稳定）
export function makeTrack(seed: number, n = 26): TrackPoint[] {
  const pts: TrackPoint[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const x = 8 + t * 84
    const y =
      40 +
      Math.sin(t * Math.PI * (2 + (seed % 3)) + seed) * 16 +
      Math.sin(t * Math.PI * 7) * 3
    pts.push({ x: +x.toFixed(1), y: +y.toFixed(1) })
  }
  return pts
}

// 生成一个 6 位数字点位码（模拟景区点位二维码）
export function genPointCode(): string {
  let code = ''
  const chars = '0123456789'
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * chars.length)
    code += chars[idx]
  }
  return code
}

export function todayStr(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
