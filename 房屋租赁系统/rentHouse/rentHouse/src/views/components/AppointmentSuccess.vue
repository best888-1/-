<template>
  <el-dialog 
    v-model="dialogVisible"
    title="预约成功" 
    :show-close="false"
    width="30%"
    center
  >
    <div class="success-content">
      <el-icon class="success-icon"><CircleCheck /></el-icon>
      <p class="success-text">恭喜您，预约成功！</p>
      <p class="tips-text">我们将尽快与您联系确认看房时间</p>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">
          查看我的预约
        </el-button>
        <el-button @click="handleClose">
          返回首页
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useRouter } from 'vue-router'; // 正确的导入路径
import { CircleCheck } from '@element-plus/icons-vue';

// 定义组件属性
const props = defineProps<{
  modelValue: boolean;
}>();

// 定义组件事件
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// 处理v-model双向绑定
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  }
});

// 路由实例 - 现在可以正确使用了
const router = useRouter();

// 处理确认按钮点击
const handleConfirm = () => {
  emits('update:modelValue', false);
  router.push('/my-appointment').catch((err: unknown) => {
    console.error('跳转我的预约失败', err);
  });
};

// 处理关闭按钮点击
const handleClose = () => {
  emits('update:modelValue', false);
  router.push('/').catch((err: unknown) => {
    console.error('跳转首页失败', err);
  });
};
</script>

<style scoped>
/* 样式保持不变 */
.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  color: #67c23a;
  margin-bottom: 16px;
}

.success-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tips-text {
  color: #666;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
    