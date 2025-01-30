import Vue from 'vue'
import VueRouter from 'vue-router'

import SignUp from './components/SignUp'
import DashBoard from './components/DashBoard'

Vue.use(VueRouter)

const routes1 = [
  {
    path: '/',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: DashBoard
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes1
})

export default router