<template>
  <view class="home">
    <view class="banner">
      <view class="banner-content">
        <text class="banner-title">智慧农场</text>
        <text class="banner-desc">租赁土地 · 体验种植 · 共享收获</text>
      </view>
    </view>

    <view class="nav-grid">
      <view class="nav-item" @click="goTo('/pages/lease/index')">
        <view class="nav-icon nav-icon-lease">
          <text class="nav-icon-text">租</text>
        </view>
        <text class="nav-label">土地租赁</text>
      </view>
      <view class="nav-item" @click="goTo('/pages/plant/index')">
        <view class="nav-icon nav-icon-plant">
          <text class="nav-icon-text">种</text>
        </view>
        <text class="nav-label">我的种植</text>
      </view>
      <view class="nav-item" @click="goTo('/pages/market/index')">
        <view class="nav-icon nav-icon-market">
          <text class="nav-icon-text">享</text>
        </view>
        <text class="nav-label">农产品共享</text>
      </view>
      <view class="nav-item" @click="goTo('/pages/mine/index')">
        <view class="nav-icon nav-icon-mine">
          <text class="nav-icon-text">我</text>
        </view>
        <text class="nav-label">个人中心</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">可租土地</text>
        <text class="section-more" @click="goTo('/pages/lease/index')">查看更多 ></text>
      </view>
      <view class="land-list" v-if="lands.length">
        <view class="land-card" v-for="item in lands" :key="item.id" @click="goToDetail(item.id)">
          <view class="land-info">
            <text class="land-name">{{ item.name }}</text>
            <text class="land-location">{{ item.location }}</text>
          </view>
          <view class="land-meta">
            <text class="land-area">{{ item.area }}亩</text>
            <text class="land-price">{{ item.price }}元/亩/年</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-tip">
        <text>暂无可租土地</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">热销农产品</text>
        <text class="section-more" @click="goTo('/pages/market/index')">查看更多 ></text>
      </view>
      <view class="product-list" v-if="products.length">
        <view class="product-card" v-for="item in products" :key="item.id">
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-desc">{{ item.description }}</text>
          </view>
          <view class="product-bottom">
            <text class="product-price">¥{{ item.price }}/{{ item.unit }}</text>
            <text class="product-qty">剩余{{ item.quantity }}{{ item.unit }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-tip">
        <text>暂无热销产品</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getLandList } from '../../api/land'
import { getMarketAll } from '../../api/market'

export default {
  data() {
    return {
      lands: [],
      products: []
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const [landRes, productRes] = await Promise.all([
        getLandList({ status: 'available' }),
        getMarketAll()
      ])
      if (landRes && landRes.data) {
        this.lands = landRes.data.slice(0, 3)
      }
      if (productRes && productRes.data) {
        this.products = productRes.data.slice(0, 3)
      }
    },
    goTo(url) {
      uni.switchTab({ url })
    },
    goToDetail(id) {
      uni.navigateTo({ url: '/pages/lease/detail?id=' + id })
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.banner {
  background: linear-gradient(180deg, #1677FF 0%, #4096FF 100%);
  padding: 80rpx 40rpx 60rpx;
  position: relative;
}

.banner-content {
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-size: 52rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12rpx;
  letter-spacing: 1rpx;
}

.banner-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.nav-grid {
  display: flex;
  justify-content: space-around;
  padding: 40rpx 20rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.nav-icon-text {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
}

.nav-icon-lease {
  background: linear-gradient(135deg, #1677FF, #4096FF);
}

.nav-icon-plant {
  background: linear-gradient(135deg, #52C41A, #73D13D);
}

.nav-icon-market {
  background: linear-gradient(135deg, #FA8C16, #FFC53D);
}

.nav-icon-mine {
  background: linear-gradient(135deg, #722ED1, #B37FEB);
}

.nav-label {
  font-size: 24rpx;
  color: #333333;
}

.section {
  background-color: #ffffff;
  margin-bottom: 20rpx;
  padding: 32rpx 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.section-more {
  font-size: 24rpx;
  color: #1677FF;
}

.land-card {
  padding: 24rpx;
  background-color: #f5f7fa;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.land-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.land-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.land-location {
  font-size: 24rpx;
  color: #999999;
}

.land-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.land-area {
  font-size: 26rpx;
  color: #666666;
}

.land-price {
  font-size: 28rpx;
  color: #1677FF;
  font-weight: 600;
}

.product-card {
  padding: 24rpx;
  background-color: #f5f7fa;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.product-info {
  margin-bottom: 12rpx;
}

.product-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  display: block;
  margin-bottom: 8rpx;
}

.product-desc {
  font-size: 24rpx;
  color: #999999;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 30rpx;
  color: #FF3B30;
  font-weight: 600;
}

.product-qty {
  font-size: 24rpx;
  color: #999999;
}

.empty-tip {
  text-align: center;
  padding: 60rpx;
  color: #cccccc;
  font-size: 28rpx;
}
</style>
