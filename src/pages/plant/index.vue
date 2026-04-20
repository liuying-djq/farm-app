<template>
  <view class="plant-page">
    <view class="search-bar">
      <view class="search-input-wrap">
        <input class="search-input" v-model="searchKeyword" placeholder="搜索土地名称" @input="onSearch" />
        <view v-if="searchKeyword" class="search-clear" @click="clearSearch">
          <text class="clear-icon">×</text>
        </view>
      </view>
    </view>

    <view class="header-bar">
      <text class="header-title">我的土地</text>
    </view>

    <view class="land-list" v-if="filteredLands.length">
      <view class="land-card" v-for="item in filteredLands" :key="item.id" @click="goLand(item)">
        <view class="land-header">
          <text class="land-name">{{ item.name }}</text>
          <view :class="['land-status', 'status-' + item.status]">
            <text class="status-text">{{ item.status === 'leased' ? '已租赁' : '可租' }}</text>
          </view>
        </view>
        <view class="land-body">
          <view class="land-row">
            <text class="land-label">面积</text>
            <text class="land-value">{{ item.area }}亩</text>
          </view>
          <view class="land-row">
            <text class="land-label">位置</text>
            <text class="land-value">{{ item.location }}</text>
          </view>
          <view class="land-row">
            <text class="land-label">土壤</text>
            <text class="land-value">{{ item.soilType }}</text>
          </view>
        </view>
        <view class="land-footer">
          <text class="land-hint">点击查看种植详情 ></text>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">{{ searchKeyword ? '未找到匹配的土地' : '暂无租赁土地' }}</text>
      <view v-if="!searchKeyword" class="empty-btn" @click="goLease">
        <text class="empty-btn-text">去租赁土地</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getMyLeases } from '../../api/lease'
import { getLandDetail } from '../../api/land'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      lands: [],
      searchKeyword: '',
      searchTimer: null
    }
  },
  computed: {
    filteredLands() {
      // 后端已经过滤，直接返回
      return this.lands
    }
  },
  onShow() {
    this.loadLands()
  },
  methods: {
    async loadLands() {
      this.lands = []
      const userId = getCurrentUserId()
      const res = await getMyLeases({ userId })
      if (res && res.data && res.data.length > 0) {
        for (const lease of res.data) {
          const landRes = await getLandDetail({ id: lease.landId })
          if (landRes && landRes.data) {
            // 如果有搜索关键字，过滤土地名称
            if (this.searchKeyword) {
              if (landRes.data.name.includes(this.searchKeyword)) {
                this.lands.push(landRes.data)
              }
            } else {
              this.lands.push(landRes.data)
            }
          }
        }
      }
    },
    onSearch() {
      // debounce搜索
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadLands()
      }, 300)
    },
    clearSearch() {
      this.searchKeyword = ''
    },
    goLand(land) {
      uni.navigateTo({ url: '/pages/plant/land?landId=' + land.id + '&landName=' + encodeURIComponent(land.name) })
    },
    goLease() {
      uni.switchTab({ url: '/pages/lease/index' })
    }
  }
}
</script>

<style scoped>
.plant-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24rpx;
}

.search-bar {
  margin-bottom: 20rpx;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 76rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #1a1a1a;
}

.search-input::placeholder {
  color: #cccccc;
}

.search-clear {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8rpx;
}

.clear-icon {
  font-size: 36rpx;
  color: #cccccc;
  font-weight: bold;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.land-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.land-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1px solid #f0f0f0;
}

.land-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.land-status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-leased {
  background-color: #f6ffed;
}

.status-available {
  background-color: #e6f7ff;
}

.status-text {
  font-size: 24rpx;
}

.status-leased .status-text {
  color: #52C41A;
}

.status-available .status-text {
  color: #1677FF;
}

.land-body {
  margin-bottom: 12rpx;
}

.land-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}

.land-label {
  font-size: 26rpx;
  color: #999999;
}

.land-value {
  font-size: 26rpx;
  color: #333333;
}

.land-footer {
  padding-top: 12rpx;
  border-top: 1px solid #f0f0f0;
}

.land-hint {
  font-size: 24rpx;
  color: #1677FF;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
  margin-bottom: 30rpx;
}

.empty-btn {
  background-color: #1677FF;
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
}

.empty-btn-text {
  font-size: 28rpx;
  color: #ffffff;
}
</style>
