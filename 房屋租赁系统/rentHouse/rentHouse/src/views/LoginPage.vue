<!-- src/views/login/index.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 移动端顶部返回按钮 -->
      <el-icon class="back-icon" @click="$router.back()">
        <ArrowLeft />
      </el-icon>
      
      <div class="login-logo">
        <div class="logo-icon">🏠</div>
        <h2>尚庭公寓</h2>
        <p class="slogan">便捷租房，安心入住</p>
      </div>
      
      <el-form 
        ref="loginFormRef" 
        :model="formData" 
        :rules="rules" 
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="formData.phone" 
            placeholder="请输入手机号" 
            maxlength="11"
            clearable
            class="mobile-input"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-btn" 
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 移动端底部说明 -->
      <div class="login-footer">
        <p>登录即表示同意<a href="/terms" class="link">《用户协议》</a>和<a href="/privacy" class="link">《隐私政策》</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElIcon } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import type { LoginParams } from '@/types/user';

// 表单数据（与LoginParams接口匹配）
const formData = reactive<LoginParams>({
  phone: ''
});

// 加载状态
const loading = ref(false);

// 路由
const router = useRouter();
const route = useRoute();

// 表单验证规则
const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入正确的手机号格式', 
      trigger: 'blur' 
    }
  ]
};

// 表单引用
const loginFormRef = ref<InstanceType<typeof ElForm>>();

// 用户状态
const userStore = useUserStore();

// 登录处理
const handleLogin = async () => {
  // 表单验证
  if (!loginFormRef.value) return;
  const valid = await loginFormRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // 调用登录接口
    await userStore.login(formData);
    // 获取用户信息
    await userStore.getUserInfo();
    // 跳转页面（优先重定向参数，否则首页）
    const redirect = route.query.redirect as string || '/';
    router.push(redirect);
    ElMessage.success('登录成功');
  } catch (error) {
    console.error('登录失败', error);
    ElMessage.error('登录失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 基础容器 - 适配移动端全屏 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px 16px;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

/* 登录盒子 - 占满移动端宽度 */
.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  margin-top: 50px; /* 顶部留出状态栏空间 */
}

/* 返回按钮 */
.back-icon {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-icon:hover {
  background-color: #f5f5f5;
}

/* 登录Logo区域 */
.login-logo {
  text-align: center;
  margin-bottom: 30px;
  padding-top: 10px; /* 避开返回按钮 */
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.login-logo h2 {
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
}

.slogan {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 表单样式 */
.login-form {
  margin-top: 20px;
}

/* 输入框适配移动端触控 */
.mobile-input {
  height: 50px;
  font-size: 16px;
}

/* 登录按钮 - 加大触控区域 */
.login-btn {
  width: 100%;
  height: 50px;
  font-size: 18px;
  border-radius: 25px;
}

/* 底部说明文字 */
.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #909399;
}

.link {
  color: #409EFF;
  text-decoration: none;
  margin: 0 4px;
}

/* 适配小屏手机 */
@media (max-width: 320px) {
  .login-box {
    padding: 20px 15px;
    margin-top: 30px;
  }
  
  .login-logo h2 {
    font-size: 22px;
  }
  
  .login-btn {
    height: 46px;
    font-size: 16px;
  }
}

/* 适配iPhone X及以上刘海屏 */
@media (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
       (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .login-container {
    padding-top: 40px;
  }
}
</style>