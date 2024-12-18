import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/control/ControladorVistas.vue')
  },
  {
    path: '/control',
    name: 'control',
    component: () => import('../views/produccion/VistaControlada.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
