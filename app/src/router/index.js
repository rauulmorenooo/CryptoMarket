import Vue from 'vue'
import VueRouter from 'vue-router'

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
    component: () => import('../views/Register.vue')
  },
  {
    path: '/user/',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
