import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ChatPage from './views/ChatPage.vue'

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 用于处理SDK初始化的Promise
let resolvePromise: (value: unknown) => void
let rejectPromise: (reason?: any) => void

export { resolvePromise, rejectPromise }

const agentInit = new Promise((resolve, reject) => {
  resolvePromise = resolve
  rejectPromise = reject
})

// 路由守卫，确保SDK初始化完成后再跳转
router.beforeEach(async (to) => {
  await agentInit
  return true
})

export default router