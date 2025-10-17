<template>
  <div class="my-lease-page">
    <div class="page-header">
      <el-button type="text" icon="ArrowLeft" @click="$router.back()"></el-button>
      <h1>我的租约</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-loading-spinner />
      <p class="loading-text">加载租约列表中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!leaseList || leaseList.length === 0" class="empty-state">
      <Document style="font-size: 3rem; color: #ccc;" />
      <p>暂无租约记录</p>
    </div>

    <!-- 租约列表 -->
    <div v-else class="lease-list">
      <div 
        v-for="item in leaseList" 
        :key="item.id" 
        class="lease-item"
        @click="goToDetail(item.id)"
      >
        <!-- 左侧图片区域 -->
        <div class="item-left">
          <img 
            :src="item.roomGraphVoList[0]?.url || defaultImg" 
            :alt="`${item.apartmentName}${item.roomNumber}`"
            loading="lazy"
          >
          <!-- 新签标签：仅生效中/已确认状态显示 -->
          <el-tag 
            type="success" 
            size="small" 
            class="new-tag"
            v-if="item.leaseStatus === LeaseStatus.ACTIVE || item.leaseStatus === LeaseStatus.CONFIRMED"
          >
            新签
          </el-tag>
        </div>

        <!-- 中间信息区域 -->
        <div class="item-middle">
          <h3 class="item-title">
            {{ item.apartmentName }} {{ item.roomNumber }}
          </h3>
          <p class="item-date">
            {{ formatDate(item.leaseStartDate) }} 至 {{ formatDate(item.leaseEndDate) }}
          </p>
          <!-- 状态标签：根据状态显示不同颜色 -->
          <el-tag 
            :type="getStatusTagType(item.leaseStatus)" 
            size="small"
            class="status-tag"
          >
            {{ getStatusText(item.leaseStatus) }}
          </el-tag>
          <p class="item-price">¥{{ formatPrice(item.rent) }}/月</p>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="item-right">
          <!-- 确认按钮：仅"已确认"状态显示 -->
          <el-button 
            type="success" 
            size="small"
            @click.stop="handleConfirm(item.id)"
            v-if="item.leaseStatus === LeaseStatus.CONFIRMED"
          >
            确认
          </el-button>
          <!-- 续约按钮：仅"生效中"状态显示 -->
          <el-button 
            type="success" 
            size="small"
            @click.stop="handleRenew(item.id)"
            v-if="item.leaseStatus === LeaseStatus.ACTIVE"
          >
            续约
          </el-button>
          <!-- 提前退租按钮：仅"生效中"状态显示 -->
          <el-button 
            type="danger" 
            size="small"
            @click.stop="handleTerminate(item.id)"
            v-if="item.leaseStatus === LeaseStatus.ACTIVE"
          >
            提前退租
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElLoading, ElIcon } from 'element-plus';
import { Document, ArrowLeft } from '@element-plus/icons-vue';
// 导入接口和类型
import { getLeaseList, updateLeaseStatus } from '@/api/lease';
import type { LeaseListItem, LeaseOperateParams } from '@/api/lease/type';
import type { ApiResponse, PageResult } from '@/types/api';
import type { GraphVo } from '@/types/common';
// 导入枚举
import { LeaseStatus, LeaseStatusMap } from '@/enums/constEnums';

// 状态管理
const leaseList = ref<LeaseListItem[]>([]);
const loading = ref(true);
const defaultImg = 'https://picsum.photos/120/80'; // 图片占位符
const router = useRouter();

// 1. 格式化租约数据（类型安全+数据兜底）
const formatLeaseItem = (item: any): LeaseListItem => {
  // 状态标准化：确保是枚举类型，默认PENDING
  const validStatus = Object.values(LeaseStatus).includes(item.leaseStatus as LeaseStatus)
    ? (item.leaseStatus as LeaseStatus)
    : LeaseStatus.PENDING;

  return {
    id: item.id || 0,
    roomGraphVoList: item.roomGraphVoList || ([] as GraphVo[]),
    apartmentName: item.apartmentName || '未知公寓',
    roomNumber: item.roomNumber || '未知房间',
    leaseStatus: validStatus,
    leaseStartDate: item.leaseStartDate || '',
    leaseEndDate: item.leaseEndDate || '',
    sourceType: item.sourceType || '1',
    rent: item.rent || 0
  };
};

// 2. 获取租约列表（接口调用+数据格式化）
const fetchLeaseList = async () => {
  const loadingInstance = ElLoading.service({ text: '加载租约列表中...' });
  try {
    const res: ApiResponse<PageResult<LeaseListItem>> = await getLeaseList();
    const rawList = res.data?.records || res.data || [];
    leaseList.value = rawList.map(item => formatLeaseItem(item));
  } catch (error) {
    ElMessage.error('获取租约列表失败，请稍后重试');
    console.error('租约列表接口调用失败：', error);
    leaseList.value = [];
  } finally {
    loading.value = false;
    loadingInstance.close();
  }
};

// 3. 状态标签类型（严格接收LeaseStatus类型）
const getStatusTagType = (status: LeaseStatus) => {
  switch (status) {
    case LeaseStatus.CONFIRMED:
    case LeaseStatus.ACTIVE:
      return 'success';
    case LeaseStatus.EXPIRED:
      return 'warning';
    case LeaseStatus.TERMINATED:
    case LeaseStatus.CANCELED:
      return 'danger';
    default:
      return 'info';
  }
};

// 4. 状态文本（严格接收LeaseStatus类型）
const getStatusText = (status: LeaseStatus) => {
  return LeaseStatusMap[status] || '未知状态';
};

// 5. 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未设置日期';
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    return '日期格式错误';
  }
};

// 6. 格式化价格
const formatPrice = (price?: number) => {
  return price && !isNaN(price) ? Math.round(price) : 0;
};

// 7. 前往租约详情页
const goToDetail = (id: number) => {
  if (!id || isNaN(id)) {
    ElMessage.warning('无效的租约ID');
    return;
  }
  router.push(`/lease/detail/${id}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      ElMessage.error('跳转详情页失败');
      console.error('详情页跳转失败：', err);
    }
  });
};

// 8. 确认租约（状态更新：已确认→生效中）
const handleConfirm = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要确认此租约吗？确认后将变为生效状态', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    });
    
    const params: LeaseOperateParams = {
      id,
      leaseStatus: LeaseStatus.ACTIVE
    };
    await updateLeaseStatus(params);
    ElMessage.success('租约确认成功');
    fetchLeaseList();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('租约确认失败');
      console.error('租约确认错误：', error);
    }
  }
};

// 9. 续约操作
const handleRenew = (id: number) => {
  if (!id || isNaN(id)) {
    ElMessage.warning('无效的租约ID');
    return;
  }
  router.push(`/lease/renew/${id}?isRenew=true`).catch(err => {
    ElMessage.error('跳转续约页失败');
    console.error('续约页跳转失败：', err);
  });
};

// 10. 提前退租
const handleTerminate = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要提前退租吗？此操作不可逆', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const params: LeaseOperateParams = {
      id,
      leaseStatus: LeaseStatus.TERMINATED
    };
    await updateLeaseStatus(params);
    ElMessage.success('退租申请提交成功');
    fetchLeaseList();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('退租操作失败');
      console.error('退租错误：', error);
    }
  }
};

// 页面挂载时加载数据
onMounted(() => {
  fetchLeaseList();
});
</script>

<style scoped>
.my-lease-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.page-header h1 {
  margin: 0 0 0 10px;
  font-size: 1.5rem;
  font-weight: 600;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 100px 0;
  color: #606266;
}

.loading-text {
  margin-top: 10px;
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #606266;
  background-color: #fff;
  border-radius: 12px;
  margin-top: 20px;
}

.empty-state Document {
  margin-bottom: 20px;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* 租约列表 */
.lease-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lease-item {
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.lease-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

/* 左侧图片区域 */
.item-left {
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.item-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1;
}

/* 中间信息区域 */
.item-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
}

.item-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #303133;
}

.item-date {
  font-size: 0.875rem;
  color: #606266;
  margin: 0 0 8px 0;
}

.status-tag {
  margin-bottom: 8px;
}

.item-price {
  font-size: 1rem;
  color: #f5222d;
  margin: 0;
  font-weight: 500;
}

/* 右侧操作按钮 */
.item-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
  padding: 4px 0;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .lease-item {
    flex-direction: column;
  }

  .item-left {
    width: 100%;
    height: 160px;
    margin-right: 0;
    margin-bottom: 12px;
  }

  .item-right {
    flex-direction: row;
    margin-left: 0;
    margin-top: 12px;
    justify-content: flex-end;
  }
}
</style>