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
 * 获取卖家的所有订单（排序：未付款在前，已付款在后）
 */
export function getSellerOrders(sellerId) {
  return getRequest('/api/order/sellerOrders', { sellerId })
}

/**
 * 买家付款
 */
export function payOrder(data) {
  return request('/api/order/pay', data)
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

/**
 * 退款
 */
export function refundOrder(data) {
  return request('/api/order/refund', data)
}
