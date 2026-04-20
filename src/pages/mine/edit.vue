<template>
  <view class="edit-page">
    <view class="form-card">
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input class="form-input" v-model="form.nickname" placeholder="请输入昵称" />
      </view>

      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="form.phone" placeholder="请输入手机号" type="number" />
      </view>
    </view>

    <view class="submit-btn" @click="submit">
      <text class="submit-text">保存修改</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from '../../api/user'

export default {
  data() {
    return {
      form: {
        nickname: '',
        phone: ''
      }
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.form.nickname = userInfo.nickname || ''
        this.form.phone = userInfo.phone || ''
      }
    },
    async submit() {
      if (!this.form.nickname) {
        uni.showToast({ title: '请输入昵称', icon: 'none' })
        return
      }
      if (!this.form.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }

      // 更新本地存储的用户信息
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        userInfo.nickname = this.form.nickname
        userInfo.phone = this.form.phone
        uni.setStorageSync('userInfo', userInfo)
        
        uni.showToast({ title: '保存成功', icon: 'success' })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  }
}
</script>

<style scoped>
.edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.form-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.form-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
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
  padding: 12rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.submit-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
}

.submit-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
