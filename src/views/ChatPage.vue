<!-- ChatPage.vue -->
<template>
  <div class="page-container">
    <header class="page-header">
      <h1>Coherent智能机器人</h1>
      <button @click="toggleTheme">切换主题</button>
    </header>
    
    <main class="page-main">
      <View 
        :showSider="showSidebar" 
        :contentProps="{
          hideMessageAction: false,
          showReferenceImgs: true,
          showTip: true
        }"
      >
        <!-- 自定义会话列表头部 -->
        <template #SessionList_header="{ toggleOpen }">
          <div class="custom-header">
            <h2>会话列表</h2>
            <button class="toggle-btn" @click="toggleOpen">
              {{ sidebarOpen ? '收起' : '展开' }}
            </button>
          </div>
        </template>

        <!-- 自定义聊天开始页面 -->
        <template #ChatBegin_default="{ send, config }">
          <div class="custom-chat-begin">
            <div class="welcome-section">
              <h3>欢迎使用{{ config?.name   }}</h3>
              <p>{{config?.personalizationSettings?.introduction?.content }}</p>
            </div>
            <div class="quick-questions">
              <button v-for="question in config?.personalizationSettings?.begin?.questions?.list" :key="question"
                      class="quick-question-btn" @click="send(question)">
                {{ question }}
              </button>
            </div>
          </div>
        </template>

        <!-- 自定义用户消息显示 -->
        <template #ChatContent_userContent="{ content }">
          <div class="custom-user-content">
            <div class="user-avatar">
              <span>用户</span>
            </div>
            <div class="message-content">{{ content }}</div>
          </div>
        </template>

        <!-- 自定义空状态页面 -->
        <template #ChatContent_empty>
          <div class="custom-empty-state">
            <div class="empty-icon">💬</div>
            <p>还没有聊天记录，开始您的第一个对话吧！</p>
            <button class="start-btn" @click="startNewChat">开始新对话</button>
          </div>
        </template>

        <!-- 自定义推荐问题 -->
        <template #ChatContent_questions="{ questions, onClick }">
          <div class="custom-recommended-questions">
            <h4>您可能想了解：</h4>
            <div class="questions-grid">
              <button v-for="(question, index) in questions" :key="index"
                      class="recommended-question-btn" @click="onClick(question)">
                {{ question }}
              </button>
            </div>
          </div>
        </template>

        <!-- 自定义消息底部操作 -->
        <template #ChatContent_bottomActions="{ copy, voteType, feedback }">
          <div class="custom-bottom-actions">
            <button class="action-btn" @click="copy">复制</button>
            <button class="action-btn" :class="{ active: voteType === 'like' }"
                    @click="feedback('like')">👍 有帮助</button>
            <button class="action-btn" :class="{ active: voteType === 'dislike' }"
                    @click="feedback('dislike')">👎 需改进</button>
          </div>
        </template>

        <!-- 自定义新建聊天按钮 -->
        <template #ChatInput_newChat="{ onNewSession }">
          <button class="new-chat-btn" @click="onNewSession">
            + 新建对话
          </button>
        </template>
      </View>
    </main>
  </div>
</template>

<script setup>
import { View } from "@custouch-open/zenative-chat-sdk-web"
import "@custouch-open/zenative-chat-sdk-web/style"
import { ref } from 'vue'
// 在插槽中获取数据后，可以存储到 ref 中供其他部分使用
const handleConfigData = (config) => {
  botConfig.value = config
  console.log('Introduction:', config.introduction)
  console.log('个性化设置:', config.personalizationSettings)
}
const showSidebar = ref(true)
const sidebarOpen = ref(true)
const isDarkTheme = ref(false)

 console.log("config")

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.documentElement.setAttribute(
    'data-theme', 
    isDarkTheme.value ? 'dark' : 'light'
  )
}

// 开始新对话
const startNewChat = () => {
  console.log('开始新对话')
}
</script>

<style>
:root {
  /* 从接口获取的样式变量 */
  --primary-color: #396cd9; /* --primary: 57 108 237 */
  --user-bubble-bg: #c3dbfb; /* --user-bubble: 195 219 251 */
  --user-bubble-text: #131b33; /* --user-bubble-text: 19 27 51 */
  --border-radius: 8px; /* --radius: 8px */
  --base-font-size: 16px; /* --font-size: 16px */
  
  /* 基础样式变量 */
  --bg-color: #fff;
  --text-color: #333;
  --border-color: #ddd;
  --hover-bg: #f5f5f5;
  --dark-hover-bg: #333;
  --light-gray: #f8f9fa;
  --dark-light-gray: #2d2d2d;
}

[data-theme="dark"] {
  --primary-color: #90caf9;
  --user-bubble-bg: #2a3b58;
  --user-bubble-text: #e0e7ff;
  --bg-color: #1e1e1e;
  --text-color: #fff;
  --border-color: #444;
  --hover-bg: #2a2a2a;
  --dark-hover-bg: #3a3a3a;
  --light-gray: #2d2d2d;
  --dark-light-gray: #3d3d3d;
}

.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  color: var(--text-color);
}

.page-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-main {
  flex: 1;
  overflow: hidden;
}

/* 自定义会话列表头部样式 */
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--light-gray);
  border-bottom: 1px solid var(--border-color);
  font-size: var(--base-font-size);
}

.custom-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}

.toggle-btn {
  padding: 6px 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--base-font-size);
}

/* 自定义聊天开始页面样式 */
.custom-chat-begin {
  padding: 40px 20px;
  text-align: center;
}

.welcome-section h3 {
  font-size: 24px;
  color: var(--text-color);
  margin-bottom: 10px;
}

.welcome-section p {
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 30px;
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.quick-question-btn {
  padding: 12px 16px;
  background-color: var(--light-gray);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  font-size: var(--base-font-size);
  color: var(--text-color);
}

.quick-question-btn:hover {
  background-color: var(--hover-bg);
  border-color: var(--primary-color);
}

/* 自定义用户消息显示样式 */
.custom-user-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

/* 用户消息气泡样式 */
.custom-user-content .message-content {
  padding: 10px 14px;
  background-color: var(--user-bubble-bg);
  color: var(--user-bubble-text);
  border-radius: var(--border-radius);
  max-width: 80%;
  word-wrap: break-word;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--base-font-size) - 4px);
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  word-wrap: break-word;
}

/* 自定义空状态页面样式 */
.custom-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-color);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.custom-empty-state p {
  font-size: 16px;
  margin-bottom: 20px;
}

.start-btn {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--base-font-size);
}

.start-btn:hover {
  opacity: 0.9;
}

/* 自定义推荐问题样式 */
.custom-recommended-questions {
  padding: 16px;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  margin-top: 16px;
}

.custom-recommended-questions h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-color);
}

.questions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recommended-question-btn {
  padding: 6px 12px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: calc(var(--base-font-size) - 2px);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.recommended-question-btn:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 自定义消息底部操作样式 */
.custom-bottom-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  padding: 4px 8px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: calc(var(--base-font-size) - 2px);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: var(--hover-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 自定义新建聊天按钮样式 */
.new-chat-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: opacity 0.3s;
  font-size: var(--base-font-size);
}

.new-chat-btn:hover {
  opacity: 0.9;
}
</style>