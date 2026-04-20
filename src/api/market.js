import { request } from './index'

export function getMarketList(data) {
  return request('/api/market/list', data)
}

export function getMarketAll(data) {
  return request('/api/market/all', data || {})
}

export function getMyProducts(data) {
  return request('/api/market/myList', data)
}

export function getMarketDetail(data) {
  return request('/api/market/detail', data)
}

export function createProduct(data) {
  return request('/api/market/create', data)
}

export function updateProduct(data) {
  return request('/api/market/update', data)
}

export function offShelfProduct(data) {
  return request('/api/market/offShelf', data)
}

export function onShelfProduct(data) {
  return request('/api/market/onShelf', data)
}

export function deleteProduct(data) {
  return request('/api/market/delete', data)
}
