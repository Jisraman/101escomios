import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    name: 'inicio',
    component: () => import('../views/produccion/InicioLogo.vue')
  },
  {
    path: '/tablero',
    name: 'tablero',
    component: () => import('../views/produccion/TableroPreguntas.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
