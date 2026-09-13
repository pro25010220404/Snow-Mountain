import type { LeaderboardEntry } from '@/types'

// 三榜 mock 数据（demo 用，无真实后端）
const AVATARS = ['#4A8B84', '#C97B3D', '#6E93B8', '#6FA55A', '#A981C9', '#C9675B']

function mk(nickname: string, value: number, idx: number): LeaderboardEntry {
  return { id: 'u' + idx, nickname, avatar: AVATARS[idx % AVATARS.length], value }
}

export const WEEK_RANK: LeaderboardEntry[] = [
  mk('山风', 18.2, 0),
  mk('林间', 15.6, 1),
  mk('雪豹', 12.3, 2),
  mk('青禾', 11.8, 3),
  mk('阿泽', 9.4, 4),
  mk('小鱼', 8.7, 5),
  mk('远山', 7.2, 6),
  mk('一苇', 6.5, 7),
  { id: 'me', nickname: '我', avatar: '#2F5D5A', value: 6.2, isMe: true },
  mk('沐野', 5.9, 9),
  mk('陈皮', 5.1, 10),
  mk('晚风', 4.6, 11),
]

export const MONTH_RANK: LeaderboardEntry[] = [
  mk('雪豹', 86.4, 0),
  mk('山风', 79.1, 1),
  mk('林间', 72.5, 2),
  mk('青禾', 65.8, 3),
  { id: 'me', nickname: '我', avatar: '#2F5D5A', value: 52.3, isMe: true },
  mk('远山', 48.6, 5),
  mk('阿泽', 45.2, 6),
  mk('一苇', 41.7, 7),
  mk('小鱼', 38.9, 8),
  mk('拾光', 33.4, 9),
  mk('沐野', 29.1, 10),
  mk('陈皮', 24.8, 11),
]

export const TOTAL_RANK: LeaderboardEntry[] = [
  mk('山风', 428.6, 0),
  mk('雪豹', 401.2, 1),
  mk('林间', 386.9, 2),
  mk('青禾', 352.4, 3),
  mk('远山', 318.5, 4),
  { id: 'me', nickname: '我', avatar: '#2F5D5A', value: 276.8, isMe: true },
  mk('阿泽', 254.1, 6),
  mk('一苇', 231.6, 7),
  mk('小鱼', 198.3, 8),
  mk('拾光', 172.5, 9),
  mk('沐野', 146.2, 10),
  mk('晚风', 121.7, 11),
]
