import { request } from './index'

export function getLandList(data) {
  return request('/api/land/list', data)
}

export function getLandDetail(data) {
  return request('/api/land/detail', data)
}
