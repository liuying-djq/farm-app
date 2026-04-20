<template>
  <view class="contract-page" v-if="contract">
    <view class="contract-card">
      <view class="contract-header">
        <text class="contract-title">土地租赁合同</text>
        <text class="contract-no">合同编号：{{ contract.contractNo }}</text>
      </view>

      <view class="contract-body">
        <view class="contract-section">
          <text class="section-title">甲方（出租方）</text>
          <text class="section-content">{{ contract.partyA }}</text>
        </view>

        <view class="contract-section">
          <text class="section-title">乙方（承租方）</text>
          <text class="section-content">{{ contract.partyB }}</text>
        </view>

        <view class="contract-section">
          <text class="section-title">租赁土地</text>
          <text class="section-content">{{ landName }}</text>
        </view>

        <view class="contract-section">
          <text class="section-title">租赁期限</text>
          <text class="section-content">{{ contract.startDate }} 至 {{ contract.endDate }}</text>
        </view>

        <view class="contract-section">
          <text class="section-title">租赁面积</text>
          <text class="section-content">{{ landArea }}亩</text>
        </view>

        <view class="contract-section">
          <text class="section-title">租金合计</text>
          <text class="section-content price">¥{{ totalPrice }}</text>
        </view>

        <view class="contract-section">
          <text class="section-title">合同条款</text>
          <view class="terms-list">
            <view class="term-item" v-for="(term, index) in contract.terms" :key="index">
              <text class="term-index">{{ index + 1 }}.</text>
              <text class="term-text">{{ term }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="contract-footer">
        <view class="sign-row">
          <text class="sign-label">甲方签章：</text>
          <view class="sign-stamp">
            <text class="stamp-text">智慧农场</text>
          </view>
        </view>
        <view class="sign-row">
          <text class="sign-label">乙方签章：</text>
          <text class="sign-value">{{ contract.partyB }}</text>
        </view>
        <view class="sign-date">
          <text class="sign-label">签订日期：</text>
          <text class="sign-value">{{ contract.createTime }}</text>
        </view>
      </view>
    </view>

    <view class="action-bar">
      <view class="btn btn-primary" @click="goBack">
        <text class="btn-text">返回</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getLeaseContract } from '../../api/lease'
import { getLandDetail } from '../../api/land'

export default {
  data() {
    return {
      leaseId: null,
      contract: null,
      landName: '',
      landArea: 0,
      landPrice: 0
    }
  },
  computed: {
    totalPrice() {
      if (!this.contract || !this.landArea) return 0
      return (this.landArea * this.landPrice * this.contract.months / 12).toFixed(2)
    }
  },
  onLoad(options) {
    this.leaseId = parseInt(options.id)
    this.loadContract()
  },
  methods: {
    async loadContract() {
      const res = await getLeaseContract({ id: this.leaseId })
      if (res && res.data) {
        this.contract = res.data
        const landRes = await getLandDetail({ id: this.contract.landId })
        if (landRes && landRes.data) {
          this.landName = landRes.data.name
          this.landArea = landRes.data.area
          this.landPrice = landRes.data.price
        }
      }
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.contract-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.contract-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
}

.contract-header {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  padding: 40rpx 24rpx;
  text-align: center;
}

.contract-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 12rpx;
}

.contract-no {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.contract-body {
  padding: 24rpx;
}

.contract-section {
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-title {
  font-size: 26rpx;
  color: #999999;
  display: block;
  margin-bottom: 10rpx;
}

.section-content {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

.section-content.price {
  color: #FF5722;
  font-weight: bold;
  font-size: 34rpx;
}

.terms-list {
  margin-top: 10rpx;
}

.term-item {
  display: flex;
  margin-bottom: 14rpx;
  line-height: 1.6;
}

.term-index {
  font-size: 26rpx;
  color: #4CAF50;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.term-text {
  font-size: 26rpx;
  color: #666666;
  flex: 1;
}

.contract-footer {
  padding: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.sign-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.sign-label {
  font-size: 28rpx;
  color: #333333;
}

.sign-value {
  font-size: 28rpx;
  color: #666666;
}

.sign-stamp {
  width: 120rpx;
  height: 120rpx;
  border: 3rpx solid #FF5722;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-15deg);
}

.stamp-text {
  font-size: 24rpx;
  color: #FF5722;
  font-weight: bold;
}

.sign-date {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.action-bar {
  padding: 30rpx 20rpx;
}

.btn {
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
}

.btn-primary {
  background-color: #4CAF50;
}

.btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
