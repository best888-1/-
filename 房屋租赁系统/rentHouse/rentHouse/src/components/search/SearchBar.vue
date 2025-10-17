<!-- src/components/search/SearchBar.vue -->
<template>
  <div class="search-bar">
    <!-- 地区选择 -->
    <div class="filter-group">
      <h4 class="filter-title">地区</h4>
      <div class="region-selectors">
        <el-select v-model="provinceId" placeholder="省份" @change="handleProvinceChange" class="search-item">
          <el-option v-for="p in provinceList" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
        <el-select v-model="cityId" placeholder="城市" @change="handleCityChange" class="search-item" :disabled="!provinceId">
          <el-option v-for="c in cityList" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-select v-model="districtId" placeholder="区域" class="search-item" :disabled="!cityId">
          <el-option v-for="d in districtList" :key="d.id" :label="d.name" :value="d.id" />
        </el-select>
      </div>
    </div>

    <!-- 价格范围 -->
    <div class="filter-group">
      <h4 class="filter-title">价格</h4>
      <el-select v-model="priceRange" placeholder="价格范围" @change="handlePriceChange" class="search-item full-width">
        <el-option label="全部" value="all" />
        <el-option label="0-500元" value="0-500" />
        <el-option label="500-1000元" value="500-1000" />
        <el-option label="1000-2000元" value="1000-2000" />
        <el-option label="2000-3000元" value="2000-3000" />
        <el-option label="3000-5000元" value="3000-5000" />
        <el-option label="5000元以上" value="5000+" />
      </el-select>
    </div>

    <!-- 支付方式 -->
    <div class="filter-group">
      <h4 class="filter-title">支付方式</h4>
      <el-select v-model="paymentTypeId" placeholder="支付方式" class="search-item full-width">
        <el-option label="全部" value="" />
        <el-option v-for="payment in paymentTypeList" :key="payment.id" :label="payment.name" :value="payment.id" />
      </el-select>
    </div>

    <!-- 抽屉底部的操作按钮 -->
    <div class="drawer-actions">
      <el-button type="default" class="reset-btn" @click="resetAndEmit">重置</el-button>
      <el-button type="primary" class="confirm-btn" @click="submitAndEmit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProvinceList, getCityListByProvinceId, getDistrictListByCityId, getPaymentTypeList } from '@/api/search';
import type { RoomListQueryInterface, RegionInterface, PaymentTypeInterface } from '@/api/search/types';

// --- Emits ---
const emit = defineEmits<{
  (e: 'search', filters: Omit<RoomListQueryInterface, 'current' | 'size' | 'orderType'>): void;
  (e: 'reset'): void;
}>();

// --- Refs ---
const provinceList = ref<RegionInterface[]>([]);
const cityList = ref<RegionInterface[]>([]);
const districtList = ref<RegionInterface[]>([]);
const paymentTypeList = ref<PaymentTypeInterface[]>([]);

// 表单绑定的 v-model
const provinceId = ref<number | undefined>();
const cityId = ref<number | undefined>();
const districtId = ref<number | undefined>();
const priceRange = ref<string>('all');
const paymentTypeId = ref<number | undefined>();

// --- Methods ---
const loadProvinces = async () => {
  try {
    const res = await getProvinceList();
    provinceList.value = res.data || [];
  } catch (error) {
    console.error('获取省份列表失败:', error);
  }
};
// ... (loadCities, loadDistricts, loadPaymentTypes 方法与之前相同，此处省略)
const loadCities = async (provinceId: number) => {
  try {
    const res = await getCityListByProvinceId(provinceId);
    cityList.value = res.data || [];
  } catch (error) {
    console.error('获取城市列表失败:', error);
  }
};
const loadDistricts = async (cityId: number) => {
  try {
    const res = await getDistrictListByCityId(cityId);
    districtList.value = res.data || [];
  } catch (error) {
    console.error('获取区县列表失败:', error);
  }
};
const loadPaymentTypes = async () => {
  try {
    const res = await getPaymentTypeList();
    paymentTypeList.value = res.data || [];
  } catch (error) {
    console.error('获取支付方式失败:', error);
  }
};

const handleProvinceChange = (value: number | undefined) => {
  provinceId.value = value;
  cityId.value = undefined;
  districtId.value = undefined;
  cityList.value = [];
  districtList.value = [];
  if (value) loadCities(value);
};
const handleCityChange = (value: number | undefined) => {
  cityId.value = value;
  districtId.value = undefined;
  districtList.value = [];
  if (value) loadDistricts(value);
};
const handlePriceChange = () => { /* 无需修改 */ };

/**
 * 重置所有内部状态
 */
const resetInternalState = () => {
  provinceId.value = undefined;
  cityId.value = undefined;
  districtId.value = undefined;
  cityList.value = [];
  districtList.value = [];
  priceRange.value = 'all';
  paymentTypeId.value = undefined;
};

/**
 * 提交并发出 search 事件
 */
const submitAndEmit = () => {
  // 构建要发出的筛选条件对象
  const filters: Omit<RoomListQueryInterface, 'current' | 'size' | 'orderType'> = {
    provinceId: provinceId.value,
    cityId: cityId.value,
    districtId: districtId.value,
    paymentTypeId: paymentTypeId.value,
  };

  // 处理价格范围
  if (priceRange.value !== 'all') {
    const [min, max] = priceRange.value.split('-');
    filters.minRent = Number(min);
    filters.maxRent = max === '+' ? undefined : Number(max);
  }
  
  // 发出 search 事件，将筛选条件传给父组件
  emit('search', filters);
};

/**
 * 重置并发出 reset 事件
 */
const resetAndEmit = () => {
  resetInternalState();
  // 发出 reset 事件，通知父组件进行重置
  emit('reset');
};

// --- Lifecycle Hooks ---
onMounted(() => {
  loadProvinces();
  loadPaymentTypes();
});
</script>

<style scoped>
/* 样式部分与之前相同，此处省略，请保持不变 */
/* ... */
</style>