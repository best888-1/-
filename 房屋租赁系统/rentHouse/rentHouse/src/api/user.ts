import http from '@/utils/http';
// 引入业务类型和通用响应类型
import type {  LoginParams, TokenString, UserInfo } from '@/types/user';
import type { ApiResponse } from '@/types/api';

/**
 * 登录接口
 * @param params 登录参数（手机号）
 * @returns 后端响应（包含Token字符串）
 */
export const login = (params: LoginParams): Promise<ApiResponse<TokenString>> => {
  return http.post('/app/login', params, { 
    showLoading: true, 
    ignoreAuth: true  
  });
};

/**
 * 获取用户信息接口
 * @returns 后端响应（包含用户信息对象）
 */
export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return http.get('/app/info', undefined, { showLoading: true });
};

/**
 * 退出登录接口
 * @returns 后端响应（无核心数据）
 */
