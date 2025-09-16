<script setup>
import "@custouch-open/zenative-chat-sdk-web/style"
</script>

<template>
  <div class="app-container">
    <!-- 路由视图，用于显示当前路由对应的组件 -->
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
}
</style>
