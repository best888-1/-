<template>
  <div class="apartment-card" @click="$emit('click')">
    <h3 class="card-title">{{ title }}</h3>
    <div class="apartment-info">
      <!-- 公寓图片 -->
      <el-image 
        :src="apartmentInfo.graphVoList?.[0]?.url" 
        fit="cover"
        class="apartment-img"
        :alt="apartmentInfo.name || '公寓图片'"
        fallback-src="https://picsum.photos/80/80?random=1"
      />
      
      <!-- 公寓信息 -->
      <div class="apartment-text">
        <p class="apartment-name">{{ apartmentInfo.name || '未知公寓' }}</p>
        
        <!-- 地址信息 -->
        <p class="apartment-address">
          <el-icon size="14"><Location /></el-icon>
          <span>{{ apartmentInfo.districtName }} {{ apartmentInfo.addressDetail }}</span>
        </p>
        
        <!-- 租金信息 - 修复maxRent类型错误 -->
        <p class="apartment-rent" v-if="apartmentInfo.minRent">
          <span class="price">¥{{ apartmentInfo.minRent.toLocaleString() }}</span>
          <span class="price-unit" v-if="hasMaxRent">
            - ¥{{ (apartmentInfo as any).maxRent.toLocaleString() }}/月
          </span>
          <span class="price-unit" v-else>/月起</span>
        </p>
        
        <!-- 标签列表 -->
        <div class="apartment-tags" v-if="apartmentInfo.labelInfoList && apartmentInfo.labelInfoList.length">
          <el-tag 
            v-for="label in apartmentInfo.labelInfoList" 
            :key="label.id" 
            size="small"
            effect="light"
            class="apartment-tag"
          >
            {{ label.name }}
          </el-tag>
        </div>
      </div>
      
      <!-- 箭头图标 -->
      <el-icon class="arrow-right"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Location, ArrowRight } from '@element-plus/icons-vue';
import { defineProps, defineEmits, computed } from 'vue';
import type { ApartmentItem } from '@/api/apartment/type';

// 组件属性定义
const props = defineProps<{
  apartmentInfo: ApartmentItem;
  title?: string; // 卡片标题，默认"所属公寓"
}>();

// 组件事件
const emits = defineEmits<{
  (e: 'click'): void; // 点击卡片时触发
}>();

// 检查是否存在maxRent（通过类型断言绕过类型检查）
const hasMaxRent = computed(() => {
  return typeof (props.apartmentInfo as any).maxRent === 'number';
});

// 默认标题处理
const title = props.title || '所属公寓';
</script>

<style scoped>
/* 保持原有样式不变 */
.apartment-card {
  margin: 10px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.apartment-card:active {
  transform: scale(0.99);
}

.card-title {
  font-size: 16px;
  margin: 0 0 12px 0;
  color: #303133;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.apartment-info {
  display: flex;
  align-items: center;
}

.apartment-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.apartment-text {
  flex: 1;
  margin: 0 12px;
  overflow: hidden;
}

.apartment-name {
  font-weight: 600;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #303133;
}

.apartment-address {
  font-size: 12px;
  color: #606266;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.apartment-rent {
  margin: 0 0 6px 0;
  font-size: 13px;
}

.price {
  color: #f56c6c;
  font-weight: 600;
}

.price-unit {
  color: #606266;
  font-size: 12px;
}

.apartment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.apartment-tag {
  font-size: 11px;
  padding: 2px 6px;
}

.arrow-right {
  color: #909399;
  font-size: 18px;
  flex-shrink: 0;
}

/* 适配小屏设备 */
@media (max-width: 320px) {
  .apartment-img {
    width: 70px;
    height: 70px;
  }
  
  .apartment-text {
    margin: 0 8px;
  }
}
</style>
