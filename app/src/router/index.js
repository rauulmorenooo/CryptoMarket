import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// import Login from '../views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  }, 
  {
    path: '/prices',
    name: 'Prices'
  },
  {
    path: '/ranking',
    name: 'Ranking',
  }, 
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }, 
  {
    path: '/register',
    name: 'Register',
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
