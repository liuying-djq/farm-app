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
