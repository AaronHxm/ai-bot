<template>
  <div class="chat-container">
    <!-- 使用SDK的View组件，并通过插槽自定义各个部分 -->
    <View
      :showSider="true"
      :contentProps="{
        hideMessageAction: false,
        hideEditSource: false,
        showDebug: false,
        showReferenceImgs: true,
        showTip: true,
      }"
    >
      <!-- 自定义会话列表头部 -->
      <template #SessionList_header="{ toggleOpen }">
        <div class="custom-session-header">
          <h2>消息列表</h2>
          <button @click="toggleOpen" class="toggle-btn">
            {{ open ? "收起" : "展开" }}
          </button>
        </div>
      </template>

      <!-- 自定义会话列表内容 -->
      <template
        #SessionList_body="{
          recentData,
          oldData,
          onEditConfirm,
          onDeleteSession,
        }"
      >
        <div class="custom-session-list">
          <div class="time-section">
            <h3>今天</h3>
            <div
              v-for="(item, index) in recentData"
              :key="'recent-' + index"
              class="session-item"
            >
              <div class="session-content">
                <p class="session-preview">{{ item.preview || "新会话" }}</p>
                <span class="session-time">{{ formatTime(item.time) }}</span>
              </div>
              <div class="session-actions">
                <button class="action-btn" @click="handleSessionAction(item)">
                  ⋮
                </button>
              </div>
            </div>
          </div>

          <div class="time-section">
            <h3>更早</h3>
            <div
              v-for="(item, index) in oldData"
              :key="'old-' + index"
              class="session-item"
            >
              <div class="session-content">
                <p class="session-preview">{{ item.preview || "历史会话" }}</p>
                <span class="session-time">{{ formatTime(item.time) }}</span>
              </div>
              <div class="session-actions">
                <button class="action-btn" @click="handleSessionAction(item)">
                  ⋮
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 自定义聊天开始页面 -->
      <template #ChatBegin_default="{ send, config }">
        <div class="welcome-screen">
          <div class="welcome-header">
            <div class="coherent-logo">
              <img :src="coherentLogo" alt="coherent-logo" />
            </div>
          </div>

          <div class="welcome-box">
            <div class="welcome-message">
              <div>
                <span>Hi~我是coherent公司的AI聊天助手</span>
                <span>有什么问题随时问我吧～</span>
              </div>
              <img :src="robot" alt="robot" />
            </div>

            <div class="services-section">
              <span class="service-btn">我能为您提供多种服务</span>
              <p class="service-desc">
                如果您有产品咨询、打样申请、报价、联系方式等方面的相关需求，
                我会快速为您回应，同时为了更精准的服务您，可能会请您填写简单的问询表单，感谢您的支持~
              </p>
            </div>
          </div>

          <div class="example-questions">
            <h3>试一试:</h3>
            <div
              v-for="(question, index) in exampleQuestions"
              :key="index"
              class="question-item"
              @click="send(question)"
            >
              <div class="question-icon">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1.2 6C1.2 3.34903 3.34903 1.2 6 1.2C8.65097 1.2 10.8 3.34903 10.8 6C10.8 8.65097 8.65097 10.8 6 10.8C3.34903 10.8 1.2 8.65097 1.2 6Z"
                    stroke="#0032FF"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
              <span class="question-text">{{ question }}</span>
              <span class="arrow-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 8H12"
                    stroke="#646464"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 4L12 8L8 12"
                    stroke="#646464"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- 自定义用户消息内容 -->
      <template #ChatContent_userContent="{ content }">
        <div class="custom-user-message">
          <div class="message-bubble">
            {{ content }}
          </div>
        </div>
      </template>

      <!-- 自定义消息底部操作 -->
      <template #ChatContent_bottomActions="{ copy, voteType, feedback }">
        <div class="custom-message-actions">
          <button @click="copy" class="action-btn">复制</button>
          <button
            @click="() => feedback('like')"
            :class="['action-btn', voteType === 'like' ? 'active' : '']"
          >
            👍
          </button>
          <button
            @click="() => feedback('dislike')"
            :class="['action-btn', voteType === 'dislike' ? 'active' : '']"
          >
            👎
          </button>
        </div>
      </template>

      <!-- 自定义输入区域 -->
      <template #ChatInput_input="{ send, loading }">
        <div class="custom-input-area">
          <input
            v-model="userInput"
            type="text"
            placeholder="请输入您的问题"
            :disabled="loading"
            @keyup.enter="handleSend(send)"
            class="message-input"
          />
          <button
            @click="handleSend(send)"
            :disabled="loading || !userInput.trim()"
            class="send-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M2.90909 21L21.5455 12L2.90909 3L3 10.3636L15.5455 12L3 13.6364L2.90909 21Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </template>

      <!-- 自定义新建聊天按钮 -->
      <template #ChatInput_newChat="{ onNewSession }">
        <button class="new-chat-button" @click="onNewSession">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M4 10H16"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </template>
    </View>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { View } from "@custouch-open/zenative-chat-sdk-web";
import "@custouch-open/zenative-chat-sdk-web/style";
import coherentLogo from "../assets/coherent-logo-blue.png";
import robot from "../assets/robot.png";

const userInput = ref("");
const open = ref(true);

const exampleQuestions = [
  "推荐一款用于平板显示的激光器",
  "我想申请打样",
  "怎么联系你们的销售人员?",
];

const handleSend = (sendFunction) => {
  if (userInput.value.trim()) {
    sendFunction(userInput.value);
    userInput.value = "";
  }
};

const handleSessionAction = (session) => {
  // 处理会话操作（重命名、删除等）
  console.log("Session action:", session);
};

const formatTime = (time) => {
  if (!time) return "刚刚";
  return new Date(time).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.chat-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 自定义会话列表头部 */
.custom-session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: linear-gradient(0deg, #333333, #333333), rgba(179, 179, 179, 0.82);
  background-blend-mode: color-dodge, normal;
  backdrop-filter: blur(25px);
  border-bottom: 0.25px solid #d5d5d5;
}

.custom-session-header h2 {
  margin: 0;
  font-size: 18px;
  color: #000000;
  font-weight: 500;
}

.toggle-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* 自定义会话列表 */
.custom-session-list {
  padding: 15px;
}

.time-section {
  margin-bottom: 20px;
}

.time-section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: #ffffff;
}

.session-item:hover {
  background-color: #f0f0f0;
}

.session-content {
  flex: 1;
}

.session-preview {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-time {
  font-size: 12px;
  color: #999;
}

.session-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.session-item:hover .session-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
}

/* 欢迎界面样式 */
.welcome-screen {
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.welcome-header {
  margin-bottom: 20px;
}

.coherent-logo {
  font-size: 24px;
  font-weight: bold;
  color: #0032ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;

  > img {
    width: 90px;
    height: 18px;
  }
}

.welcome-box {
  width: 343px;
  height: 207px;
  background: linear-gradient(
    92.9deg,
    rgba(0, 50, 255, 0.15) 0%,
    rgba(43, 145, 255, 0.15) 47.61%,
    rgba(85, 240, 255, 0.15) 95.22%
  );
  border-radius: 16px;
  overflow: hidden;
}

.welcome-message {
  margin-bottom: 25px;
  display: flex;

  > img {
    width: 135px;
  }
}

.welcome-message p {
  margin: 5px 0;
  color: #646464;
  font-size: 12px;
  line-height: 20px;
}

.welcome-message p:last-child {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
}

.services-section {
  background-color: #fff;
  border-radius: 16px;
  height: 92px;
  padding: 15px;
  backdrop-filter: blur(6px);
  position: relative;
  margin-top: -30px;
}

.service-btn {
  position: absolute;
  top: -36px;
  left: 30px;
  background: #0032ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px 6px 0px 0px;
  font-weight: 500;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
}

.service-desc {
  font-size: 12px;
  color: #646464;
  line-height: 20px;
  margin: 0;
}

.example-questions {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.example-questions h3 {
  margin-bottom: 15px;
  color: rgba(100, 100, 100, 0.8);
  font-size: 12px;
  font-weight: 400;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 9px 8px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 6px;
}

.question-item:hover {
  background-color: #f0f0f0;
}

.question-icon {
  display: flex;
  align-items: center;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #000000;
  line-height: 22px;
  text-align: left;
}

.arrow-icon {
  display: flex;
  align-items: center;
}

/* 自定义用户消息 */
.custom-user-message {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  width: 100%;
}

.message-bubble {
  background: #e3f2fd;
  border-radius: 12px;
  padding: 12px 16px;
  max-width: 70%;
  word-wrap: break-word;
}

/* 自定义消息操作 */
.custom-message-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.custom-message-actions .action-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  opacity: 1;
}

.custom-message-actions .action-btn.active {
  background-color: #e3f2fd;
  border-color: #1976d2;
}

/* 自定义输入区域 */
.custom-input-area {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 9px 14px;
  border: 1.5px solid #0032ff;
  border-radius: 8px;
  outline: none;
  font-size: 13px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
}

.message-input:focus {
  border-color: #0032ff;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(127.01deg, #55f0ff 12.69%, #0032ff 85.34%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0px 8px 20px rgba(15, 22, 41, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 新建聊天按钮 */
.new-chat-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 背景效果 */
:deep(.chat-content) {
  background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 30%),
    linear-gradient(
      133.21deg,
      rgba(0, 50, 255, 0.1) 0%,
      rgba(62, 121, 239, 0.1) 28.05%,
      rgba(85, 240, 255, 0.1) 63.9%
    );
  position: relative;
}

:deep(.chat-content)::before {
  content: "";
  position: absolute;
  width: 310px;
  height: 310px;
  left: -71px;
  top: -90px;
  background: #55f0ff;
  opacity: 0.2;
  filter: blur(60px);
  pointer-events: none;
}

:deep(.chat-content)::after {
  content: "";
  position: absolute;
  width: 310px;
  height: 310px;
  left: 136px;
  top: -95px;
  background: #0032ff;
  opacity: 0.1;
  filter: blur(60px);
  pointer-events: none;
}
</style>
