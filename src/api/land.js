import { request } from './index'

export function getLandList(data) {
  return request('/api/land/list', data)
}

export function getLandDetail(data) {
  return request('/api/land/detail', data)
}

export function landMaintain(data) {
  return request('/api/land/maintain', data)
}

export function landMonitor(data) {
  return request('/api/land/monitor', data)
}
