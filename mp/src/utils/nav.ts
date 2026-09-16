// 路由薄封装：把 H5 的路径映射到 uni-app 页面，替代 vue-router
type NavOptions = Record<string, string>

const TAB_PAGES = new Set([
  '/pages/explore/explore',
  '/pages/checkin/checkin',
  '/pages/achievement/achievement',
  '/pages/profile/profile',
])

// 路由表：正则 → 页面路径 + 路径参数名（group 对应）
const ROUTES: { re: RegExp; page: string; params?: string[] }[] = [
  { re: /^\/login$/, page: '/pages/login/login' },
  { re: /^\/explore$/, page: '/pages/explore/explore' },
  { re: /^\/explore\/route\/([\w-]+)$/, page: '/pages/route-detail/route-detail', params: ['id'] },
  { re: /^\/explore\/ai$/, page: '/pages/ai-recommend/ai-recommend' },
  { re: /^\/checkin$/, page: '/pages/checkin/checkin' },
  { re: /^\/checkin\/ar$/, page: '/pages/ar-checkin/ar-checkin' },
  { re: /^\/checkin\/([\w-]+)$/, page: '/pages/record-detail/record-detail', params: ['id'] },
  { re: /^\/achievement$/, page: '/pages/achievement/achievement' },
  { re: /^\/rank$/, page: '/pages/rank/rank' },
  { re: /^\/profile$/, page: '/pages/profile/profile' },
  { re: /^\/profile\/booking$/, page: '/pages/booking/booking' },
  { re: /^\/profile\/mall$/, page: '/pages/mall/mall' },
  { re: /^\/profile\/dashboard$/, page: '/pages/dashboard/dashboard' },
]

function parsePath(path: string): { pathname: string; query: NavOptions } {
  const [pathname, qs = ''] = path.split('?')
  const query: NavOptions = {}
  if (qs) {
    for (const kv of qs.split('&')) {
      const [k, v = ''] = kv.split('=')
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v)
    }
  }
  return { pathname, query }
}

function resolve(path: string): string | null {
  const { pathname, query } = parsePath(path)
  for (const r of ROUTES) {
    const m = pathname.match(r.re)
    if (m) {
      const q: NavOptions = { ...query }
      if (r.params) r.params.forEach((p, i) => (q[p] = m[i + 1]))
      const qs = Object.keys(q)
        .map((k) => `${k}=${encodeURIComponent(q[k])}`)
        .join('&')
      return qs ? `${r.page}?${qs}` : r.page
    }
  }
  return null
}

function isTab(url: string): boolean {
  return TAB_PAGES.has(url.split('?')[0])
}

export function push(path: string): void {
  const url = resolve(path)
  if (!url) return
  if (isTab(url)) uni.reLaunch({ url })
  else uni.navigateTo({ url })
}

export function replace(path: string): void {
  const url = resolve(path)
  if (!url) return
  if (isTab(url)) uni.reLaunch({ url })
  else uni.redirectTo({ url })
}

export function back(): void {
  const pages = getCurrentPages()
  if (pages.length > 1) uni.navigateBack()
  else uni.reLaunch({ url: '/pages/explore/explore' })
}
