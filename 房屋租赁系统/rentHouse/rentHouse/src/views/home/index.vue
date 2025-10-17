<template>
  <div class="home-container">
    <!-- 顶部导航 -->
    <header class="home-header">
      <div class="logo" @click="$router.push('/')">尚庭公寓</div>
      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/rooms" class="nav-link" active-class="active">房源</router-link>
        <router-link to="/news" class="nav-link" active-class="active">资讯</router-link>
        <router-link to="/about" class="nav-link" active-class="active">关于我们</router-link>
      </nav>
      <div class="user-actions">
        <el-button type="text" @click="handleLogout">退出登录</el-button>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="home-main">
      <div class="welcome-section">
        <h1>欢迎回来，{{ userInfo?.nickname || '用户' }}</h1>
        <p>这里是您的专属公寓管理中心</p>
      </div>

      <!-- 功能模块 -->
      <div class="features">
        <router-link to="/rooms" class="feature-link">
          <WelcomeItem>
            <template #icon>
              <House />
            </template>
            <template #heading>我的房源</template>
            <p>查看和管理您的所有房源信息</p>
          </WelcomeItem>
        </router-link>

        <router-link to="/my-appointment" class="feature-link">
          <WelcomeItem>
            <template #icon>
              <Calendar />
            </template>
            <template #heading>预约管理</template>
            <p>处理客户的看房预约请求</p>
          </WelcomeItem>
        </router-link>

        <router-link to="/Center" class="feature-link">
          <WelcomeItem>
            <template #icon>
              <UserCenter />
            </template>
            <template #heading>个人中心</template>
            <p>修改个人信息和账户设置</p>
          </WelcomeItem>
        </router-link>

        <router-link to="/user/browsing-history" class="feature-link">
          <WelcomeItem>
            <template #icon>
              <History />
            </template>
            <template #heading>浏览历史</template>
            <p>查看您浏览过的房源记录</p>
          </WelcomeItem>
        </router-link>

        <router-link to="/lease/my-lease" class="feature-link">
          <WelcomeItem>
            <template #icon>
              <Document />
            </template>
            <template #heading>租约管理</template>
            <p>查看和管理您的所有租约</p>
          </WelcomeItem>
        </router-link>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="home-footer">
      <p>© 2023 尚庭公寓 版权所有</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { House, Calendar, User,  Document } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import { useRouter } from 'vue-router';
import WelcomeItem from '@/components/WelcomeItem.vue';

// 获取用户信息
const userStore = useUserStore();
const { userInfo } = userStore;

// 路由实例
const router = useRouter();

// 退出登录
const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  padding: 8px 12px;
  position: relative;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary-color);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
}

.home-main {
  flex: 1;
  padding: 40px 20px;
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--text-color-primary);
}

.features {
  display: grid;
  gap: 20px;
}

@media (min-width: 768px) {
  .features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.feature-link :deep(.welcome-item) {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.feature-link :deep(.welcome-item):hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.home-footer {
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--color-border);
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}
</style>
