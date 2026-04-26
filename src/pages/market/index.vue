<template>
  <view class="market-page">
    <!-- 顶部栏 -->
    <view class="top-bar">
      <text class="top-title">我的订单</text>
      <view class="cart-btn" @click="goShop">
        <text class="cart-icon">🛒</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list" v-if="orders.length">
      <view class="order-card" v-for="item in orders" :key="item.role + '-' + item.id">
        <view class="order-header">
          <view class="order-header-left">
            <text class="order-no">{{ item.orderNo }}</text>
            <view :class="['role-tag', item.role === 'seller' ? 'role-seller' : 'role-buyer']">
              <text class="role-text">{{ item.role === 'seller' ? '我卖的' : '我买的' }}</text>
            </view>
          </view>
          <view :class="['order-status', 'status-' + item.status]">
            <text class="status-text">{{ statusMap[item.status] }}</text>
          </view>
        </view>
        <view class="order-body">
          <text class="product-name">{{ item.productName }}</text>
          <view class="order-info">
            <text class="info-text">单价：¥{{ item.price }}/{{ item.unit }}</text>
            <text class="info-text">数量：{{ item.quantity }}{{ item.unit }}</text>
          </view>
          <view class="order-info">
            <text class="info-text">{{ item.role === 'seller' ? '买家' : '卖家' }}ID：{{ item.role === 'seller' ? item.buyerId : item.sellerId }}</text>
            <text class="info-text">下单：{{ item.createTime }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="total-amount">合计：¥{{ (item.totalAmount || 0).toFixed(2) }}</text>
          <view class="order-actions">
            <!-- 买家 + pending：付款按钮 -->
            <view v-if="item.role === 'buyer' && item.status === 'pending'" class="action-btn btn-pay" @click="payOrder(item)">
              <text class="action-text">付款</text>
            </view>
            <!-- 卖家 + pending：灰色发货按钮（不可点击） -->
            <view v-if="item.role === 'seller' && item.status === 'pending'" class="action-btn btn-ship-disabled">
              <text class="action-text">待付款</text>
            </view>
            <!-- 卖家 + paid：可点击发货按钮 -->
            <view v-if="item.role === 'seller' && item.status === 'paid'" class="action-btn btn-ship" @click="shipOrder(item)">
              <text class="action-text">确认发货</text>
            </view>
            <!-- 买家 + shipped：确认收货按钮 -->
            <view v-if="item.role === 'buyer' && item.status === 'shipped'" class="action-btn btn-confirm" @click="confirmReceipt(item)">
              <text class="action-text">确认收货</text>
            </view>
            <!-- 买家 + completed：申请退款按钮 -->
            <view v-if="item.role === 'buyer' && item.status === 'completed'" class="action-btn btn-refund" @click="refundOrder(item)">
              <text class="action-text">申请退款</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">暂无订单</text>
      <view class="empty-hint">
        <text class="empty-hint-text">买卖产品后，订单将显示在这里</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getSellerOrders, getMyOrders, payOrder as payOrderApi, shipOrder as shipOrderApi, confirmReceipt as confirmReceiptApi, refundOrder as refundOrderApi } from '../../api/order'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      orders: [],
      statusMap: {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        refunded: '已退款',
        archived: '已归档'
      }
    }
  },
  onShow() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      try {
        const userId = getCurrentUserId()
        // 并行拉取卖家订单和买家订单
        const [sellerRes, buyerRes] = await Promise.all([
          getSellerOrders(userId),
          getMyOrders(userId)
        ])

        let sellerOrders = []
        let buyerOrders = []

        if (sellerRes && sellerRes.code === 200) {
          sellerOrders = (sellerRes.data || []).map(o => ({ ...o, role: 'seller' }))
        }
        if (buyerRes && buyerRes.code === 200) {
          buyerOrders = (buyerRes.data || []).map(o => ({ ...o, role: 'buyer' }))
        }

        // 合并并排序：未付款在前，已付款在后，按时间倒序
        this.orders = [...sellerOrders, ...buyerOrders].sort((a, b) => {
          const orderWeight = { pending: 1, paid: 2, shipped: 3, completed: 4, refunded: 5, archived: 6 }
          const wa = orderWeight[a.status] || 7
          const wb = orderWeight[b.status] || 7
          if (wa !== wb) return wa - wb
          return (b.createTime || '').localeCompare(a.createTime || '')
        })
      } catch (error) {
        console.error('加载订单失败:', error)
      }
    },
    goShop() {
      uni.navigateTo({ url: '/pages/market/shop' })
    },
    async payOrder(order) {
      uni.showModal({
        title: '确认付款',
        content: `确认支付订单 ${order.orderNo} 的 ¥${(order.totalAmount || 0).toFixed(2)} 吗？`,
        success: async (modalRes) => {
          if (modalRes.confirm) {
            uni.showLoading({ title: '支付中...' })
            try {
              const res = await payOrderApi({ orderNo: order.orderNo })
              uni.hideLoading()
              if (res && res.code === 200) {
                uni.showToast({ title: '付款成功', icon: 'success' })
                this.loadOrders()
              } else {
                uni.showToast({ title: res.message || '付款失败', icon: 'none' })
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '付款失败', icon: 'none' })
            }
          }
        }
      })
    },
    async shipOrder(order) {
      uni.showModal({
        title: '确认发货',
        content: `确认发货订单 ${order.orderNo} 吗？`,
        success: async (modalRes) => {
          if (modalRes.confirm) {
            uni.showLoading({ title: '发货中...' })
            try {
              const res = await shipOrderApi({ orderNo: order.orderNo })
              uni.hideLoading()
              if (res && res.code === 200) {
                uni.showToast({ title: '发货成功', icon: 'success' })
                this.loadOrders()
              } else {
                uni.showToast({ title: res.message || '发货失败', icon: 'none' })
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '发货失败', icon: 'none' })
            }
          }
        }
      })
    },
    async confirmReceipt(order) {
      uni.showModal({
        title: '确认收货',
        content: `确认收货订单 ${order.orderNo} 吗？`,
        success: async (modalRes) => {
          if (modalRes.confirm) {
            uni.showLoading({ title: '处理中...' })
            try {
              const res = await confirmReceiptApi({ orderNo: order.orderNo })
              uni.hideLoading()
              if (res && res.code === 200) {
                uni.showToast({ title: '收货成功', icon: 'success' })
                this.loadOrders()
              } else {
                uni.showToast({ title: res.message || '操作失败', icon: 'none' })
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '操作失败', icon: 'none' })
            }
          }
        }
      })
    },
    async refundOrder(order) {
      uni.showModal({
        title: '申请退款',
        content: `确定申请退款订单 ${order.orderNo} 吗？退款后不可撤销。`,
        success: async (modalRes) => {
          if (modalRes.confirm) {
            uni.showLoading({ title: '处理中...' })
            try {
              const res = await refundOrderApi({ orderNo: order.orderNo })
              uni.hideLoading()
              if (res && res.code === 200) {
                uni.showToast({ title: '退款成功', icon: 'success' })
                this.loadOrders()
              } else {
                uni.showToast({ title: res.message || '退款失败', icon: 'none' })
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '退款失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.market-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24rpx;
  padding-bottom: 40rpx;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.top-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #1a1a1a;
}

.cart-btn {
  width: 72rpx;
  height: 72rpx;
  background: linear-gradient(135deg, #FA8C16, #FFC53D);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(250, 140, 22, 0.3);
}

.cart-icon {
  font-size: 36rpx;
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

.order-header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.order-no {
  font-size: 26rpx;
  color: #666666;
}

.role-tag {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.role-seller {
  background-color: #e6f7ff;
}

.role-buyer {
  background-color: #fff7e6;
}

.role-text {
  font-size: 20rpx;
  font-weight: 500;
}

.role-seller .role-text {
  color: #1677FF;
}

.role-buyer .role-text {
  color: #FA8C16;
}

.order-status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-pending { background-color: #fff7e6; }
.status-paid { background-color: #f6ffed; }
.status-shipped { background-color: #e6f7ff; }
.status-completed { background-color: #f0f0f0; }
.status-refunded { background-color: #fff1f0; }
.status-archived { background-color: #f9f0ff; }

.status-text { font-size: 24rpx; }
.status-pending .status-text { color: #FA8C16; }
.status-paid .status-text { color: #52C41A; }
.status-shipped .status-text { color: #1677FF; }
.status-completed .status-text { color: #999999; }
.status-refunded .status-text { color: #FF3B30; }
.status-archived .status-text { color: #722ED1; }

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

.order-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
}

.btn-pay {
  background: linear-gradient(135deg, #FA8C16, #FFC53D);
}

.btn-ship {
  background: linear-gradient(135deg, #1677FF, #4096FF);
}

.btn-ship-disabled {
  background-color: #d9d9d9;
}

.btn-confirm {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.btn-refund {
  background-color: #ffffff;
  border: 1px solid #FF3B30;
}

.action-text { font-size: 24rpx; }
.btn-pay .action-text { color: #ffffff; }
.btn-ship .action-text { color: #ffffff; }
.btn-ship-disabled .action-text { color: #999999; }
.btn-confirm .action-text { color: #ffffff; }
.btn-refund .action-text { color: #FF3B30; }

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
  margin-bottom: 16rpx;
}

.empty-hint-text {
  font-size: 24rpx;
  color: #dddddd;
}
</style>
