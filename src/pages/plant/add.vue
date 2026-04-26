<template>
  <view class="add-page">
    <view class="form-card">
      <view class="form-item">
        <text class="form-label">作物名称</text>
        <input class="form-input" v-model="form.name" placeholder="请输入作物名称，如番茄、黄瓜" />
      </view>

      <view class="form-item">
        <text class="form-label">所在地块</text>
        <view class="picker-value" v-if="fixedLand">
          <text class="picker-text">{{ form.landName }}</text>
        </view>
        <picker v-else :range="landNames" @change="onLandChange">
          <view class="picker-value">
            <text :class="form.landName ? 'picker-text' : 'picker-placeholder'">
              {{ form.landName || '请选择地块' }}
            </text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">种植日期</text>
        <picker mode="date" :value="form.plantDate" @change="onPlantDateChange">
          <view class="picker-value">
            <text :class="form.plantDate ? 'picker-text' : 'picker-placeholder'">
              {{ form.plantDate || '请选择日期' }}
            </text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 智能种植分析按钮 -->
    <view class="sensor-btn-wrap" v-if="form.name && form.landId">
      <view class="sensor-btn" @click="runSensorAnalysis">
        <text class="sensor-btn-text">智能种植分析</text>
      </view>
      <text class="sensor-hint">系统将根据天气和作物情况自动生成每周计划</text>
    </view>

    <!-- 智能种植分析结果 -->
    <view class="sensor-result" v-if="sensorData">
      <!-- 天气预报卡片 -->
      <view class="result-card">
        <view class="card-header">
          <text class="card-title">天气预报（未来7天）</text>
        </view>
        <view class="weather-list">
          <view class="weather-item" v-for="(w, index) in sensorData.weatherForecast" :key="index">
            <text class="weather-date">{{ w.date }}</text>
            <text class="weather-icon">{{ weatherIcons[w.weather] || '🌤' }}</text>
            <text class="weather-desc">{{ w.weather }}</text>
            <text class="weather-temp">{{ w.tempLow }}°~{{ w.tempHigh }}°</text>
            <text class="weather-humidity">💧{{ w.humidity }}%</text>
          </view>
        </view>
      </view>

      <!-- 作物分析卡片 -->
      <view class="result-card" v-if="sensorData.cropAnalysis">
        <view class="card-header">
          <text class="card-title">作物分析</text>
        </view>
        <view class="analysis-body">
          <view class="analysis-row">
            <text class="analysis-label">生长周期</text>
            <text class="analysis-value">{{ sensorData.cropAnalysis.growthCycleDays }}天</text>
          </view>
          <view class="analysis-row">
            <text class="analysis-label">需水程度</text>
            <text class="analysis-value">{{ waterNeedMap[sensorData.cropAnalysis.waterNeed] }}</text>
          </view>
          <view class="analysis-row">
            <text class="analysis-label">施肥需求</text>
            <text class="analysis-value">{{ fertilizerNeedMap[sensorData.cropAnalysis.fertilizerNeed] }}</text>
          </view>
          <view class="analysis-row">
            <text class="analysis-label">虫害风险</text>
            <text :class="['analysis-value', sensorData.cropAnalysis.pestRisk === 'high' ? 'text-danger' : '']">{{ pestRiskMap[sensorData.cropAnalysis.pestRisk] }}</text>
          </view>
          <view class="analysis-suggestion">
            <text class="suggestion-text">{{ sensorData.cropAnalysis.suggestion }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐计划预览 -->
      <view class="result-card" v-if="sensorData.recommendedPlan && sensorData.recommendedPlan.length">
        <view class="card-header">
          <text class="card-title">推荐每周计划</text>
          <text class="card-subtitle">系统自动生成，可确认后创建</text>
        </view>
        <view class="plan-preview">
          <view class="plan-day" v-for="(day, index) in sensorData.recommendedPlan" :key="index">
            <text class="plan-date">{{ day.date }}</text>
            <view class="plan-tasks" v-if="day.tasks && day.tasks.length">
              <view class="plan-task" v-for="(task, ti) in day.tasks" :key="ti">
                <text class="task-icon-small">{{ taskIcons[task] || '📋' }}</text>
                <text class="task-name-small">{{ task }}</text>
              </view>
            </view>
            <text v-else class="plan-no-task">无任务</text>
          </view>
        </view>
      </view>

      <!-- 确认创建按钮 -->
      <view class="confirm-btn" @click="confirmCreate">
        <text class="confirm-text">确认创建</text>
      </view>
    </view>

    <!-- 加载中 -->
    <view class="loading-mask" v-if="analyzing">
      <view class="loading-content">
        <text class="loading-text">智能种植分析中...</text>
        <text class="loading-hint">正在获取天气和作物数据</text>
      </view>
    </view>
  </view>
</template>

<script>
import { createPlantWithSensor, getSensorAnalysis } from '../../api/plant'
import { getMyLeases } from '../../api/lease'
import { getLandDetail } from '../../api/land'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      fixedLand: false,
      form: {
        name: '',
        landId: null,
        landName: '',
        plantDate: ''
      },
      lands: [],
      landNames: [],
      sensorData: null,
      analyzing: false,
      weatherIcons: {
        '晴': '☀️',
        '多云': '⛅',
        '阴': '☁️',
        '小雨': '🌦',
        '中雨': '🌧',
        '大雨': '⛈',
        '雷阵雨': '⛈'
      },
      taskIcons: {
        '浇水': '💧',
        '施肥': '🌿',
        '驱虫': '🐛',
        '除草': '✂️',
        '修剪': '🌱'
      },
      waterNeedMap: {
        'very_high': '非常高',
        'high': '高',
        'medium': '中等',
        'low': '低'
      },
      fertilizerNeedMap: {
        'high': '高',
        'medium': '中等',
        'low': '低'
      },
      pestRiskMap: {
        'high': '高',
        'medium': '中等',
        'low': '低'
      }
    }
  },
  async onLoad(options) {
    // 默认种植日期为今天
    const today = new Date()
    this.form.plantDate = today.toISOString().split('T')[0]

    if (options.landId) {
      this.fixedLand = true
      this.form.landId = parseInt(options.landId)
      this.form.landName = decodeURIComponent(options.landName || '')
    } else {
      await this.loadLands()
    }
  },
  methods: {
    async loadLands() {
      this.lands = []
      this.landNames = []
      const userId = getCurrentUserId()
      const res = await getMyLeases({ userId })
      if (res && res.data && res.data.length > 0) {
        for (const lease of res.data) {
          const landRes = await getLandDetail({ id: lease.landId })
          if (landRes && landRes.data) {
            this.lands.push(landRes.data)
            this.landNames.push(landRes.data.name)
          }
        }
      }
    },
    onLandChange(e) {
      const idx = e.detail.value
      this.form.landId = this.lands[idx].id
      this.form.landName = this.lands[idx].name
      // 切换地块后清除智能分析数据
      this.sensorData = null
    },
    onPlantDateChange(e) {
      this.form.plantDate = e.detail.value
    },
    async runSensorAnalysis() {
      if (!this.form.name) {
        uni.showToast({ title: '请输入作物名称', icon: 'none' })
        return
      }
      if (!this.form.landId) {
        uni.showToast({ title: '请选择地块', icon: 'none' })
        return
      }

      this.analyzing = true
      this.sensorData = null

      try {
        const res = await getSensorAnalysis({
          landId: this.form.landId,
          cropName: this.form.name
        })

        if (res && res.code === 200 && res.data) {
          this.sensorData = res.data
          uni.showToast({ title: '分析完成', icon: 'success' })
        } else {
          uni.showToast({ title: res.message || '分析失败', icon: 'none' })
        }
      } catch (error) {
        uni.showToast({ title: '分析失败', icon: 'none' })
      } finally {
        this.analyzing = false
      }
    },
    async confirmCreate() {
      if (!this.form.name) {
        uni.showToast({ title: '请输入作物名称', icon: 'none' })
        return
      }
      if (!this.form.landId) {
        uni.showToast({ title: '请选择地块', icon: 'none' })
        return
      }

      uni.showLoading({ title: '创建中...' })

      try {
        const res = await createPlantWithSensor({
          name: this.form.name,
          landId: this.form.landId,
          landName: this.form.landName,
          userId: getCurrentUserId()
        })

        uni.hideLoading()

        if (res && res.data) {
          uni.showToast({ title: '创建成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({ title: '创建失败', icon: 'none' })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '创建失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.add-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.form-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.form-item {
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  font-size: 28rpx;
  color: #333333;
  padding: 12rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.picker-text {
  font-size: 28rpx;
  color: #333333;
}

.picker-placeholder {
  font-size: 28rpx;
  color: #cccccc;
}

.picker-arrow {
  font-size: 24rpx;
  color: #cccccc;
}

/* 智能种植分析按钮 */
.sensor-btn-wrap {
  margin-bottom: 20rpx;
  text-align: center;
}

.sensor-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  margin-bottom: 12rpx;
}

.sensor-btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}

.sensor-hint {
  font-size: 24rpx;
  color: #999999;
}

/* 智能种植分析结果 */
.sensor-result {
  margin-top: 10rpx;
}

.result-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.card-subtitle {
  font-size: 22rpx;
  color: #999999;
}

/* 天气列表 */
.weather-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.weather-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f9f9f9;
}

.weather-item:last-child {
  border-bottom: none;
}

.weather-date {
  font-size: 24rpx;
  color: #666666;
  width: 160rpx;
}

.weather-icon {
  font-size: 30rpx;
  margin-right: 12rpx;
}

.weather-desc {
  font-size: 24rpx;
  color: #333333;
  width: 80rpx;
}

.weather-temp {
  font-size: 24rpx;
  color: #FF6B6B;
  flex: 1;
}

.weather-humidity {
  font-size: 22rpx;
  color: #4FC3F7;
}

/* 作物分析 */
.analysis-body {
  padding: 8rpx 0;
}

.analysis-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #f9f9f9;
}

.analysis-row:last-child {
  border-bottom: none;
}

.analysis-label {
  font-size: 26rpx;
  color: #999999;
}

.analysis-value {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
}

.text-danger {
  color: #FF3B30;
}

.analysis-suggestion {
  margin-top: 16rpx;
  padding: 16rpx;
  background-color: #E8F5E9;
  border-radius: 8rpx;
}

.suggestion-text {
  font-size: 26rpx;
  color: #4CAF50;
  line-height: 1.6;
}

/* 推荐计划预览 */
.plan-preview {
  max-height: 500rpx;
  overflow-y: auto;
}

.plan-day {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f9f9f9;
}

.plan-day:last-child {
  border-bottom: none;
}

.plan-date {
  font-size: 24rpx;
  color: #666666;
  width: 160rpx;
  flex-shrink: 0;
}

.plan-tasks {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  flex: 1;
}

.plan-task {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.task-icon-small {
  font-size: 22rpx;
  margin-right: 4rpx;
}

.task-name-small {
  font-size: 22rpx;
  color: #333333;
}

.plan-no-task {
  font-size: 22rpx;
  color: #cccccc;
}

/* 确认创建按钮 */
.confirm-btn {
  background: linear-gradient(135deg, #1677FF, #4096FF);
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  margin-top: 10rpx;
}

.confirm-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}

/* 加载遮罩 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 80rpx;
  text-align: center;
}

.loading-text {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
}

.loading-hint {
  font-size: 26rpx;
  color: #999999;
}
</style>
