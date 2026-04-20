<template>
  <view class="login-page">
    <view class="logo-section">
      <text class="app-title">智慧农场</text>
      <text class="app-subtitle">让种植更简单</text>
    </view>

    <view class="form-card">
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input class="form-input" v-model="form.username" placeholder="请输入用户名" />
      </view>

      <view class="form-item">
        <text class="form-label">密码</text>
        <input class="form-input" v-model="form.password" type="password" placeholder="请输入密码" />
      </view>

      <view class="action-btn login-btn" @click="handleLogin">
        <text class="btn-text">登录</text>
      </view>

      <view class="action-btn register-btn" @click="goRegister">
        <text class="btn-text">没有账号？立即注册</text>
      </view>
    </view>
  </view>
</template>

<script>
import { login } from '../../api/user'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.username) {
        uni.showToast({ title: '请输入用户名', icon: 'none' })
        return
      }
      if (!this.form.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
      }

      uni.showLoading({ title: '登录中...' })

      try {
        const res = await login(this.form)
        uni.hideLoading()

        if (res && res.code === 200) {
          // 保存用户信息到本地存储
          uni.setStorageSync('userInfo', res.data)
          uni.setStorageSync('userId', res.data.id)
          
          uni.showToast({ title: '登录成功', icon: 'success' })
          
          setTimeout(() => {
            // 跳转到首页
            uni.switchTab({ url: '/pages/index/index' })
          }, 1500)
        } else {
          uni.showToast({ title: res.message || '登录失败', icon: 'none' })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '登录失败', icon: 'none' })
      }
    },
    
    goRegister() {
      uni.navigateTo({ url: '/pages/user/register' })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120rpx 40rpx;
}

.logo-section {
  text-align: center;
  margin-bottom: 80rpx;
}

.app-title {
  font-size: 64rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 16rpx;
}

.app-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.form-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  font-size: 28rpx;
  color: #333333;
  padding: 20rpx 24rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
}

.action-btn {
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  margin-top: 24rpx;
}

.login-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.login-btn .btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}

.register-btn {
  background-color: #f5f7fa;
}

.register-btn .btn-text {
  font-size: 28rpx;
  color: #667eea;
}
</style>
