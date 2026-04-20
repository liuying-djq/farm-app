import { request } from './index'

/**
 * 获取租赁记录
 */
export function getLeaseRecords(data) {
  return request('/api/record/lease/list', data)
}

/**
 * 添加租赁记录
 */
export function addLeaseRecord(data) {
  return request('/api/record/lease/add', data)
}

/**
 * 获取种植记录
 */
export function getPlantRecords(data) {
  return request('/api/record/plant/list', data)
}

/**
 * 添加种植记录
 */
export function addPlantRecord(data) {
  return request('/api/record/plant/add', data)
}

/**
 * 获取售卖记录
 */
export function getSalesRecords(data) {
  return request('/api/record/sales/list', data)
}

/**
 * 添加售卖记录
 */
export function addSalesRecord(data) {
  return request('/api/record/sales/add', data)
}

