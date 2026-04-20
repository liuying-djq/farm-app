<template>
  <view class="plants-page">
    <view class="record-list" v-if="plants.length">
      <view class="record-card" v-for="item in plants" :key="item.id">
        <view class="record-header">
          <text class="record-title">{{ item.cropName }}</text>
          <view :class="['record-status', 'status-' + item.status]">
            <text class="status-text">{{ statusMap[item.status] || item.status }}</text>
          </view>
        </view>
        <view class="record-body">
          <view class="record-row">
            <text class="record-label">所在地块</text>
            <text class="record-value">{{ item.landName }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">生长阶段</text>
            <text class="record-value">{{ item.growthStage }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">种植日期</text>
            <text class="record-value">{{ item.plantDate }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">预计收获</text>
            <text class="record-value">{{ item.expectedHarvestDate }}</text>
          </view>
          <view class="record-row" v-if="item.actualHarvestDate">
            <text class="record-label">实际收获</text>
            <text class="record-value">{{ item.actualHarvestDate }}</text>
          </view>
          <view class="record-row" v-if="item.yield > 0">
            <text class="record-label">产量</text>
            <text class="record-value">{{ item.yield }}{{ item.yieldUnit }}</text>
          </view>
          <view class="record-row" v-if="item.description">
            <text class="record-label">种植说明</text>
            <text class="record-value">{{ item.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无种植记录</text>
    </view>
  </view>
</template>

<script>
import { getPlantRecords } from '../../api/record'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      plants: [],
      statusMap: {
        growing: '生长中',
        mature: '已成熟',
        harvested: '已收获',
        failed: '种植失败'
      }
    }
  },
  onShow() {
    this.loadPlants()
  },
  methods: {
    async loadPlants() {
      const userId = getCurrentUserId()
      const res = await getPlantRecords({ userId })
      if (res && res.data) {
        this.plants = res.data
      }
    }
  }
}
</script>

<style scoped>
.plants-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.record-list {
  padding-bottom: 20rpx;
}

.record-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.record-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.record-status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
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
  font-size: 24rpx;
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

.record-body {
  padding-left: 8rpx;
}

.record-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
}

.record-label {
  font-size: 26rpx;
  color: #999999;
}

.record-value {
  font-size: 26rpx;
  color: #333333;
  flex: 1;
  text-align: right;
  margin-left: 20rpx;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
}
</style>
