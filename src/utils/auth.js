/**
 * 获取当前登录用户ID
 */
export function getCurrentUserId() {
  return uni.getStorageSync('userId') || 1
}

/**
 * 获取当前登录用户信息
 */
export function getCurrentUser() {
  return uni.getStorageSync('userInfo') || {}
}

/**
 * 检查是否已登录
 */
export function isLoggedIn() {
  return !!uni.getStorageSync('userId')
}

/**
 * 确保已登录，未登录则跳转登录页
 */
export function requireLogin() {
  if (!isLoggedIn()) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/user/login' })
    }, 1500)
    return false
  }
  return true
}
