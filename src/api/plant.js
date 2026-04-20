import { request } from './index'

export function getPlantList(data) {
  return request('/api/plant/list', data)
}

export function getPlantListByLand(data) {
  return request('/api/plant/listByLand', data)
}

export function getPlantDetail(data) {
  return request('/api/plant/detail', data)
}

export function createPlant(data) {
  return request('/api/plant/create', data)
}

export function updatePlant(data) {
  return request('/api/plant/update', data)
}

export function deletePlant(data) {
  return request('/api/plant/delete', data)
}
