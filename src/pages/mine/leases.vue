<template>
  <view class="leases-page">
    <view class="record-list" v-if="leases.length">
      <view class="record-card" v-for="item in leases" :key="item.id">
        <view class="record-header">
          <text class="record-title">{{ item.landName || '土地租赁' }}</text>
          <view :class="['record-status', 'status-' + item.status]">
            <text class="status-text">{{ statusMap[item.status] || item.status }}</text>
          </view>
        </view>
        <view class="record-body">
          <view class="record-row">
            <text class="record-label">合同编号</text>
            <text class="record-value">{{ item.contractNo }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">租赁时长</text>
            <text class="record-value">{{ item.months }}个月</text>
          </view>
          <view class="record-row">
            <text class="record-label">开始日期</text>
            <text class="record-value">{{ item.startDate }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">结束日期</text>
            <text class="record-value">{{ item.endDate }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">创建时间</text>
            <text class="record-value">{{ item.createTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无租赁记录</text>
    </view>
  </view>
</template>

<script>
import { getLeaseRecords } from '../../api/record'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      leases: [],
      statusMap: {
        success: '成功',
        cancelled: '已取消'
      }
    }
  },
  onShow() {
    this.loadLeases()
  },
  methods: {
    async loadLeases() {
      const userId = getCurrentUserId()
      const res = await getLeaseRecords({ userId })
      if (res && res.data) {
        this.leases = res.data
      }
    }
  }
}
</script>

<style scoped>
.leases-page {
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

.status-active {
  background-color: #E8F5E9;
}

.status-expired {
  background-color: #FFF3E0;
}

.status-cancelled {
  background-color: #F5F5F5;
}

.status-text {
  font-size: 24rpx;
}

.status-active .status-text {
  color: #4CAF50;
}

.status-expired .status-text {
  color: #FF9800;
}

.status-cancelled .status-text {
  color: #999999;
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
