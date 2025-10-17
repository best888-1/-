<template>
  <el-form-item label="联系人" prop="name">
    <el-input 
      v-model="formData.name" 
      placeholder="请输入联系人姓名"
    />
  </el-form-item>
  
  <el-form-item label="联系电话" prop="phone">
    <el-input 
      v-model="formData.phone" 
      placeholder="请输入联系电话"
      maxlength="11"
      input-mode="tel"
    />
  </el-form-item>
  
  <el-form-item label="备注信息">
    <el-input 
      v-model="formData.remarks" 
      placeholder="请输入备注信息（选填）"
      type="textarea"
      :rows="3"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { AppointmentFormBase } from '@/api/appointment/types';

// 明确接收formData属性并指定正确类型
const props = defineProps<{
  formData: AppointmentFormBase;
}>();

// 解构获取formData，保持模板中使用方式不变
const { formData } = props;
</script>
