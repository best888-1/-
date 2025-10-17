import { type RouteRecordRaw } from 'vue-router';
import RoomDetail from '@/views/roomDetail/roomDetail.vue';
import ApartmentDetail from '@/views/apartmentDetail/apartmentDetail.vue';
import MyAppointment from '@/views/myAppointment/index.vue';
import AppointmentDetail from '@/views/myAppointment/detail.vue';
import BrowsingHistory from '@/views/browsingHistory/browsingHistory.vue';
import MyLease from '@/views/Lease/myLease.vue';
import LeaseDetail from '@/views/Lease/detail.vue';
import UserCenter from '@/views/Center/index.vue';


const otherRoutes: RouteRecordRaw[] = [
  // 房间详情页（存在：views/roomDetail/roomDetail.vue）
  {
    path: '/room-detail/:id',
    name: 'RoomDetail',
    component: RoomDetail,
    meta: {
      title: '房间详情',
    },
  },
  
  // 公寓详情页（存在：views/apartmentDetail/apartmentDetail.vue）
  {
    path: '/apartment-detail/:id',
    name: 'ApartmentDetail',
    component: ApartmentDetail,
    meta: {
      title: '公寓详情',
    },
  },
  // 我的预约列表（存在：views/myAppointment/index.vue）
  {
    path: '/my-appointment',
    name: 'MyAppointment',
    component: MyAppointment,
    meta: {
      title: '我的预约',
    },
  },
  
  // 预约详情页（存在：views/myAppointment/detail.vue）
  {
    path: '/my-appointment/detail/:id',
    name: 'AppointmentDetail',
    component: AppointmentDetail,
    meta: {
      title: '预约详情',
    },
  },
  
  // 个人中心（存在：views/Center/index.vue）
  {
    path: '/Center',
    name: 'UserCenter',
    component: UserCenter,
    meta: {
      title: '个人中心',
    },
  },
  
  // 浏览历史（存在：views/browsingHistory/browsingHistory.vue）
  {
    path: '/user/browsing-history',
    name: 'BrowsingHistory',
    component: BrowsingHistory,
    meta: {
      title: '浏览历史',
    },
  },
  
  // 我的租约列表（存在：views/lease/Lease/myLease.vue）
  {
    path: '/lease/my-lease',
    name: 'MyLease',
    component: MyLease,
    meta: {
      title: '我的租约',
    },
  },
  
  // 租约详情（存在：views/Lease/detail.vue）
  {
    path: '/lease/detail/:id',
    name: 'LeaseDetail',
    component: LeaseDetail,
    meta: {
      title: '租约详情',
    },
  },
  
  // 租约续约（存在：通过myLease组件跳转逻辑确认）
 
];

export default otherRoutes;