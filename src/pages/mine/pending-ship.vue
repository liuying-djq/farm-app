<template>
  <view class="pending-page">
    <view class="order-list" v-if="orders.length">
      <view class="order-card" v-for="item in orders" :key="item.id">
        <view class="order-header">
          <text class="order-no">订单号：{{ item.orderNo }}</text>
          <text class="order-status">已付款</text>
        </view>
        <view class="order-body">
          <text class="product-name">{{ item.productName }}</text>
          <view class="order-info">
            <text class="info-text">单价：¥{{ item.price }}/{{ item.unit }}</text>
            <text class="info-text">数量：{{ item.quantity }}{{ item.unit }}</text>
          </view>
          <view class="order-info">
            <text class="info-text">买家ID：{{ item.buyerId }}</text>
            <text class="info-text">下单时间：{{ item.createTime }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="total-amount">合计：¥{{ item.totalAmount.toFixed(2) }}</text>
          <view class="ship-btn" @click="shipOrder(item)">
            <text class="ship-btn-text">确认发货</text>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="empty">
      <text class="empty-text">暂无待发货订单</text>
    </view>
  </view>
</template>

<script>
import { getPendingOrders, shipOrder } from '../../api/order'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      orders: []
    }
  },
  onShow() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      try {
        const userId = getCurrentUserId()
        console.log('开始加载待发货订单，sellerId:', userId)
        const res = await getPendingOrders(userId) // 当前卖家ID
        console.log('待发货订单响应:', res)
        if (res && res.code === 200) {
          this.orders = res.data || []
          console.log('订单列表:', this.orders)
        }
      } catch (error) {
        console.error('加载订单失败:', error)
      }
    },
    
    async shipOrder(order) {
      uni.showModal({
        title: '确认发货',
        content: `确认发货订单 ${order.orderNo} 吗？`,
        success: async (modalRes) => {
          if (modalRes.confirm) {
            uni.showLoading({ title: '发货中...' })
            try {
              const res = await shipOrder({ orderNo: order.orderNo })
              uni.hideLoading()
              if (res && res.code === 200) {
                uni.showToast({
                  title: '发货成功',
                  icon: 'success'
                })
                this.loadOrders()
              } else {
                uni.showToast({
                  title: res.message || '发货失败',
                  icon: 'none'
                })
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({
                title: '发货失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.pending-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24rpx;
}

.order-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background-color: #f5f7fa;
  border-bottom: 1px solid #f0f0f0;
}

.order-no {
  font-size: 26rpx;
  color: #666666;
}

.order-status {
  font-size: 24rpx;
  color: #FA8C16;
  font-weight: 600;
}

.order-body {
  padding: 24rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  display: block;
  margin-bottom: 16rpx;
}

.order-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.info-text {
  font-size: 24rpx;
  color: #999999;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-top: 1px solid #f0f0f0;
}

.total-amount {
  font-size: 32rpx;
  color: #FF3B30;
  font-weight: 700;
}

.ship-btn {
  background: linear-gradient(135deg, #1677FF, #4096FF);
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
}

.ship-btn-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
}
</style>
