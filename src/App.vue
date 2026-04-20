<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
    // 检查登录状态
    const userId = uni.getStorageSync('userId')
    if (!userId) {
      // 未登录，跳转到登录页
      uni.reLaunch({ url: '/pages/user/login' })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: #333333;
}

.container {
  padding: 20rpx;
}

.primary-color {
  color: #4CAF50;
}

.bg-primary {
  background-color: #4CAF50;
}
</style>
