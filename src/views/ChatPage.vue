<template>
  <div class="chat-container">
    <!-- 使用SDK的View组件，并通过插槽自定义各个部分 -->
    <View
        :showSider="siderOpen"
        :contentProps="{
        hideMessageAction: false,
        hideEditSource: false,
        showDebug: false,
        showReferenceImgs: true,
        showTip: true,
      }"
    >
      <!-- 自定义会话列表头部 -->
      <template #SessionList_header="{ toggleOpen, open }">
        <div class="custom-session-header">
          <h2 class="session-title">消息列表</h2>
          <el-button
              @click="toggleOpen"
              :icon="Close"
              size="small"
              text
              class="close-btn"
          />
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
        <div class="session-list-body">
          <!-- 今天会话 -->
          <div class="time-section" v-if="recentData && recentData.length > 0">
            <div class="time-label">今天</div>
            <div class="session-items">
              <div
                  v-for="item in recentData"
                  :key="item.id"
                  class="session-item"
                  @click="handleSessionClick(item)"
              >
                <div class="session-content">
                  {{ item.title || "未命名会话" }}
                </div>
                <div class="session-actions">
                  <el-dropdown
                      trigger="click"
                      @command="(command) => handleCommand(command, item)"
                  >
                    <el-button
                        :icon="More"
                        size="small"
                        text
                        class="action-btn"
                    />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="edit"
                        >重命名
                        </el-dropdown-item
                        >
                        <el-dropdown-item command="delete" divided
                        >删除
                        </el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- 更早会话 -->
          <div class="time-section" v-if="oldData && oldData.length > 0">
            <div class="time-label">更早</div>
            <div class="session-items">
              <div
                  v-for="item in oldData"
                  :key="item.id"
                  class="session-item"
                  @click="handleSessionClick(item)"
              >
                <div class="session-content">
                  {{ item.title || "未命名会话" }}
                </div>
                <div class="session-actions">
                  <el-dropdown
                      trigger="click"
                      @command="(command) => handleCommand(command, item)"
                  >
                    <el-button
                        :icon="More"
                        size="small"
                        text
                        class="action-btn"
                    />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="edit"
                        >重命名
                        </el-dropdown-item
                        >
                        <el-dropdown-item command="delete" divided
                        >删除
                        </el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
              class="empty-state"
              v-if="!recentData?.length && !oldData?.length"
          >
            <div class="empty-content">
              <div class="empty-icon">💬</div>
              <div class="empty-text">暂无会话记录</div>
            </div>
          </div>
        </div>
      </template>

      <!-- 自定义聊天开始页面 -->
      <template #ChatBegin_default="{ send, config }">

        <div class="welcome-screen">

          <!-- 侧边栏控制按钮 - 需要其他方式实现 -->
          <div class="sider-control">
            <el-button
                @click="handleSiderToggle"
                :icon="siderOpen ? Close : Menu"
                size="small"
                text
                class="sider-toggle-btn"
            >
              {{ siderOpen ? '隐藏消息列表' : '显示消息列表' }}
            </el-button>
          </div>

          <div class="welcome-header">
            <div class="coherent-logo">
              <img :src="coherentLogo" alt="coherent-logo"/>
            </div>
          </div>

          <div class="welcome-box">
            <div class="welcome-message">
              <div class="welcome-text">
                <div class="greeting">{{ config?.bot?.name }}</div>
                <div class="main-message">有什么问题随时问我吧~</div>
              </div>
              <div class="robot-avatar">
                <img :src="robot" alt="robot"/>
              </div>
            </div>

            <div class="services-section">
              <button class="service-btn">我能为您提供多种服务</button>
              <p class="service-desc">
                {{ config?.bot?.description }}
              </p>
            </div>
          </div>

          <div class="example-questions">
            <h3>试一试:</h3>
            <div class="question-list">
              <div
                  v-for="(question, index) in config?.bot?.begin?.questions"
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
        </div>
      </template>

      <!-- 自定义用户消息内容 -->
      <template #ChatContent_userContent="{ content }">
        <div class="custom-user-message">
          <div class="message-bubble">
            {{ content }}
          </div>
          <div class="message-header-left-avatar">
            <img :src="userAvatar" alt="user-avatar"/>
          </div>
        </div>
      </template>

      <!-- 自定义引用源显示 -->
      <template #ChatContent_sourceItem="{ list }">
        <div v-if="list && list.length > 0" class="link-sources">
          <el-link
              v-for="(source, index) in list"
              :key="index"
              :href="source.sourceUrl"
              target="_blank"
              :icon="Link"
              class="source-link"
          >
            {{ source.sourceName || "参考链接" }}
          </el-link>
        </div>
      </template>

      <!-- 自定义消息底部操作 -->
      <template #ChatContent_bottomActions="{ copy, voteType, feedback }">
        <div class="bottom-actions">
          <!-- 点赞按钮 -->
          <el-button
              :icon="Thumb"
              size="small"
              :type="voteType === 'like' ? 'primary' : 'text'"
              @click="feedback('like')"
              class="action-btn"
          />

          <!-- 点踩按钮 -->
          <el-button
              :icon="CircleClose"
              size="small"
              :type="voteType === 'dislike' ? 'danger' : 'text'"
              @click="feedback('dislike')"
              class="action-btn"
          />

          <!-- 复制按钮 -->
          <el-button
              :icon="DocumentCopy"
              size="small"
              text
              @click="copy"
              class="action-btn"
          />
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
import {ref} from "vue";
import {View} from "@custouch-open/zenative-chat-sdk-web";
import "@custouch-open/zenative-chat-sdk-web/style";
import coherentLogo from "../assets/coherent-logo-blue.png";
import robot from "../assets/robot.png";
import userAvatar from "../assets/Avatar.png";
import {
  Link,
  CircleClose,
  DocumentCopy,
  ArrowLeft,
  ArrowRight,
} from "@element-plus/icons-vue";

const userInput = ref("");
const open = ref(true);
const siderOpen = ref(true)

const handleSiderToggle = () => {
  siderOpen.value = !siderOpen.value
  // 这里需要调用 SDK 的方法来实际切换侧边栏
  // 可能需要使用 provide/inject 或其他状态管理方式
}
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

const selectedSource = ref(null);

// 处理源点击
const handleSourceClick = (source) => {
  console.log("点击源:", source);
  // 可以根据需要实现不同的点击行为
  if (source.type === "image") {
    selectedSource.value = source;
  } else {
    handleOpenSource(source);
  }
};

// 处理预览
const handlePreview = (source) => {
  selectedSource.value = source;
};

// 关闭预览
const closePreview = () => {
  selectedSource.value = null;
};

// 打开源文件
const handleOpenSource = (source) => {
  if (source.url) {
    window.open(source.url, "_blank");
  } else {
    console.warn("源文件没有有效的URL:", source);
  }
};

// 复制链接
const handleCopyLink = async (source) => {
  if (source.url) {
    try {
      await navigator.clipboard.writeText(source.url);
      alert("链接已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = source.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("链接已复制");
    }
  }
};

// 图片加载错误处理
const handleImageError = (event) => {
  event.target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54KHImltYWdlIjwvdGV4dD48L3N2Zz4=";
};

// 文本截断
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// 获取类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    pdf: "PDF文档",
    word: "Word文档",
    web: "网页",
    image: "图片",
    video: "视频",
  };
  return typeMap[type] || "文档";
};

// 格式化日期
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("zh-CN");
  } catch {
    return dateString;
  }
};
</script>

<style scoped>
/* 自定义底部 复制 点赞 的样式 */

.bottom-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.action-btn {
  padding: 4px 8px;
  min-width: 32px;
}

.action-btn:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 引用源的样式 */
.link-sources {
  margin: 8px 0;
}

.text-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
  padding: 2px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.link-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.chat-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 自定义会话列表头部 */
.custom-session-header {
  background-color: rebeccapurple;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  /* border-bottom: 1px solid #e9ecef; */
  height: 56px;
  box-sizing: border-box;
}

.session-title {
  position: absolute;
  width: 64px;
  height: 24px;
  left: 16px;
  top: 16px;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #0032ff;
  margin: 0;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 4px;
  color: #666;
}

.close-btn:hover {
  color: #333;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 自定义会话列表 */
.session-list-body {
  width: 100%;
  height: calc(100% - 56px);
  /* background: #f4faff; */
  overflow-y: auto;
  padding: 0;
}

.time-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.time-label {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  color: rgba(100, 100, 100, 0.8);
  margin-bottom: 12px;
}

.session-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px 16px 12px 0;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  /* border: 1px solid transparent; */
}

.session-item:hover {
  /* border-color: #0032ff;
  box-shadow: 0px 4px 12px rgba(0, 50, 255, 0.1); */
}

.session-content {
  flex: 1;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000000;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  white-space: nowrap;
}

.session-actions {
  flex-shrink: 0;
  margin-left: 8px;
}

.action-btn {
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.session-item:hover .action-btn {
  opacity: 1;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 0 16px;
}

.empty-content {
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(100, 100, 100, 0.6);
}

/* 滚动条样式 */
.session-list-body::-webkit-scrollbar {
  width: 4px;
}

.session-list-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.session-list-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.session-list-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 背景装饰元素 */
/* .session-list-body::before {
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
  z-index: 0;
}

.session-list-body::after {
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
  z-index: 0;
} */

/* 确保内容在背景之上 */
.time-section,
.empty-state {
  position: relative;
  z-index: 1;
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
  position: relative;
  margin: 0 auto 20px;
}

.welcome-message {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 0 0 10px;
  height: 115px;
}

.welcome-text {
  flex: 1;
  text-align: left;
}

.greeting {
  font-size: 12px;
  color: #646464;
  line-height: 20px;
  margin-bottom: 5px;
}

.main-message {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 22px;
}

.robot-avatar {
  flex-shrink: 0;
}

.robot-avatar img {
  width: 135px;
  height: 121px;
  object-fit: contain;
}

.services-section {
  background-color: #fff;
  border-radius: 16px;
  height: 92px;
  padding: 15px;
  backdrop-filter: blur(6px);
  position: relative;
}

.service-btn {
  position: absolute;
  width: 140px;
  height: 20px;
  top: -20px;
  left: 30px;
  background: #0032ff;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 6px 0px 0px;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.service-desc {
  font-size: 12px;
  color: #646464;
  line-height: 20px;
  margin: 0;
  text-align: left;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
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
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 9px 8px;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  gap: 6px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.question-item:hover {
  background-color: #f0f0f0;
}

.question-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #000000;
  line-height: 22px;
  text-align: left;
  font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
}

.arrow-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
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
  border-radius: 12px 0 12px 12px;
  padding: 12px 16px;
  max-width: 70%;
  word-wrap: break-word;
  background: #0032ff1a;
}

.message-header-left-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #cbd3df;
  margin-left: 10px;
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
