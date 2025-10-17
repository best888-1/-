// src/utils/token.ts
const TOKEN_KEY = 'lease_app_token';

// 获取Token
export const getToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) || '';
};

// 设置Token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// 移除Token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};