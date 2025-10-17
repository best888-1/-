<template>
  <div class="user-center-container">
    <!-- 顶部导航 -->
    <header class="user-header">
      <el-icon @click="$router.back()" class="back-icon"><ArrowLeft /></el-icon>
      <span>个人中心</span>
    </header>

    <!-- 用户信息 -->
    <div class="user-info-card">
      <el-avatar class="user-avatar" :size="60">
        <img src="https://picsum.photos/100/100?random=user" alt="用户头像" />
      </el-avatar>
      <div class="user-info">
        <h3 class="user-name">{{ userInfo?.nickname || '用户' }}</h3>
        <p class="user-phone">{{ userInfo?.phone || '未绑定手机号' }}</p>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="function-list">
      <div 
        class="function-item" 
        @click="$router.push('/my-appointment')"
      >
        <el-icon class="function-icon"><Calendar /></el-icon>
        <span class="function-text">我的预约</span>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
      
      <div 
        class="function-item" 
        @click="$router.push('/lease-management')"
      >
        <el-icon class="function-icon"><Document /></el-icon>
        <span class="function-text">租约管理</span>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
      
      <div 
        class="function-item" 
        @click="$router.push('/browsing-history')"
      >
        <el-icon class="function-icon"><History /></el-icon>
        <span class="function-text">浏览历史</span>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>
    </div>

    <!-- 退出登录 -->
    <el-button 
      type="primary" 
      class="logout-btn"
      @click="handleLogout"
    >
      退出登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Calendar, Document, ArrowRight } from '@element-plus/icons-vue';
import { ElButton, ElAvatar } from 'element-plus';
import { useUserStore } from '@/store/modules/user';
import type { UserInfo } from '@/types/user';

// 路由实例
const router = useRouter();

// 用户信息
const userStore = useUserStore();
const userInfo = ref<UserInfo | null>(userStore.userInfo);

// 退出登录
const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.user-center-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.user-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-icon {
  margin-right: 12px;
  cursor: pointer;
}

.user-info-card {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  background: #fff;
  margin-bottom: 10px;
}

.user-avatar {
  margin-right: 16px;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.user-phone {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.function-list {
  background: #fff;
  margin-bottom: 10px;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.function-icon {
  font-size: 20px;
  color: #606266;
  margin-right: 12px;
}

.function-text {
  flex: 1;
  font-size: 16px;
}

.arrow-icon {
  color: #c0c4cc;
}

.logout-btn {
  width: 80%;
  margin: 20px auto;
  display: block;
}

/* 适配刘海屏 */
@media (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
       (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .user-header {
    padding-top: 10px;
    height: 60px;
  }
}
</style>