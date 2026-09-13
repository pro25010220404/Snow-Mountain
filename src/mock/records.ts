import type { ExerciseRecord, TrackPoint } from '@/types'

// 确定性生成一条蜿蜒轨迹（无随机数，保证演示稳定）
function makeTrack(seed: number, n = 26): TrackPoint[] {
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

// 演示用种子运动记录（真实运行后可被"开始记录"追加覆盖）
export const SEED_RECORDS: ExerciseRecord[] = [
  {
    id: 'r-0912',
    date: '2026-09-12',
    steps: 12800,
    distanceKm: 6.2,
    durationMin: 135,
    track: makeTrack(2),
    passedPoints: [
      { name: '杜鹃林入口', checked: true },
      { name: '云海观景台', checked: true },
      { name: '高山草甸', checked: false },
    ],
  },
  {
    id: 'r-0911',
    date: '2026-09-11',
    steps: 9800,
    distanceKm: 4.1,
    durationMin: 96,
    track: makeTrack(5),
    passedPoints: [
      { name: '森林步道口', checked: true },
      { name: '瀑布氧吧', checked: true },
    ],
  },
  {
    id: 'r-0910',
    date: '2026-09-10',
    steps: 4500,
    distanceKm: 2.0,
    durationMin: 48,
    track: makeTrack(8),
    passedPoints: [{ name: '红叶步道', checked: true }],
  },
  {
    id: 'r-0908',
    date: '2026-09-08',
    steps: 7600,
    distanceKm: 3.5,
    durationMin: 80,
    track: makeTrack(11),
    passedPoints: [
      { name: '初级雪道口', checked: true },
      { name: '中级缆车站', checked: true },
    ],
  },
]
