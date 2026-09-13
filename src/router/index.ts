import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/explore' },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/views/ExploreView.vue'),
      meta: { tab: true },
    },
    {
      path: '/explore/route/:id',
      name: 'route-detail',
      component: () => import('@/views/RouteDetailView.vue'),
    },
    {
      path: '/explore/ai',
      name: 'ai-recommend',
      component: () => import('@/views/AiRecommendView.vue'),
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('@/views/CheckinView.vue'),
      meta: { tab: true },
    },
    {
      path: '/checkin/:id',
      name: 'record-detail',
      component: () => import('@/views/RecordDetailView.vue'),
    },
    {
      path: '/checkin/ar',
      name: 'ar-checkin',
      component: () => import('@/views/ArCheckinView.vue'),
    },
    {
      path: '/achievement',
      name: 'achievement',
      component: () => import('@/views/AchievementView.vue'),
      meta: { tab: true },
    },
    { path: '/rank', name: 'rank', component: () => import('@/views/RankView.vue') },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { tab: true },
    },
    {
      path: '/profile/booking',
      name: 'booking',
      component: () => import('@/views/BookingView.vue'),
    },
    {
      path: '/profile/mall',
      name: 'mall',
      component: () => import('@/views/MallView.vue'),
    },
    {
      path: '/profile/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/explore' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const user = useUserStore()
  if (!to.meta.public && !user.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
