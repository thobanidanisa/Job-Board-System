import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { layout: 'public' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { layout: 'public', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: { layout: 'public', guestOnly: true },
  },
  {
    path: '/client/dashboard',
    name: 'client-dashboard',
    component: () => import('@/pages/client/ClientDashboardPage.vue'),
    meta: { layout: 'client', requiresAuth: true, role: 'client' },
  },
  {
    path: '/client/profile',
    name: 'client-profile',
    component: () => import('@/pages/client/ClientProfilePage.vue'),
    meta: { layout: 'client', requiresAuth: true, role: 'client' },
  },
  {
    path: '/employer/dashboard',
    name: 'employer-dashboard',
    component: () => import('@/pages/employer/EmployerDashboardPage.vue'),
    meta: { layout: 'employer', requiresAuth: true, role: 'employer' },
  },
  {
    path: '/employer/jobs',
    name: 'employer-jobs',
    component: () => import('@/pages/employer/MyJobsPage.vue'),
    meta: { layout: 'employer', requiresAuth: true, role: 'employer' },
  },
  {
    path: '/employer/jobs/new',
    name: 'employer-jobs-new',
    component: () => import('@/pages/employer/PostJobPage.vue'),
    meta: { layout: 'employer', requiresAuth: true, role: 'employer' },
  },
  {
    path: '/employer/jobs/:id/edit',
    name: 'employer-jobs-edit',
    component: () => import('@/pages/employer/EditJobPage.vue'),
    meta: { layout: 'employer', requiresAuth: true, role: 'employer' },
  },
  {
    path: '/employer/profile',
    name: 'employer-profile',
    component: () => import('@/pages/employer/CompanyProfilePage.vue'),
    meta: { layout: 'employer', requiresAuth: true, role: 'employer' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { layout: 'public' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Clears a persisted-but-expired token so an expired session can't slip
  // past the checks below on a hard refresh into a protected route.
  auth.checkSession()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'home' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: auth.dashboardPath }
  }

  return true
})

export default router
