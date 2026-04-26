<template>
  <view class="mine-page">
    <view class="profile-card">
      <view class="avatar-wrap" @click="goEdit">
        <view class="avatar">
          <text class="avatar-text">{{ userInfo.nickname ? userInfo.nickname.charAt(0) : '用' }}</text>
        </view>
      </view>
      <text class="nickname" @click="goEdit">{{ userInfo.nickname }}</text>
      <text class="phone" @click="goEdit">{{ userInfo.phone }}</text>
    </view>

    <view class="stats-card">
      <view class="stat-item" @click="goTo('/pages/lease/index')">
        <text class="stat-num">{{ userInfo.leaseCount }}</text>
        <text class="stat-label">租赁土地</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @click="goTo('/pages/plant/index')">
        <text class="stat-num">{{ userInfo.plantCount }}</text>
        <text class="stat-label">种植作物</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item" @click="goTo('/pages/market/index')">
        <text class="stat-num">{{ userInfo.productCount }}</text>
        <text class="stat-label">共享产品</text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @click="goTo('/pages/mine/leases')">
        <text class="menu-text">租赁记录</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goTo('/pages/mine/plants')">
        <text class="menu-text">种植记录</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goTo('/pages/mine/sales')">
        <text class="menu-text">售卖记录</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @click="goTo('/pages/mine/contracts')">
        <text class="menu-text">我的合同</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item" @click="showAbout">
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="showContact">
        <text class="menu-text">联系客服</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-item menu-item-logout" @click="handleLogout">
        <text class="menu-text menu-text-logout">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from '../../api/user'

export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        phone: '',
        leaseCount: 0,
        plantCount: 0,
        productCount: 0
      }
    }
  },
  onShow() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      try {
        const userId = uni.getStorageSync('userId')
        if (!userId) return
        
        const res = await getUserInfo(userId)
        console.log('用户信息接口返回:', res)
        if (res && res.data) {
          this.userInfo = res.data
          console.log('更新后的userInfo:', this.userInfo)
        } else {
          console.error('接口返回数据异常:', res)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },
    goTo(url) {
      const tabPages = ['/pages/lease/index', '/pages/plant/index', '/pages/market/index', '/pages/index/index']
      if (tabPages.includes(url)) {
        uni.switchTab({ url })
      } else {
        uni.navigateTo({ url })
      }
    },
    switchToMarket() {
      uni.switchTab({ url: '/pages/market/index' })
    },
    showAbout() {
      uni.showModal({
        title: '关于智慧农场',
        content: '智慧农场 v1.0.0\n租赁土地 · 体验种植 · 共享收获',
        showCancel: false
      })
    },
    showContact() {
      uni.showModal({
        title: '联系客服',
        content: '客服电话：400-888-9999\n工作时间：9:00-18:00',
        showCancel: false
      })
    },
    goEdit() {
      uni.navigateTo({ url: '/pages/mine/edit' })
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除本地存储
            uni.removeStorageSync('userId')
            uni.removeStorageSync('userInfo')
            
            uni.showToast({ title: '已退出登录', icon: 'success' })
            
            setTimeout(() => {
              // 跳转到登录页
              uni.reLaunch({ url: '/pages/user/login' })
            }, 1500)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-card {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  padding: 50rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrap {
  margin-bottom: 16rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: bold;
}

.nickname {
  font-size: 34rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.stats-card {
  display: flex;
  background-color: #ffffff;
  margin: -30rpx 20rpx 20rpx;
  border-radius: 12rpx;
  padding: 30rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999999;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background-color: #f0f0f0;
  align-self: center;
}

.menu-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  margin: 0 20rpx 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 28rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 24rpx;
  color: #cccccc;
}

.menu-item-logout {
  justify-content: center;
}

.menu-text-logout {
  color: #FF3B30;
  font-weight: 500;
}
</style>
