import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router, { resolvePromise } from './router'
import { init } from "@custouch-open/zenative-chat-sdk-web"
// 导入Element Plus和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 使用Element Plus
app.use(ElementPlus)

// 初始化聊天SDK
// 根据SDK文档要求：必须在项目入口文件中调用，且在View组件调用前完成
// 从环境变量读取配置
const apiKey = import.meta.env.VITE_ZENATIVE_API_KEY || 'your-api-key';
const env = import.meta.env.VITE_ZENATIVE_ENV || 'production';

// 根据环境选择对应的API基础URL
// 优先使用手动覆盖的URL（如果设置了）
let apiUrl = import.meta.env.VITE_ZENATIVE_API_URL;

// 如果没有手动覆盖，则根据当前环境选择对应的URL
if (!apiUrl) {
    switch (env) {
        case 'beta':
            apiUrl = import.meta.env.VITE_ZENATIVE_API_URL_BETA;
            break;
        case 'staging':
            apiUrl = import.meta.env.VITE_ZENATIVE_API_URL_STAGING;
            break;
        case 'production':
        default:
            apiUrl = import.meta.env.VITE_ZENATIVE_API_URL_PRODUCTION;
            break;
    }
}

init({
    // API密钥，从环境变量中读取
    apiKey: "6bd4ec03566846b492aa38b333ecad7c",
    // 环境配置，从环境变量中读取
    env: env,
    // API基础URL配置
    baseUrl: apiUrl,
    // Vue应用实例
    app: app
}).then(({ isSuccess }) => {
    if (isSuccess) {
        console.log('Zenative Chat SDK 初始化成功')
        // 触发初始化成功的方法
       resolvePromise()
    } else {
        console.log('Zenative Chat SDK 初始化失败')
    }
})

// 挂载应用
app.mount('#app')
