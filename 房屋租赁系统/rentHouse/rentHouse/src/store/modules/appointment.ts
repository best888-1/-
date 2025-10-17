import { defineStore } from 'pinia';
import type { RoomDetailVo } from '@/api/room/types';

interface AppointmentState {
  currentRoom: RoomDetailVo; // 当前预约的房间信息
  appointmentList: any[]; // 预约列表缓存
}

export const useAppointmentStore = defineStore('appointment', {
  state: (): AppointmentState => ({
    currentRoom: {} as RoomDetailVo,
    appointmentList: []
  }),
  actions: {
    // 设置当前预约的房间
    setCurrentRoom(room: RoomDetailVo) {
      this.currentRoom = room;
    },
    // 更新预约列表缓存
    updateAppointmentList(list: any[]) {
      this.appointmentList = list;
    }
  }
});