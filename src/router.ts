import { createRouter, createWebHistory } from 'vue-router' 
import ChatPage from './views/ChatPage.vue'

 

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/chat", component: ChatPage }
  ]
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