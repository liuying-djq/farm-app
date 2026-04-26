import { request } from './index'

export function createLease(data) {
  return request('/api/lease/create', data)
}

export function getLeaseContract(data) {
  return request('/api/lease/contract', data)
}

export function getMyLeases(data) {
  return request('/api/lease/my', data)
}

// 退租
export function terminateLease(data) {
  return request('/api/lease/terminate', data)
}

// 续租
export function renewLease(data) {
  return request('/api/lease/renew', data)
}

// 获取活跃租赁
export function getActiveLeases(data) {
  return request('/api/lease/active', data)
}
