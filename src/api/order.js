import { request, getRequest } from './index'

/**
 * 购买产品
 */
export function buyProduct(data) {
  return request('/api/order/buy', data)
}

/**
 * 获取待发货订单（卖家）
 */
export function getPendingOrders(sellerId) {
  return getRequest('/api/order/pending', { sellerId })
}

/**
 * 获取我的订单（买家）
 */
export function getMyOrders(buyerId) {
  return getRequest('/api/order/list', { buyerId })
}

/**
 * 发货
 */
export function shipOrder(data) {
  return request('/api/order/ship', data)
}

/**
 * 确认收货
 */
export function confirmReceipt(data) {
  return request('/api/order/confirm', data)
}
