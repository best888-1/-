<template>
  <div class="lease-detail-page">
    <div class="page-header">
      <el-button 
        type="text" 
        icon="ArrowLeft" 
        @click="$router.back()"
      ></el-button>
      <h1>租约详情</h1>
      <!-- 编辑按钮：仅特定状态显示 -->
      <el-button 
        v-if="canEdit" 
        type="text" 
        :style="{ marginLeft: 'auto' }"
        @click="handleEdit"
      >
        编辑
      </el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-loading-spinner />
      <p class="loading-text">加载租约详情中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <el-icon class="error-icon"><WarningFilled /></el-icon>
      <p class="error-text">{{ errorMessage }}</p>
      <el-button type="primary" @click="fetchLeaseDetail()">重新加载</el-button>
    </div>

    <!-- 详情内容 -->
    <div v-else class="detail-content">
      <!-- 1. 签约公寓（可点击跳转详情） -->
      <div class="section-card">
        <h2 class="section-title">
          <el-icon size="16" class="section-icon"><HomeFilled /></el-icon>
          签约公寓
        </h2>
        <div class="card-content" @click="goToApartmentDetail()">
          <img 
            :src="leaseDetail?.apartmentGraphVoList[0]?.url || defaultImg" 
            :alt="leaseDetail?.apartmentName || '公寓图片'"
            class="section-img"
            loading="lazy"
          >
          <div class="info-wrapper">
            <h3 class="info-title">{{ leaseDetail?.apartmentName || '未知公寓' }}</h3>
          </div>
          <el-icon size="18" class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 2. 签约房间（可点击跳转详情） -->
      <div class="section-card">
        <h2 class="section-title">
          <el-icon size="16" class="section-icon"><House /></el-icon>
          签约房间
        </h2>
        <div class="card-content" @click="goToRoomDetail()">
          <img 
            :src="leaseDetail?.roomGraphVoList[0]?.url || defaultImg" 
            :alt="`${leaseDetail?.apartmentName || '公寓'}${leaseDetail?.roomNumber || '房间'}`"
            class="section-img"
            loading="lazy"
          >
          <div class="info-wrapper">
            <h3 class="info-title">{{ leaseDetail?.roomNumber || '未知房间' }}</h3>
          </div>
          <el-icon size="18" class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 3. 承租人信息 -->
      <div class="section-card">
        <h2 class="section-title">
          <el-icon size="16" class="section-icon"><UserFilled /></el-icon>
          承租人信息
        </h2>
        <div class="form-card">
          <el-form :model="lesseeForm" label-width="120px" class="info-form" disabled>
            <el-form-item label="姓名">
              <el-input v-model="lesseeForm.name" placeholder="未填写" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="lesseeForm.phone" placeholder="未填写" />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="lesseeForm.idCard" placeholder="未填写" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 4. 租约核心信息 -->
      <div class="section-card">
        <h2 class="section-title">
          <el-icon size="16" class="section-icon"><Document /></el-icon>
          租约详情
        </h2>
        <div class="form-card">
          <el-form :model="leaseForm" label-width="120px" class="info-form" disabled>
            <el-form-item label="租约状态">
              <el-tag 
                :type="getStatusTagType(leaseDetail?.status || LeaseStatus.PENDING)"
              >
                {{ getStatusText(leaseDetail?.status || LeaseStatus.PENDING) }}
              </el-tag>
            </el-form-item>
            <el-form-item label="租期">
              <el-input 
                v-model="leaseForm.leaseTerm" 
                placeholder="未设置" 
              />
            </el-form-item>
            <el-form-item label="合同租期">
              <el-input 
                v-model="leaseForm.leaseDateRange" 
                placeholder="未设置" 
              />
            </el-form-item>
            <el-form-item label="租金">
              <el-input 
                v-model="leaseForm.rent" 
                placeholder="0元/月" 
              />
            </el-form-item>
            <el-form-item label="押金">
              <el-input 
                v-model="leaseForm.deposit" 
                placeholder="0元" 
              />
            </el-form-item>
            <el-form-item label="支付方式">
              <el-input 
                v-model="leaseForm.paymentType" 
                placeholder="未设置" 
              />
            </el-form-item>
            <el-form-item label="租约来源">
              <el-input 
                v-model="leaseForm.sourceType" 
                placeholder="未知" 
              />
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input 
                v-model="leaseForm.remark" 
                type="textarea" 
                placeholder="无备注" 
                rows="2"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 5. 操作按钮区（根据状态动态显示） -->
      <div class="action-section">
        <!-- 确认签约：仅"已确认"状态显示 -->
        <el-button 
          v-if="leaseDetail?.status === LeaseStatus.CONFIRMED" 
          type="primary" 
          @click="handleConfirmSign"
        >
          确认签约
        </el-button>
        <!-- 续约：仅"生效中"状态显示 -->
        <el-button 
          v-if="leaseDetail?.status === LeaseStatus.ACTIVE" 
          type="success" 
          @click="handleRenew"
        >
          申请续约
        </el-button>
        <!-- 提前退租：仅"生效中"状态显示 -->
        <el-button 
          v-if="leaseDetail?.status === LeaseStatus.ACTIVE" 
          type="danger" 
          @click="handleTerminate"
        >
          提前退租
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElIcon } from 'element-plus';
import { 
  ArrowLeft, 
  ArrowRight, 
  HomeFilled, 
  House, 
  UserFilled, 
  Document, 
  WarningFilled 
} from '@element-plus/icons-vue';
// 导入接口、类型和枚举
import { getLeaseDetail, updateLeaseStatus } from '@/api/lease';
import type { LeaseDetail } from '@/api/lease/type';
import { LeaseStatus, LeaseStatusMap, LeaseSourceTypeMap } from '@/enums/constEnums';
import type { LeaseOperateParams } from '@/api/lease/type';

// 路由相关
const route = useRoute();
const router = useRouter();
const leaseId = Number(route.params.id);

// 状态管理
const leaseDetail = ref<LeaseDetail | null>(null);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const defaultImg = 'https://picsum.photos/200/200'; // 图片占位符

// 表单数据（用于展示，与租约详情同步）
const lesseeForm = ref({
  name: '',
  phone: '',
  idCard: ''
});
const leaseForm = ref({
  leaseTerm: '',
  leaseDateRange: '',
  rent: '',
  deposit: '',
  paymentType: '',
  sourceType: '',
  remark: ''
});

// 计算属性：是否可编辑（根据状态判断）
const canEdit = computed(() => {
  const status = leaseDetail.value?.status;
  return status === LeaseStatus.CONFIRMED || status === LeaseStatus.PENDING;
});

// 1. 获取租约详情
const fetchLeaseDetail = async () => {
  loading.value = true;
  error.value = false;
  try {
    if (isNaN(leaseId)) throw new Error('无效的租约ID');
    
    const res = await getLeaseDetail(leaseId);
    if (!res.data?.id) throw new Error('未获取到租约信息');
    
    leaseDetail.value = res.data;
    // 同步表单数据
    syncFormData(res.data);
  } catch (err) {
    error.value = true;
    errorMessage.value = err instanceof Error ? err.message : '加载租约详情失败';
    console.error('获取租约详情错误：', err);
  } finally {
    loading.value = false;
  }
};

// 2. 同步租约数据到表单
const syncFormData = (data: LeaseDetail) => {
  // 承租人信息
  lesseeForm.value = {
    name: data.name || '',
    phone: data.phone || '',
    idCard: data.identificationNumber || ''
  };
  // 租约信息
  leaseForm.value = {
    leaseTerm: `${data.leaseTermMonthCount || 0}${data.leaseTermUnit || '月'}`,
    leaseDateRange: `${formatDate(data.leaseStartDate)} 至 ${formatDate(data.leaseEndDate)}`,
    rent: `${data.rent || 0}元/月`,
    deposit: `${data.deposit || 0}元`,
    paymentType: data.paymentTypeName || '未设置',
    sourceType: LeaseSourceTypeMap[data.sourceType as keyof typeof LeaseSourceTypeMap] || '未知',
    remark: data.additionalInfo || ''
  };
};

// 3. 状态文本映射（严格接收LeaseStatus类型）
const getStatusText = (status: LeaseStatus) => {
  return LeaseStatusMap[status] || '未知状态';
};

// 4. 状态标签样式（严格接收LeaseStatus类型）
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
    default: // 处理PENDING及其他状态
      return 'info';
  }
};

// 5. 日期格式化
const formatDate = (dateString?: string) => {
  if (!dateString) return '未设置';
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    return '日期格式错误';
  }
};

// 6. 跳转公寓详情页
const goToApartmentDetail = () => {
  const apartmentId = leaseDetail.value?.apartmentId;
  if (!apartmentId) {
    ElMessage.warning('未获取到公寓ID');
    return;
  }
  router.push(`/apartment-detail/${apartmentId}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      ElMessage.error('跳转公寓详情失败');
    }
  });
};

// 7. 跳转房间详情页
const goToRoomDetail = () => {
  const roomId = leaseDetail.value?.roomId;
  if (!roomId) {
    ElMessage.warning('未获取到房间ID');
    return;
  }
  router.push(`/room-detail/${roomId}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      ElMessage.error('跳转房间详情失败');
    }
  });
};

// 8. 确认签约（状态更新：已确认→生效中）
const handleConfirmSign = async () => {
  try {
    await ElMessageBox.confirm(
      '确认签约后，租约将变为生效状态，是否继续？',
      '确认签约',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      }
    );
    
    const params: LeaseOperateParams = {
      id: leaseId,
      leaseStatus: LeaseStatus.ACTIVE
    };
    await updateLeaseStatus(params);
    ElMessage.success('签约确认成功');
    fetchLeaseDetail(); // 刷新详情
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('签约确认失败，请重试');
      console.error('确认签约错误：', err);
    }
  }
};

// 9. 申请续约
const handleRenew = () => {
  router.push(`/lease/renew/${leaseId}?isRenew=true`).catch(err => {
    ElMessage.error('跳转续约页失败');
    console.error('续约页跳转错误：', err);
  });
};

// 10. 提前退租（状态更新：生效中→已解除）
const handleTerminate = async () => {
  try {
    await ElMessageBox.confirm(
      '提前退租后将终止当前租约，是否继续？',
      '警告',
      {
        confirmButtonText: '确认退租',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    const params: LeaseOperateParams = {
      id: leaseId,
      leaseStatus: LeaseStatus.TERMINATED
    };
    await updateLeaseStatus(params);
    ElMessage.success('退租申请提交成功');
    fetchLeaseDetail(); // 刷新详情
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('退租操作失败，请重试');
      console.error('提前退租错误：', err);
    }
  }
};

// 11. 编辑租约（跳转编辑页）
const handleEdit = () => {
  router.push(`/lease/edit/${leaseId}?isEdit=true`).catch(err => {
    ElMessage.error('跳转编辑页失败');
    console.error('编辑页跳转错误：', err);
  });
};

// 监听租约ID变化（防止同页面参数更新）
watch(() => route.params.id, () => {
  fetchLeaseDetail();
}, { immediate: false });

// 页面挂载时加载数据
onMounted(() => {
  fetchLeaseDetail();
});
</script>

<style scoped>
.lease-detail-page {
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

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 80px 20px;
  color: #606266;
}

.error-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 16px;
}

.error-text {
  margin-bottom: 24px;
  font-size: 16px;
}

/* 详情内容容器 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* section卡片样式 */
.section-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/*  section标题 */
.section-title {
  font-size: 16px;
  color: #303133;
  padding: 15px 20px;
  margin: 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.section-icon {
  margin-right: 8px;
  color: #409eff;
}

/* 卡片内容区 */
.card-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

/* 图片样式 */
.section-img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 信息容器 */
.info-wrapper {
  flex: 1;
  min-width: 0;
}

.info-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 箭头图标 */
.arrow-icon {
  color: #c0c4cc;
  flex-shrink: 0;
}

/* 表单卡片 */
.form-card {
  padding: 20px;
}

.info-form {
  width: 100%;
}

.info-form .el-form-item {
  margin-bottom: 16px;
}

/* 操作按钮区 */
.action-section {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  justify-content: flex-start;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .card-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-img {
    width: 100%;
    height: 160px;
  }

  .action-section {
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 1.3rem;
  }
}
</style>