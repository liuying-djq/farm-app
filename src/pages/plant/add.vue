<template>
  <view class="add-page">
    <view class="form-card">
      <view class="form-item">
        <text class="form-label">作物名称</text>
        <input class="form-input" v-model="form.name" placeholder="请输入作物名称" />
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

      <view class="form-item">
        <text class="form-label">预计收获日期</text>
        <picker mode="date" :value="form.expectedHarvestDate" @change="onHarvestDateChange">
          <view class="picker-value">
            <text :class="form.expectedHarvestDate ? 'picker-text' : 'picker-placeholder'">
              {{ form.expectedHarvestDate || '请选择日期' }}
            </text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">种植说明</text>
        <textarea class="form-textarea" v-model="form.description" placeholder="请输入种植说明" />
      </view>
    </view>

    <!-- 每日计划设置 -->
    <view class="form-card" v-if="totalDays > 0">
      <view class="section-header">
        <text class="section-title">每日计划</text>
        <text class="section-hint">共{{ totalDays }}天，点击日期选择要执行的任务</text>
      </view>

      <view class="day-list">
        <view class="day-item" v-for="(day, index) in dayList" :key="index">
          <view class="day-header" @click="toggleDayExpand(index)">
            <text class="day-date">{{ day.date }}</text>
            <text class="day-week">周{{ day.weekday }}</text>
            <view class="day-task-dots" v-if="getDayTasks(index).length">
              <view class="task-dot" v-for="(t, i) in getDayTasks(index)" :key="i" :class="'dot-' + getTaskColor(t)"></view>
            </view>
            <text v-else class="day-no-task">未设置</text>
            <text class="day-arrow">{{ expandedDay === index ? '▼' : '▶' }}</text>
          </view>
          <view class="day-tasks" v-if="expandedDay === index">
            <view class="task-check" v-for="task in taskOptions" :key="task">
              <view :class="['checkbox', hasTask(index, task) ? 'checkbox-checked' : '']" @click="toggleTask(index, task)">
                <text class="checkbox-text" v-if="hasTask(index, task)">✓</text>
              </view>
              <text class="task-check-label" @click="toggleTask(index, task)">{{ task }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="submit-btn" @click="submit">
      <text class="submit-text">确认添加</text>
    </view>
  </view>
</template>

<script>
import { createPlant } from '../../api/plant'
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
        plantDate: '',
        expectedHarvestDate: '',
        description: ''
      },
      lands: [],
      landNames: [],
      taskOptions: ['浇水', '施肥', '驱虫', '除草', '修剪'],
      dailyTasks: {}, // { 0: ['浇水','施肥'], 1: ['浇水'], ... }  key是日期索引
      expandedDay: null
    }
  },
  computed: {
    totalDays() {
      if (!this.form.plantDate || !this.form.expectedHarvestDate) return 0
      const start = new Date(this.form.plantDate)
      const end = new Date(this.form.expectedHarvestDate)
      const diff = Math.ceil((end - start) / (24 * 60 * 60 * 1000))
      return diff >= 0 ? diff + 1 : 0
    },
    dayList() {
      if (this.totalDays === 0) return []
      const start = new Date(this.form.plantDate)
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      const list = []
      for (let i = 0; i < this.totalDays; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        const weekday = weekdays[date.getDay()]
        list.push({ date: dateStr, weekday: weekday })
      }
      return list
    }
  },
  async onLoad(options) {
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
    },
    onPlantDateChange(e) {
      this.form.plantDate = e.detail.value
      this.dailyTasks = {}
      this.expandedDay = null
    },
    onHarvestDateChange(e) {
      this.form.expectedHarvestDate = e.detail.value
      this.dailyTasks = {}
      this.expandedDay = null
    },
    toggleDayExpand(index) {
      this.expandedDay = this.expandedDay === index ? null : index
    },
    hasTask(dayIndex, task) {
      return (this.dailyTasks[dayIndex] || []).includes(task)
    },
    getDayTasks(dayIndex) {
      return this.dailyTasks[dayIndex] || []
    },
    getTaskColor(task) {
      const colors = {
        '浇水': 'blue',
        '施肥': 'orange',
        '驱虫': 'red',
        '除草': 'green',
        '修剪': 'purple'
      }
      return colors[task] || 'gray'
    },
    toggleTask(dayIndex, task) {
      if (!this.dailyTasks[dayIndex]) {
        this.$set(this.dailyTasks, dayIndex, [])
      }
      const tasks = this.dailyTasks[dayIndex]
      const idx = tasks.indexOf(task)
      if (idx >= 0) {
        tasks.splice(idx, 1)
      } else {
        tasks.push(task)
      }
      this.$set(this.dailyTasks, dayIndex, [...tasks])
    },
    async submit() {
      if (!this.form.name) {
        uni.showToast({ title: '请输入作物名称', icon: 'none' })
        return
      }
      if (!this.form.landId) {
        uni.showToast({ title: '请选择地块', icon: 'none' })
        return
      }
      if (!this.form.plantDate) {
        uni.showToast({ title: '请选择种植日期', icon: 'none' })
        return
      }
      if (!this.form.expectedHarvestDate) {
        uni.showToast({ title: '请选择预计收获日期', icon: 'none' })
        return
      }

      // 构建 dailyTasks 参数：按日期发送任务
      const dailyTasksList = []
      for (let i = 0; i < this.totalDays; i++) {
        const tasks = this.dailyTasks[i]
        if (tasks && tasks.length > 0) {
          const date = this.dayList[i].date
          dailyTasksList.push({ date: date, tasks: tasks })
        }
      }

      const res = await createPlant({
        ...this.form,
        userId: getCurrentUserId(),
        dailyTasks: dailyTasksList
      })
      if (res && res.data) {
        uni.showToast({ title: '添加成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
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
  padding-bottom: 120rpx;
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

.form-textarea {
  font-size: 28rpx;
  color: #333333;
  padding: 12rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
  width: 100%;
  height: 160rpx;
  box-sizing: border-box;
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

.section-header {
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
}

.section-hint {
  font-size: 24rpx;
  color: #999999;
}

.day-list {
  max-height: 800rpx;
  overflow-y: auto;
}

.day-item {
  border-bottom: 1rpx solid #f5f5f5;
}

.day-item:last-child {
  border-bottom: none;
}

.day-header {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
}

.day-date {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
  width: 180rpx;
}

.day-week {
  font-size: 24rpx;
  color: #666666;
  width: 60rpx;
}

.day-task-dots {
  flex: 1;
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.task-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
}

.dot-blue { background-color: #2196F3; }
.dot-orange { background-color: #FF9800; }
.dot-red { background-color: #F44336; }
.dot-green { background-color: #4CAF50; }
.dot-purple { background-color: #9C27B0; }
.dot-gray { background-color: #9E9E9E; }

.day-no-task {
  flex: 1;
  font-size: 24rpx;
  color: #cccccc;
}

.day-arrow {
  font-size: 20rpx;
  color: #cccccc;
  margin-left: 8rpx;
}

.day-tasks {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 8rpx 0 16rpx 0;
}

.task-check {
  display: flex;
  align-items: center;
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #dddddd;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
}

.checkbox-checked {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.checkbox-text {
  font-size: 22rpx;
  color: #ffffff;
}

.task-check-label {
  font-size: 26rpx;
  color: #333333;
}

.submit-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  margin-top: 10rpx;
}

.submit-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}
</style>
