<template>
  <view class="lease-page">
    <view class="search-bar">
      <view class="search-input-wrap">
        <input class="search-input" v-model="searchKeyword" placeholder="搜索土地名称或位置" @input="onSearch" />
        <view v-if="searchKeyword" class="search-clear" @click="clearSearch">
          <text class="clear-icon">×</text>
        </view>
      </view>
    </view>

    <view class="filter-bar">
      <view :class="['filter-item', currentFilter === 'all' ? 'filter-active' : '']" @click="filterChange('all')">
        <text>全部</text>
      </view>
      <view :class="['filter-item', currentFilter === 'available' ? 'filter-active' : '']" @click="filterChange('available')">
        <text>可租</text>
      </view>
      <view :class="['filter-item', currentFilter === 'leased' ? 'filter-active' : '']" @click="filterChange('leased')">
        <text>已租</text>
      </view>
    </view>

    <view class="land-list" v-if="filteredLands.length">
      <view class="land-card" v-for="item in filteredLands" :key="item.id" @click="goDetail(item.id)">
        <view class="land-header">
          <text class="land-name">{{ item.name }}</text>
          <view :class="['land-status', item.status === 'available' ? 'status-available' : 'status-leased']">
            <text class="status-text">{{ item.status === 'available' ? '可租' : '已租' }}</text>
          </view>
        </view>
        <view class="land-body">
          <view class="land-row">
            <text class="land-label">位置</text>
            <text class="land-value">{{ item.location }}</text>
          </view>
          <view class="land-row">
            <text class="land-label">面积</text>
            <text class="land-value">{{ item.area }}亩</text>
          </view>
          <view class="land-row">
            <text class="land-label">土壤</text>
            <text class="land-value">{{ item.soilType }}</text>
          </view>
          <view class="land-row">
            <text class="land-label">租金</text>
            <text class="land-value land-price">{{ item.price }}元/亩/年</text>
          </view>
        </view>
        <view class="land-desc" v-if="item.description">
          <text class="desc-text">{{ item.description }}</text>
        </view>
        
        <!-- 我的租赁操作按钮 -->
        <view class="my-lease-actions" v-if="item.isMyLease && item.leaseStatus === 'active'" @click.stop>
          <view class="action-btn terminate-btn" @click="handleTerminate(item)">
            <text class="action-btn-text">退租</text>
          </view>
        </view>
        
        <view class="my-lease-actions" v-else-if="item.isMyLease && item.leaseStatus === 'expired'" @click.stop>
          <view class="action-btn renew-btn" @click="handleRenew(item)">
            <text class="action-btn-text">续租</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">{{ searchKeyword ? '未找到匹配的土地' : '暂无土地信息' }}</text>
    </view>
  </view>
</template>

<script>
import { getLandList } from '../../api/land'
import { getActiveLeases, terminateLease, renewLease } from '../../api/lease'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      lands: [],
      currentFilter: 'all',
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
      const data = {}
      if (this.currentFilter !== 'all') {
        data.status = this.currentFilter
      }
      if (this.searchKeyword) {
        data.keyword = this.searchKeyword
      }
      // 已租筛选时，只查询当前用户租赁的土地
      if (this.currentFilter === 'leased') {
        data.userId = getCurrentUserId()
      }
      const res = await getLandList(data)
      if (res && res.data) {
        this.lands = res.data
        
        // 标记我的租赁
        const userId = getCurrentUserId()
        const myLeasesRes = await getActiveLeases({ userId })
        if (myLeasesRes && myLeasesRes.data) {
          this.lands.forEach(land => {
            const myLease = myLeasesRes.data.find(lease => lease.landId === land.id)
            if (myLease) {
              land.isMyLease = true
              land.leaseStatus = myLease.status
              land.leaseId = myLease.id
            }
          })
        }
      }
    },
    filterChange(type) {
      this.currentFilter = type
      this.loadLands()
    },
    onSearch() {
      //  debounce搜索，避免频繁请求
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadLands()
      }, 300)
    },
    clearSearch() {
      this.searchKeyword = ''
    },
    goDetail(id) {
      uni.navigateTo({ url: '/pages/lease/detail?id=' + id })
    },
    handleTerminate(item) {
      uni.showModal({
        title: '确认退租',
        content: `确定要退租"${item.name}"吗?退租后7天将归档到租赁记录。`,
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '退租中...' })
            try {
              const result = await terminateLease({
                leaseId: item.leaseId,
                userId: getCurrentUserId(),
                reason: '用户主动退租'
              })
              uni.hideLoading()
              if (result && result.data) {
                uni.showToast({ title: '退租成功', icon: 'success' })
                this.loadLands()
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '退租失败', icon: 'error' })
            }
          }
        }
      })
    },
    handleRenew(item) {
      uni.showModal({
        title: '续租',
        content: `确定要续租"${item.name}"吗?`,
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '续租中...' })
            try {
              const result = await renewLease({
                oldLeaseId: item.leaseId,
                userId: getCurrentUserId(),
                newMonths: 12
              })
              uni.hideLoading()
              if (result && result.data) {
                uni.showToast({ title: '续租成功', icon: 'success' })
                this.loadLands()
              }
            } catch (error) {
              uni.hideLoading()
              uni.showToast({ title: '续租失败', icon: 'error' })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.lease-page {
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

.filter-bar {
  display: flex;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666666;
  border-radius: 12rpx;
}

.filter-active {
  background-color: #1677FF;
  color: #ffffff;
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
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
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

.status-available {
  background-color: #f6ffed;
}

.status-leased {
  background-color: #fff7e6;
}

.status-text {
  font-size: 24rpx;
}

.status-available .status-text {
  color: #52C41A;
}

.status-leased .status-text {
  color: #FA8C16;
}

.land-body {
  margin-bottom: 16rpx;
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

.land-price {
  color: #1677FF;
  font-weight: 600;
}

.land-desc {
  padding-top: 16rpx;
  border-top: 1px solid #f0f0f0;
}

.desc-text {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.6;
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

.my-lease-actions {
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  padding: 16rpx 40rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
}

.terminate-btn {
  background: linear-gradient(135deg, #FF5722, #FF7043);
}

.renew-btn {
  background: linear-gradient(135deg, #2196F3, #42A5F5);
}

.action-btn-text {
  font-size: 26rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
