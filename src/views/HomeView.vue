<template>
  <div class="home-container">
    <h1>欢迎使用智能助手</h1>
    <p>这是一个使用Vue 3和Zenative Chat SDK构建的智能聊天应用。</p>
    <div class="action-buttons">
      <router-link to="/chat" class="chat-button">
        开始对话
      </router-link>
    </div>
    
    <div class="features-section">
      <h2>功能特点</h2>
      <ul>
        <li>🚀 即插即用的聊天界面组件</li>
        <li>🎨 高度可定制的样式和布局</li>
        <li>📱 响应式设计，适配移动端和桌面端</li>
        <li>💬 支持富文本消息和Markdown渲染</li>
        <li>🔧 灵活的插槽系统，可自定义界面各部分</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Home page component
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

p {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.action-buttons {
  margin: 2rem 0;
}

.chat-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.chat-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.features-section {
  margin-top: 3rem;
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.features-section h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.features-section ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.features-section li {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: #4a5568;
  font-size: 1rem;
  flex: 0 0 auto;
  min-width: 200px;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.features-section li:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .features-section ul {
    flex-direction: column;
    align-items: center;
  }
  
  .features-section li {
    min-width: 100%;
    text-align: center;
  }
}
</style>