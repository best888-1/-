<template>
  <div class="user-center-page">
    <!-- 用户信息卡片 -->
    <div class="user-info-card">
      <div class="avatar-container">
        <img 
          :src="userInfo?.avatarUrl || defaultAvatar" 
          alt="用户头像" 
          class="avatar"
        >
      </div>
      <div class="user-basic-info">
        <h2>{{ userInfo?.nickname || '用户' }}</h2>
        <p class="phone">{{ userInfo?.phone || '未绑定手机' }}</p>
        <p class="join-date">
          注册时间: {{ formatDate(userInfo?.createTime) }}
        </p>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="function-list">
      <router-link to="/user/browsing-history" class="function-item">
        <div class="icon">
          <Clock />
        </div>
        <div class="text">浏览历史</div>
        <div class="arrow">
          <ArrowRight />
        </div>
      </router-link>

      <router-link to="/my-appointment" class="function-item">
        <div class="icon">
          <Calendar />
        </div>
        <div class="text">我的预约</div>
        <div class="arrow">
          <ArrowRight />
        </div>
      </router-link>

      <router-link to="/lease/my-lease" class="function-item">
        <div class="icon">
          <Document />
        </div>
        <div class="text">我的租约</div>
        <div class="arrow">
          <ArrowRight />
        </div>
      </router-link>

      <div class="function-item" @click="handleLogout">
        <div class="icon" style="color: #ff4d4f;">
          <ExitFullScreen />
        </div>
        <div class="text" style="color: #ff4d4f;">退出登录</div>
        <div class="arrow">
          <ArrowRight />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { Clock, Calendar, Document, ArrowRight, FullScreen } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// 默认头像
const defaultAvatar = 'https://picsum.photos/200/200';

// 获取用户信息
const userStore = useUserStore();
const { userInfo } = userStore;

// 路由实例
const router = useRouter();

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知';
  return new Date(dateString).toLocaleDateString();
};

// 退出登录
const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.user-center-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.user-info-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  margin-right: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

.user-basic-info h2 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.phone {
  color: #666;
  margin: 0 0 5px 0;
}

.join-date {
  color: #999;
  margin: 0;
  font-size: 0.9rem;
}

.function-list {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.function-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.function-item:last-child {
  border-bottom: none;
}

.function-item:hover {
  background-color: #f9f9f9;
}

.icon {
  font-size: 1.5rem;
  color: #1677ff;
  margin-right: 15px;
  width: 24px;
  text-align: center;
}

.text {
  flex: 1;
  font-size: 1rem;
}

.arrow {
  color: #ccc;
}
</style>