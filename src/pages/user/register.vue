<template>
  <view class="register-page">
    <view class="logo-section">
      <text class="app-title">用户注册</text>
      <text class="app-subtitle">填写以下信息完成注册</text>
    </view>

    <view class="form-card">
      <view class="form-item">
        <text class="form-label">用户名 *</text>
        <input class="form-input" v-model="form.username" placeholder="请设置用户名" />
      </view>

      <view class="form-item">
        <text class="form-label">密码 *</text>
        <input class="form-input" v-model="form.password" type="password" placeholder="请设置密码" />
      </view>

      <view class="form-item">
        <text class="form-label">确认密码 *</text>
        <input class="form-input" v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
      </view>

      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" v-model="form.realName" placeholder="请输入真实姓名" />
      </view>

      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="form.phone" type="number" placeholder="请输入手机号" />
      </view>

      <view class="action-btn register-btn" @click="handleRegister">
        <text class="btn-text">立即注册</text>
      </view>

      <view class="action-btn login-btn" @click="goLogin">
        <text class="btn-text">已有账号？返回登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { register } from '../../api/user'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        realName: '',
        phone: ''
      }
    }
  },
  methods: {
    async handleRegister() {
      if (!this.form.username) {
        uni.showToast({ title: '请输入用户名', icon: 'none' })
        return
      }
      if (!this.form.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' })
        return
      }
      if (this.form.password !== this.form.confirmPassword) {
        uni.showToast({ title: '两次密码输入不一致', icon: 'none' })
        return
      }
      if (this.form.password.length < 6) {
        uni.showToast({ title: '密码至少6位', icon: 'none' })
        return
      }

      uni.showLoading({ title: '注册中...' })

      try {
        const res = await register(this.form)
        uni.hideLoading()

        if (res && res.code === 200) {
          uni.showToast({ title: '注册成功', icon: 'success' })
          
          setTimeout(() => {
            // 返回登录页
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({ title: res.message || '注册失败', icon: 'none' })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '注册失败', icon: 'none' })
      }
    },
    
    goLogin() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80rpx 40rpx;
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;
}

.app-title {
  font-size: 56rpx;
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

.register-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.register-btn .btn-text {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 600;
}

.login-btn {
  background-color: #f5f7fa;
}

.login-btn .btn-text {
  font-size: 28rpx;
  color: #667eea;
}
</style>
