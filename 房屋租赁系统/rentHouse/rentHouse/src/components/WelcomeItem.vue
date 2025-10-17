<!-- src/components/WelcomeItem.vue -->
<template>
  <div class="welcome-item">
    <div class="icon-container">
      <slot name="icon"></slot>
    </div>
    <div class="content">
      <h3 class="heading">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这个组件主要是一个布局容器，不需要额外的脚本逻辑
</script>

<style scoped>
.welcome-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  height: 100%;
}

.icon-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f9eb;
  color: #67c23a;
  margin-bottom: 16px;
}

.icon-container :deep(.el-icon) {
  font-size: 24px;
}

.heading {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.content p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}
</style>