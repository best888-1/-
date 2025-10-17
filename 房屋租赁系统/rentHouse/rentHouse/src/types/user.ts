import type { PageResult } from "./api";
import type { GraphVo } from "./common";

// 登录参数（与前端登录表单字段匹配）
export interface LoginParams {
  phone: string; // 登录手机号
}

export type TokenString = string;
export interface UserStoreState {
  token: TokenString;              // 登录令牌
  userInfo: UserInfo | null;       // 用户信息（未登录时为null）
}

// 用户信息（与后端UserInfoVo完全匹配）
export interface UserInfo {
  userId: number | string; // 用户ID（唯一标识）
  nickname: string;        // 用户昵称
  avatarUrl?: string | null; // 头像地址（可选，默认空）
  phone?: string;          // 绑定手机号（可选，个人中心展示）
  createTime?: string;     // 账号创建时间（可选，格式：yyyy-MM-dd HH:mm:ss）
}

