<template>
  <div class="appointment-detail-page">
    <div class="page-header">
      <el-button type="text" icon="ArrowLeft" @click="$router.back()"></el-button>
      <h1>预约详情</h1>
      <el-button 
        v-if="appointmentId !== 0" 
        type="text" 
        :style="{ marginLeft: 'auto' }"
        @click="toggleEditMode"
      >
        {{ isView ? '编辑' : '取消编辑' }}
      </el-button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-loading-spinner />
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ errorMessage }}</p>
      <el-button @click="fetchAllData()">重新加载</el-button>
    </div>

    <div v-else class="detail-content">
      <!-- 公寓信息区域 -->
      <div class="apartment-section">
        <h2 class="section-title">
          预约公寓
          <el-button 
            type="text" 
            size="small" 
            style="margin-left: auto; padding: 0"
            @click="toApartmentDetail()"
          >
            查看公寓详情 <ArrowRight size="14" />
          </el-button>
        </h2>
        <div class="apartment-card">
          <div class="apartment-img">
            <img 
              :src="apartmentDetail?.graphVoList[0]?.url || defaultImg" 
              :alt="apartmentDetail?.name || '公寓图片'"
              loading="lazy"
            >
          </div>
          <div class="apartment-info">
            <h3 class="apartment-name">{{ apartmentDetail?.name || '未获取到公寓名称' }}</h3>
            <p class="apartment-address">
              {{ apartmentDetail?.districtName }} {{ apartmentDetail?.addressDetail || '未获取到地址' }}
            </p>
            <div class="apartment-tags" v-if="apartmentDetail?.labelInfoList?.length">
              <el-tag 
                v-for="tag in apartmentDetail.labelInfoList" 
                :key="tag.id" 
                size="small" 
                effect="plain" 
                type="success"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <p class="apartment-price">
              租金：¥{{ apartmentDetail?.minRent?.toLocaleString() }}
              <span v-if="apartmentDetail?.maxRent">- ¥{{ apartmentDetail?.maxRent?.toLocaleString() }}</span>
              /月
            </p>
          </div>
        </div>
      </div>

      <!-- 预约信息表单（关键修复：添加ref绑定） -->
      <div class="appointment-section">
        <h2 class="section-title">预约信息</h2>
        <!-- 修复1：表单添加ref绑定，确保formRef能获取到实例 -->
        <el-form 
          ref="formRef"  
          :model="form" 
          label-width="100px" 
          class="info-form"
          :disabled="isView"
        >
          <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone" :rules="[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机号', trigger: 'blur' }]">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="预约时间" prop="appointmentTime" :rules="[{ required: true, message: '请选择预约时间', trigger: 'change' }]">
            <AppointmentTimePicker 
              v-model="form.appointmentTime" 
              :apartment-id="apartmentId"
            />
          </el-form-item>
          <el-form-item label="备注信息" prop="additionalInfo">
            <el-input 
              v-model="form.additionalInfo" 
              type="textarea" 
              placeholder="请输入备注（最多50字）" 
              :maxlength="50" 
              show-word-limit 
            />
          </el-form-item>
          <el-form-item v-if="!isView">
            <el-button type="primary" @click="submitAppointment()">保存预约</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElForm } from 'element-plus';
import { ArrowLeft, ArrowRight, Location } from '@element-plus/icons-vue';
import AppointmentTimePicker from '@/components/Appointment/AppointmentTimePicker.vue';
import { getAppointmentDetail, createOrUpdateAppointment } from '@/api/appointment';
import { getApartmentDetail } from '@/api/apartment';
import { getUserInfo } from '@/api/user';
import type { AppointmentDetail } from '@/api/appointment/types';
import type { ApartmentDetailVo } from '@/api/apartment/type';
import type { UserInfo } from '@/types/user';
import type { CreateAppointmentParams } from '@/api/appointment/types';

// 路由相关
const route = useRoute();
const router = useRouter();
const appointmentId = Number(route.params.id);
const apartmentId = Number(route.query.apartmentId) || 0;
const editModeFromRoute = route.query.editMode === 'true';

// 状态管理
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const defaultImg = 'https://picsum.photos/400/300?random=1';
const appointmentDetail = ref<AppointmentDetail | null>(null);
const apartmentDetail = ref<ApartmentDetailVo | null>(null);
const userInfo = ref<UserInfo | null>(null);
const localEditMode = ref(editModeFromRoute);

// 表单数据
const form = ref({
  name: '',
  phone: '',
  appointmentTime: '',
  additionalInfo: ''
});

// 修复2：确保表单实例正确声明（与模板ref对应）
const formRef = ref<InstanceType<typeof ElForm> | null>(null);

// 查看模式判断
const isView = computed(() => {
  if (appointmentId === 0) return false;
  return !localEditMode.value;
});

// 切换编辑/查看模式
const toggleEditMode = () => {
  localEditMode.value = !localEditMode.value;
};

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo();
    userInfo.value = res.data;
    if (userInfo.value) {
      form.value.name = userInfo.value.nickname || '';
      form.value.phone = userInfo.value.phone || '';
    }
  } catch (err) {
    console.error('获取用户信息失败：', err);
    ElMessage.warning('未获取到用户信息，需手动填写姓名和手机号');
  }
};

// 获取预约详情
const fetchAppointmentDetail = async () => {
  try {
    if (isNaN(appointmentId)) throw new Error('无效的预约ID');
    const res = await getAppointmentDetail(appointmentId);
    appointmentDetail.value = res.data;
    if (appointmentDetail.value) {
      form.value.name =  '';
      form.value.phone = appointmentDetail.value.phone || '';
      form.value.appointmentTime = appointmentDetail.value.appointmentTime || '';
      form.value.additionalInfo = appointmentDetail.value.additionalInfo || '';
      return appointmentDetail.value.apartmentId || 0;
    }
    return 0;
  } catch (err) {
    console.error('获取预约详情失败：', err);
    throw err instanceof Error ? err : new Error('获取预约信息失败');
  }
};

// 获取公寓详情
const fetchApartmentDetail = async (targetApartmentId: number) => {
  try {
    if (isNaN(targetApartmentId) || targetApartmentId === 0) throw new Error('无效的公寓ID');
    const res = await getApartmentDetail(targetApartmentId);
    apartmentDetail.value = res.data;
  } catch (err) {
    console.error('获取公寓详情失败：', err);
    ElMessage.warning('未获取到公寓详情，部分信息可能显示异常');
  }
};

// 统一拉取数据
const fetchAllData = async () => {
  loading.value = true;
  error.value = false;
  try {
    await fetchUserInfo();
    let targetApartmentId = apartmentId;
    if (appointmentId !== 0) {
      targetApartmentId = await fetchAppointmentDetail();
    }
    if (targetApartmentId) {
      await fetchApartmentDetail(targetApartmentId);
    } else {
      throw new Error('未获取到公寓ID，无法展示公寓详情');
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = err instanceof Error ? err.message : '数据加载失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 修复3：完善表单校验逻辑，添加错误提示
const submitAppointment = async () => {
  // 校验表单实例是否存在
  if (!formRef.value) {
    ElMessage.error('表单初始化失败，请刷新页面重试');
    return;
  }

  try {
    // 修复4：使用async/await正确处理校验结果
    await formRef.value.validate(); // 校验通过才会继续执行

    // 构建提交参数
    const params: CreateAppointmentParams = {
      id: appointmentId,
      apartmentId: apartmentId || appointmentDetail.value?.apartmentId || 0,
      name: form.value.name,
      phone: form.value.phone,
      appointmentTime: form.value.appointmentTime,
      additionalInfo: form.value.additionalInfo
    };

    // 校验关键参数
    if (!params.apartmentId) {
      ElMessage.error('未获取到公寓信息，无法提交');
      return;
    }
    if (!params.appointmentTime) {
      ElMessage.error('请选择预约时间');
      return;
    }

    // 提交表单
    loading.value = true;
    await createOrUpdateAppointment(params);
    ElMessage.success(appointmentId === 0 ? '预约创建成功' : '预约修改成功');
    router.push('/my-appointment'); // 跳转回列表页
  } catch (err) {
    // 修复5：区分校验失败和接口失败的错误提示
    if (err instanceof Error) {
      // 表单校验失败的错误信息
      if (err.message.includes('Validation failed')) {
        ElMessage.error('请完善表单信息后再提交');
      } else {
        ElMessage.error(err.message || '提交失败，请重试');
      }
    } else {
      ElMessage.error('网络异常，提交失败');
    }
    console.error('提交预约失败：', err);
  } finally {
    loading.value = false; // 确保加载状态关闭
  }
};

// 跳转到公寓详情页
const toApartmentDetail = () => {
  const targetApartmentId = apartmentId || appointmentDetail.value?.apartmentId;
  if (!targetApartmentId) {
    ElMessage.warning('未获取到公寓ID，无法跳转');
    return;
  }
  router.push(`/apartment-detail/${targetApartmentId}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      console.error('跳转公寓详情页失败：', err);
      ElMessage.error('跳转失败，请稍后重试');
    }
  });
};

// 监听路由变化
watch(() => [route.params.id, route.query.apartmentId], () => {
  fetchAllData();
}, { immediate: false });

// 页面挂载时加载数据
onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
/* 样式保持不变 */
.appointment-detail-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

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

.loading-state, .error-state {
  text-align: center;
  padding: 100px 0;
  color: #606266;
}

.error-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

.detail-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-title {
  font-size: 1.2rem;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
  margin: 0;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.apartment-section {
  border-bottom: 1px solid #f5f5f5;
}

.apartment-card {
  display: flex;
  padding: 20px;
  gap: 20px;
  flex-wrap: wrap;
}

.apartment-img {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.apartment-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.apartment-info {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.apartment-name {
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: #303133;
}

.apartment-address {
  color: #606266;
  font-size: 14px;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
}

.apartment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 12px 0;
}

.apartment-price {
  font-size: 14px;
  color: #f5222d;
  margin: 0;
  font-weight: 500;
}

.appointment-section {
  padding: 20px;
}

.info-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 15px;
}

@media (max-width: 480px) {
  .apartment-card {
    flex-direction: column;
  }

  .apartment-img {
    width: 100%;
    height: 200px;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .page-header h1 {
    font-size: 1.3rem;
  }
}
</style>