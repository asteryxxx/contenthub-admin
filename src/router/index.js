import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/login')
// 在vuecli中@表示的是src目录
// /index.vue可以省略这个，他自动就会去找

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
