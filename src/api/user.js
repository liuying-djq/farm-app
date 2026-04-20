import { request, getRequest } from './index'

/**
 * 用户登录
 */
export function login(data) {
  return request('/api/user/login', data)
}

/**
 * 用户注册
 */
export function register(data) {
  return request('/api/user/register', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo(userId) {
  return getRequest('/api/user/info', { userId })
}
