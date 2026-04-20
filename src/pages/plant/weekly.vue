

<template>
  <view class="weekly-page">
    <view class="header-bar">
      <text class="header-title">{{ landName }} - 每周计划</text>
      <text class="header-subtitle">当前：第{{ getCurrentWeek() }}周</text>
    </view>

    <view v-if="groupedPlans.length" class="plan-list">
      <view class="plant-group" v-for="group in groupedPlans" :key="group.plantName">
        <view class="group-header">
          <text class="group-name">{{ group.plantName }}</text>
        </view>
        <view class="week-group" v-for="week in group.weeks" :key="week.weekNumber">
          <view class="week-header">
            <text class="week-label">第{{ week.weekNumber }}周 ({{ week.weekStart }} ~ {{ week.weekEnd }})</text>
          </view>
          <view class="task-list">
            <view class="task-item" v-for="plan in week.plans" :key="plan.id">
              <view class="task-left">
                <text class="task-icon">{{ taskIcons[plan.taskType] || '📋' }}</text>
                <text class="task-name">{{ plan.plantName }}{{ plan.taskType }}</text>
              </view>
              <view v-if="plan.status === 'completed'" class="task-done">
                <text class="task-done-text">已完成</text>
              </view>
              <view v-else class="task-action" @click="completePlan(plan)">
                <text class="task-action-text">完成</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">本周暂无计划</text>
      <text class="empty-hint">添加作物时为当前周设置计划</text>
    </view>
  </view>
</template>

<script>
import { getWeeklyPlansByLand, completeWeeklyPlan } from '../../api/weeklyPlan'

export default {
  data() {
    return {
      landId: null,
      landName: '',
      plans: [],
      taskIcons: {
        '浇水': '💧',
        '施肥': '🌿',
        '驱虫': '🐛',
        '除草': '✂️',
        '修剪': '🌱'
      }
    }
  },
  computed: {
    groupedPlans() {
      // 计算当前周数
      const currentWeek = this.getCurrentWeek()
      
      const map = {}
      for (const p of this.plans) {
        // 只显示当前周的计划
        if (p.weekNumber !== currentWeek) continue
        
        if (!map[p.plantName]) {
          map[p.plantName] = { plantName: p.plantName, weeks: {} }
        }
        const group = map[p.plantName]
        const wKey = p.weekNumber
        if (!group.weeks[wKey]) {
          group.weeks[wKey] = {
            weekNumber: p.weekNumber,
            weekStart: p.weekStart,
            weekEnd: p.weekEnd,
            plans: []
          }
        }
        group.weeks[wKey].plans.push(p)
      }
      // 转为数组并排序
      return Object.values(map).map(g => {
        g.weeks = Object.values(g.weeks).sort((a, b) => a.weekNumber - b.weekNumber)
        return g
      })
    }
  },
  onLoad(options) {
    this.landId = parseInt(options.landId)
    this.landName = decodeURIComponent(options.landName || '')
  },
  onShow() {
    this.loadPlans()
  },
  methods: {
    getCurrentWeek() {
      // 获取所有计划中的最早种植日期，计算当前是第几周
      if (this.plans.length === 0) return 1
      
      // 找到最早的种植日期（通过weekStart推断）
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // 找到一个基准日期：最早的weekStart
      let minDate = null
      for (const plan of this.plans) {
        if (plan.weekNumber === 1 && plan.weekStart) {
          const date = new Date(plan.weekStart)
          if (!minDate || date < minDate) {
            minDate = date
          }
        }
      }
      
      // 如果没找到第1周的数据，使用最早的weekStart
      if (!minDate && this.plans.length > 0) {
        for (const plan of this.plans) {
          if (plan.weekStart) {
            const date = new Date(plan.weekStart)
            if (!minDate || date < minDate) {
              minDate = date
            }
          }
        }
      }
      
      if (!minDate) return 1
      
      // 计算当前日期是第几周
      const diffTime = today - minDate
      const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000))
      const currentWeek = Math.floor(diffDays / 7) + 1
      
      return currentWeek > 0 ? currentWeek : 1
    },
    async loadPlans() {
      const res = await getWeeklyPlansByLand({ landId: this.landId })
      if (res && res.data) {
        this.plans = res.data
      }
    },
    async completePlan(plan) {
      const res = await completeWeeklyPlan({ id: plan.id })
      if (res && res.data && res.data.success) {
        uni.showToast({ title: '已完成', icon: 'success' })
        this.loadPlans()
      }
    }
  }
}
</script>

<style scoped>
.weekly-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header-bar {
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.header-subtitle {
  font-size: 24rpx;
  color: #4CAF50;
  margin-top: 8rpx;
  display: block;
}

.plant-group {
  margin-bottom: 24rpx;
}

.group-header {
  background-color: #4CAF50;
  padding: 14rpx 20rpx;
  border-radius: 10rpx 10rpx 0 0;
}

.group-name {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: bold;
}

.week-group {
  background-color: #ffffff;
  padding: 16rpx 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.week-group:last-child {
  border-bottom: none;
  border-radius: 0 0 10rpx 10rpx;
}

.week-header {
  margin-bottom: 12rpx;
}

.week-label {
  font-size: 26rpx;
  color: #666666;
  font-weight: 500;
}

.task-list {
  padding-left: 16rpx;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f9f9f9;
}

.task-item:last-child {
  border-bottom: none;
}

.task-left {
  display: flex;
  align-items: center;
}

.task-icon {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.task-name {
  font-size: 28rpx;
  color: #333333;
}

.task-done {
  background-color: #E8F5E9;
  padding: 6rpx 20rpx;
  border-radius: 16rpx;
}

.task-done-text {
  font-size: 22rpx;
  color: #4CAF50;
}

.task-action {
  background-color: #FF9800;
  padding: 6rpx 20rpx;
  border-radius: 16rpx;
}

.task-action-text {
  font-size: 22rpx;
  color: #ffffff;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #cccccc;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #dddddd;
}
</style>
