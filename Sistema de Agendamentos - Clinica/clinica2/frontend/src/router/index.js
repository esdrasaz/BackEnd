import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',        component: () => import('../views/LoginView.vue'),        meta: { publica: true } },
  { path: '/registro',     component: () => import('../views/RegistroView.vue'),     meta: { publica: true } },
  { path: '/agendamentos', component: () => import('../views/AgendamentosView.vue'), meta: { requerLogin: true } },
  { path: '/agendamentos/novo', component: () => import('../views/NovoAgendamentoView.vue'), meta: { requerLogin: true } },
  { path: '/painel',       component: () => import('../views/PainelView.vue'),       meta: { requerLogin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.publica && token) return next('/agendamentos')
  if (to.meta.requerLogin && !token) return next('/login')
  next()
})

export default router
