import { defineStore } from 'pinia';
import { login as loginApi, getUserInfo as getUserInfoApi} from '@/api/user';
import type { UserStoreState, LoginParams, UserInfo, TokenString } from '@/types/user';
import type { ApiResponse } from '@/types/api';


// 显式声明 actions 类型
interface UserStoreActions {
  login(params: LoginParams): Promise<void>;
  getUserInfo(): Promise<void>;
  logout(): Promise<void>;
}

export const useUserStore = defineStore<'user', UserStoreState, {}, UserStoreActions>('user', {
  state: (): UserStoreState => ({
    token: '',
    userInfo: null
  }),
  actions: {
    async login(params: LoginParams) {
      const response: ApiResponse<TokenString> = await loginApi(params);
      this.token = response.data;
      await this.getUserInfo();
    },
    async getUserInfo() {
  try {
    const response: ApiResponse<UserInfo> = await getUserInfoApi();
    this.userInfo = response.data;
  } catch (error) {
    // 明确抛出错误，让路由守卫能捕获到
    throw new Error('获取用户信息失败');
  }
},
    async logout() {
   this.token = '';
  this.userInfo = null;
    }
  },
  persist: {
        key: 'user_store',
        storage: localStorage,
        paths: ['token', 'userInfo'], // "paths" 必须放在 strategies 数组的对象里
  },
});