import { mockRequest, MOCK_ENABLED } from '../mock/index'
import '../mock/land'
import '../mock/lease'
import '../mock/plant'
import '../mock/market'
import '../mock/user'

const BASE_URL = 'http://localhost:8080'

export function request(path, data = {}) {
  if (MOCK_ENABLED) {
    return mockRequest(path, data)
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + path,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export function getRequest(path, params = {}) {
  if (MOCK_ENABLED) {
    return mockRequest(path, params)
  }
  // 将参数拼接到URL上
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  const url = queryString ? `${BASE_URL}${path}?${queryString}` : `${BASE_URL}${path}`
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
