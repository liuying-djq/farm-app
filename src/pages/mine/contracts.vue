<template>
  <view class="contracts-page">
    <view class="contract-list" v-if="leases.length">
      <view class="contract-card" v-for="item in leases" :key="item.id" @click="goContract(item.id)">
        <view class="contract-header">
          <text class="contract-no">{{ item.contractNo }}</text>
          <view :class="['contract-status', 'status-' + item.status]">
            <text class="status-text">{{ item.status === 'active' ? '生效中' : '已过期' }}</text>
          </view>
        </view>
        <view class="contract-body">
          <view class="contract-row">
            <text class="contract-label">租赁期限</text>
            <text class="contract-value">{{ item.startDate }} 至 {{ item.endDate }}</text>
          </view>
          <view class="contract-row">
            <text class="contract-label">租赁月数</text>
            <text class="contract-value">{{ item.months }}个月</text>
          </view>
          <view class="contract-row">
            <text class="contract-label">签订日期</text>
            <text class="contract-value">{{ item.createTime }}</text>
          </view>
        </view>
        <view class="contract-footer">
          <text class="contract-hint">点击查看合同详情 ></text>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无租赁合同</text>
    </view>
  </view>
</template>

<script>
import { getMyLeases } from '../../api/lease'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      leases: []
    }
  },
  onShow() {
    this.loadLeases()
  },
  methods: {
    async loadLeases() {
      const userId = getCurrentUserId()
      const res = await getMyLeases({ userId })
      if (res && res.data) {
        this.leases = res.data
      }
    },
    goContract(id) {
      uni.navigateTo({ url: '/pages/lease/contract?id=' + id })
    }
  }
}
</script>

<style scoped>
.contracts-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.contract-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.contract-no {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.contract-status {
  padding: 4rpx 14rpx;
  border-radius: 16rpx;
}

.status-active {
  background-color: #E8F5E9;
}

.status-expired {
  background-color: #FFF3E0;
}

.status-text {
  font-size: 22rpx;
}

.status-active .status-text {
  color: #4CAF50;
}

.status-expired .status-text {
  color: #FF9800;
}

.contract-body {
  margin-bottom: 12rpx;
}

.contract-row {
  display: flex;
  justify-content: space-between;
  padding: 6rpx 0;
}

.contract-label {
  font-size: 26rpx;
  color: #999999;
}

.contract-value {
  font-size: 26rpx;
  color: #333333;
}

.contract-footer {
  padding-top: 12rpx;
  border-top: 1rpx solid #f0f0f0;
}

.contract-hint {
  font-size: 24rpx;
  color: #4CAF50;
}

.empty {
  display: flex;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
}
</style>
