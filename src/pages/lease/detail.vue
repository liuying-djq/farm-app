<template>
  <view class="detail-page" v-if="land">
    <view class="info-card">
      <view class="info-header">
        <text class="info-name">{{ land.name }}</text>
        <view :class="['info-status', land.status === 'available' ? 'status-available' : 'status-leased']">
          <text class="status-text">{{ land.status === 'available' ? '可租' : '已租' }}</text>
        </view>
      </view>

      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">位置</text>
          <text class="info-value">{{ land.location }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">面积</text>
          <text class="info-value">{{ land.area }}亩</text>
        </view>
        <view class="info-item">
          <text class="info-label">土壤类型</text>
          <text class="info-value">{{ land.soilType }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">租金</text>
          <text class="info-value price">{{ land.price }}元/亩/年</text>
        </view>
      </view>
    </view>

    <view class="desc-card">
      <text class="card-title">土地描述</text>
      <text class="desc-content">{{ land.description }}</text>
    </view>

    <view class="lease-form" v-if="land.status === 'available'">
      <text class="card-title">租赁信息</text>
      <view class="form-item">
        <text class="form-label">租赁时长</text>
        <picker :range="monthOptions" :value="monthIndex" @change="onMonthChange">
          <view class="picker-value">
            <text>{{ monthOptions[monthIndex] }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">起始日期</text>
        <picker mode="date" :value="startDate" @change="onDateChange">
          <view class="picker-value">
            <text>{{ startDate }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">租赁面积</text>
        <view class="picker-value">
          <text>{{ land.area }}亩</text>
        </view>
      </view>
      <view class="total-row">
        <text class="total-label">合计费用</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
    </view>

    <!-- 付款弹窗 -->
    <view class="pay-modal" v-if="showPayModal" @click="closePayModal">
      <view class="pay-card" @click.stop>
        <view class="pay-header">
          <text class="pay-title">确认付款</text>
        </view>
        <view class="pay-body">
          <view class="pay-info-row">
            <text class="pay-info-label">租赁地块</text>
            <text class="pay-info-value">{{ land.name }}</text>
          </view>
          <view class="pay-info-row">
            <text class="pay-info-label">租赁时长</text>
            <text class="pay-info-value">{{ monthOptions[monthIndex] }}</text>
          </view>
          <view class="pay-info-row">
            <text class="pay-info-label">租赁期限</text>
            <text class="pay-info-value">{{ startDate }} 至 {{ endDate }}</text>
          </view>
          <view class="pay-divider"></view>
          <view class="pay-total">
            <text class="pay-total-label">应付金额</text>
            <text class="pay-total-price">¥{{ totalPrice }}</text>
          </view>
        </view>
        <view class="pay-actions">
          <view class="pay-btn pay-cancel" @click="closePayModal">
            <text class="pay-btn-text">取消</text>
          </view>
          <view class="pay-btn pay-confirm" @click="confirmPay">
            <text class="pay-btn-text">确认付款</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-bar" v-if="land.status === 'available'">
      <view class="price-info">
        <text class="price-unit">{{ land.price }}元/亩/年</text>
      </view>
      <view class="lease-btn" @click="doLease">
        <text class="lease-btn-text">立即租赁</text>
      </view>
    </view>

    <view class="bottom-bar" v-else>
      <view class="leased-tip">
        <text class="leased-text">该土地已被租赁</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getLandDetail } from '../../api/land'
import { createLease } from '../../api/lease'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      land: null,
      landId: null,
      monthOptions: ['6个月', '12个月', '24个月', '36个月'],
      monthValues: [6, 12, 24, 36],
      monthIndex: 1,
      startDate: '',
      showPayModal: false
    }
  },
  computed: {
    totalPrice() {
      if (!this.land) return 0
      const months = this.monthValues[this.monthIndex]
      return (this.land.area * this.land.price * months / 12).toFixed(2)
    },
    endDate() {
      if (!this.startDate) return ''
      const months = this.monthValues[this.monthIndex]
      const start = new Date(this.startDate)
      const end = new Date(start)
      end.setMonth(end.getMonth() + months)
      return end.toISOString().slice(0, 10)
    }
  },
  onLoad(options) {
    this.landId = parseInt(options.id)
    const now = new Date()
    this.startDate = now.toISOString().slice(0, 10)
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      const res = await getLandDetail({ id: this.landId })
      if (res && res.data) {
        this.land = res.data
      }
    },
    onMonthChange(e) {
      this.monthIndex = e.detail.value
    },
    onDateChange(e) {
      this.startDate = e.detail.value
    },
    doLease() {
      // 弹出付款确认弹窗
      this.showPayModal = true
    },
    closePayModal() {
      this.showPayModal = false
    },
    async confirmPay() {
      this.closePayModal()

      uni.showLoading({ title: '付款中...' })

      // 模拟付款过程（实际应接微信支付等）
      setTimeout(async () => {
        uni.hideLoading()

        const months = this.monthValues[this.monthIndex]
        const start = new Date(this.startDate)
        const end = new Date(start)
        end.setMonth(end.getMonth() + months)
        const endDate = end.toISOString().slice(0, 10)

        uni.showLoading({ title: '生成合同中...' })

        const leaseRes = await createLease({
          landId: this.landId,
          userId: getCurrentUserId(),
          startDate: this.startDate,
          endDate: endDate,
          months: months
        })

        uni.hideLoading()

        if (leaseRes && leaseRes.data) {
          uni.showToast({ title: '付款成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/lease/contract?id=' + leaseRes.data.id
            })
          }, 1500)
        }
      }, 1500)
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.info-status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-available {
  background-color: #E8F5E9;
}

.status-leased {
  background-color: #FFF3E0;
}

.status-text {
  font-size: 24rpx;
}

.status-available .status-text {
  color: #4CAF50;
}

.status-leased .status-text {
  color: #FF9800;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
}

.info-item {
  width: 50%;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 6rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.info-value.price {
  color: #4CAF50;
  font-weight: bold;
}

.desc-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 16rpx;
}

.desc-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.8;
}

.lease-form {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
}

.picker-value {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666666;
}

.picker-arrow {
  margin-left: 10rpx;
  color: #cccccc;
  font-size: 24rpx;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
}

.total-label {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}

.total-price {
  font-size: 36rpx;
  color: #FF5722;
  font-weight: bold;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.price-info {
  flex: 1;
}

.price-unit {
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: bold;
}

.lease-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
}

.lease-btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}

.leased-tip {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
}

.leased-text {
  font-size: 28rpx;
  color: #999999;
}

/* 付款弹窗样式 */
.pay-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.pay-card {
  width: 85%;
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.pay-header {
  padding: 36rpx 24rpx 24rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.pay-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333333;
}

.pay-body {
  padding: 24rpx;
}

.pay-info-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
}

.pay-info-label {
  font-size: 26rpx;
  color: #999999;
}

.pay-info-value {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
}

.pay-divider {
  height: 1rpx;
  background-color: #f0f0f0;
  margin: 16rpx 0;
}

.pay-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
}

.pay-total-label {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}

.pay-total-price {
  font-size: 40rpx;
  color: #FF5722;
  font-weight: bold;
}

.pay-actions {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.pay-btn {
  flex: 1;
  padding: 28rpx;
  text-align: center;
}

.pay-cancel {
  border-right: 1rpx solid #f0f0f0;
}

.pay-cancel .pay-btn-text {
  color: #666666;
}

.pay-confirm {
  background-color: #4CAF50;
}

.pay-confirm .pay-btn-text {
  color: #ffffff;
  font-weight: bold;
}

.pay-btn-text {
  font-size: 30rpx;
}
</style>
