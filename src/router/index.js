import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
const Login = () => import('@/views/login')
// 在vuecli中@表示的是src目录
// /index.vue可以省略这个，他自动就会去找
const Home = () => import('@/views/home')
const Layout = () => import('@/views/layout')
const Article = () => import('@/views/article')
const Publish = () => import('@/views/publish')
const Materials = () => import('@/views/materials')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由layout有一个默认子路由，这个名字没有意义要去掉
    // 如果有默认子路由，就去掉name属性
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空，会作为默认子路由
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/materials',
        name: 'materials',
        component: Materials
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// to:要去的路由信息
// from:来自哪个路由信息
// next:放行方法
router.beforeEach((to, from, next) => {
  // 开启顶部导航进度条特效
  NProgress.start()
  // 如果要访问的界面不是 /login，就校验登陆的状态
  // 如果没有登陆，就跳到登陆界面
  // 如果登陆了，则允许通过
  // next()放行
  const user = JSON.parse(localStorage.getItem('user'))
  // 校验非登陆界面的登陆状态
  if (to.path !== '/login') {
    if (user) {
      // 说明已经登陆了 通过
      next()
    } else {
      // 没有登陆跳登陆界面
      next('/login')
    }
  } else {
    // 登陆界面，正常放行
    next()
  }
})

router.afterEach((to, from) => {
  // 结束顶部的导航进度条
  NProgress.done()
})

export default router
