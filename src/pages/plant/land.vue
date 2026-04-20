<template>
  <view class="land-page">
    <view class="header-bar">
      <text class="header-title">{{ landName }} - 种植列表</text>
      <view class="add-btn" @click="goAdd">
        <text class="add-text">+ 添加</text>
      </view>
    </view>

    <view class="plant-list" v-if="plants.length">
      <view class="plant-card" v-for="item in plants" :key="item.id" @click="goDetail(item.id)">
        <view class="plant-header">
          <text class="plant-name">{{ item.name }}</text>
          <view :class="['plant-status', 'status-' + item.status]">
            <text class="status-text">{{ statusMap[item.status] }}</text>
          </view>
        </view>
        <view class="plant-body">
          <view class="plant-row">
            <text class="plant-label">种植日期</text>
            <text class="plant-value">{{ item.plantDate }}</text>
          </view>
          <view class="plant-row">
            <text class="plant-label">生长阶段</text>
            <text class="plant-value stage">{{ item.growthStage }}</text>
          </view>
          <view class="plant-row">
            <text class="plant-label">预计收获</text>
            <text class="plant-value">{{ item.expectedHarvestDate }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">该地块暂无种植记录</text>
      <view class="empty-btn" @click="goAdd">
        <text class="empty-btn-text">添加种植</text>
      </view>
    </view>

    <!-- 每周计划按钮 -->
    <view class="weekly-btn-wrap">
      <view class="weekly-btn" @click="goWeekly">
        <text class="weekly-btn-text">每周计划</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getPlantListByLand } from '../../api/plant'

export default {
  data() {
    return {
      landId: null,
      landName: '',
      plants: [],
      statusMap: {
        growing: '生长中',
        mature: '已成熟',
        harvested: '已收获'
      }
    }
  },
  onLoad(options) {
    this.landId = parseInt(options.landId)
    this.landName = decodeURIComponent(options.landName || '')
  },
  onShow() {
    this.loadPlants()
  },
  methods: {
    async loadPlants() {
      const res = await getPlantListByLand({ landId: this.landId })
      if (res && res.data) {
        this.plants = res.data
      }
    },
    goDetail(id) {
      uni.navigateTo({ url: '/pages/plant/detail?id=' + id })
    },
    goAdd() {
      uni.navigateTo({ url: '/pages/plant/add?landId=' + this.landId + '&landName=' + encodeURIComponent(this.landName) })
    },
    goWeekly() {
      uni.navigateTo({ url: '/pages/plant/weekly?landId=' + this.landId + '&landName=' + encodeURIComponent(this.landName) })
    }
  }
}
</script>

<style scoped>
.land-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.add-btn {
  background-color: #4CAF50;
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
}

.add-text {
  font-size: 26rpx;
  color: #ffffff;
}

.plant-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.plant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.plant-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.plant-status {
  padding: 4rpx 14rpx;
  border-radius: 16rpx;
}

.status-growing {
  background-color: #E8F5E9;
}

.status-mature {
  background-color: #FFF3E0;
}

.status-harvested {
  background-color: #E3F2FD;
}

.status-text {
  font-size: 22rpx;
}

.status-growing .status-text {
  color: #4CAF50;
}

.status-mature .status-text {
  color: #FF9800;
}

.status-harvested .status-text {
  color: #2196F3;
}

.plant-body {
  margin-bottom: 4rpx;
}

.plant-row {
  display: flex;
  justify-content: space-between;
  padding: 6rpx 0;
}

.plant-label {
  font-size: 26rpx;
  color: #999999;
}

.plant-value {
  font-size: 26rpx;
  color: #333333;
}

.plant-value.stage {
  color: #4CAF50;
  font-weight: 500;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
  margin-bottom: 30rpx;
}

.empty-btn {
  background-color: #4CAF50;
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
}

.empty-btn-text {
  font-size: 28rpx;
  color: #ffffff;
}

.weekly-btn-wrap {
  position: fixed;
  bottom: 40rpx;
  left: 20rpx;
  right: 20rpx;
}

.weekly-btn {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(255, 152, 0, 0.3);
}

.weekly-btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
