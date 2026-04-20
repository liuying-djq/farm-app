<template>
  <view class="sales-page">
    <view class="record-list" v-if="sales.length">
      <view class="record-card" v-for="item in sales" :key="item.id">
        <view class="record-header">
          <text class="record-title">{{ item.productName }}</text>
          <view :class="['record-status', 'status-' + item.status]">
            <text class="status-text">{{ statusMap[item.status] || item.status }}</text>
          </view>
        </view>
        <view class="record-body">
          <view class="record-row">
            <text class="record-label">价格</text>
            <text class="record-value price">¥{{ item.price }}/{{ item.unit }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">售卖数量</text>
            <text class="record-value">{{ item.quantity }}{{ item.unit }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">总金额</text>
            <text class="record-value price">¥{{ item.totalAmount }}</text>
          </view>
          <view class="record-row">
            <text class="record-label">售卖时间</text>
            <text class="record-value">{{ item.saleTime || item.createTime }}</text>
          </view>
          <view class="record-row" v-if="item.description">
            <text class="record-label">产品描述</text>
            <text class="record-value">{{ item.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无售卖记录</text>
    </view>
  </view>
</template>

<script>
import { getSalesRecords } from '../../api/record'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      sales: [],
      statusMap: {
        sold: '已售',
        refunded: '已退款'
      }
    }
  },
  onShow() {
    this.loadSales()
  },
  methods: {
    async loadSales() {
      const userId = getCurrentUserId()
      const res = await getSalesRecords({ userId })
      if (res && res.data) {
        this.sales = res.data
      }
    }
  }
}
</script>

<style scoped>
.sales-page {
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

.status-on_sale {
  background-color: #E8F5E9;
}

.status-off_shelf {
  background-color: #F5F5F5;
}

.status-sold_out {
  background-color: #FFF3E0;
}

.status-text {
  font-size: 24rpx;
}

.status-on_sale .status-text {
  color: #4CAF50;
}

.status-off_shelf .status-text {
  color: #999999;
}

.status-sold_out .status-text {
  color: #FF9800;
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

.price {
  color: #FF5722;
  font-weight: bold;
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
