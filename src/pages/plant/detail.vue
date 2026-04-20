<template>
  <view class="detail-page" v-if="plant">
    <view class="info-card">
      <view class="info-header">
        <text class="info-name">{{ plant.name }}</text>
        <view :class="['info-status', 'status-' + plant.status]">
          <text class="status-text">{{ statusMap[plant.status] }}</text>
        </view>
      </view>

      <view class="info-body">
        <view class="info-row">
          <text class="info-label">所在地块</text>
          <text class="info-value">{{ plant.landName }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">种植日期</text>
          <text class="info-value">{{ plant.plantDate }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">预计收获</text>
          <text class="info-value">{{ plant.expectedHarvestDate }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">生长阶段</text>
          <text class="info-value stage">{{ plant.growthStage }}</text>
        </view>
      </view>
    </view>

    <view class="growth-card">
      <text class="card-title">生长进度</text>
      <view class="growth-visual">
        <view class="growth-stages">
          <view :class="['stage-dot', getStageIndex(plant.growthStage) >= 0 ? 'stage-active' : '']">
            <text class="stage-label">播种</text>
          </view>
          <view :class="['stage-line', getStageIndex(plant.growthStage) >= 1 ? 'line-active' : '']"></view>
          <view :class="['stage-dot', getStageIndex(plant.growthStage) >= 1 ? 'stage-active' : '']">
            <text class="stage-label">发芽</text>
          </view>
          <view :class="['stage-line', getStageIndex(plant.growthStage) >= 2 ? 'line-active' : '']"></view>
          <view :class="['stage-dot', getStageIndex(plant.growthStage) >= 2 ? 'stage-active' : '']">
            <text class="stage-label">生长</text>
          </view>
          <view :class="['stage-line', getStageIndex(plant.growthStage) >= 3 ? 'line-active' : '']"></view>
          <view :class="['stage-dot', getStageIndex(plant.growthStage) >= 3 ? 'stage-active' : '']">
            <text class="stage-label">开花</text>
          </view>
          <view :class="['stage-line', getStageIndex(plant.growthStage) >= 4 ? 'line-active' : '']"></view>
          <view :class="['stage-dot', getStageIndex(plant.growthStage) >= 4 ? 'stage-active' : '']">
            <text class="stage-label">结果</text>
          </view>
          <view :class="['stage-line', getStageIndex(plant.growthStage) >= 5 ? 'line-active' : '']"></view>
          <view :class="['stage-dot', getStageIndex(plant.growthStage) >= 5 ? 'stage-active' : '']">
            <text class="stage-label">成熟</text>
          </view>
        </view>
      </view>
    </view>

    <view class="desc-card" v-if="plant.description">
      <text class="card-title">种植说明</text>
      <text class="desc-content">{{ plant.description }}</text>
    </view>

    <view class="action-bar">
      <view class="btn btn-edit" @click="editPlant">
        <text class="btn-text">编辑</text>
      </view>
      <view class="btn btn-delete" @click="deletePlant">
        <text class="btn-text">删除</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getPlantDetail, deletePlant as deletePlantApi, updatePlant } from '../../api/plant'

export default {
  data() {
    return {
      plantId: null,
      plant: null,
      statusMap: {
        growing: '生长中',
        mature: '已成熟',
        harvested: '已收获'
      },
      stages: ['播种期', '发芽期', '生长期', '开花期', '结果期', '成熟期']
    }
  },
  onLoad(options) {
    this.plantId = parseInt(options.id)
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      const res = await getPlantDetail({ id: this.plantId })
      if (res && res.data) {
        this.plant = res.data
      }
    },
    getStageIndex(stage) {
      return this.stages.indexOf(stage)
    },
    editPlant() {
      const stages = this.stages
      const currentIndex = this.getStageIndex(this.plant.growthStage)
      uni.showActionSheet({
        itemList: stages,
        success: async (res) => {
          if (res.tapIndex !== currentIndex) {
            const newStage = stages[res.tapIndex]
            let newStatus = 'growing'
            if (newStage === '成熟期') newStatus = 'mature'
            const updateRes = await updatePlant({
              id: this.plantId,
              growthStage: newStage,
              status: newStatus
            })
            if (updateRes && updateRes.data) {
              this.plant = updateRes.data
              uni.showToast({ title: '更新成功', icon: 'success' })
            }
          }
        }
      })
    },
    async deletePlant() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该种植记录吗？',
        success: async (res) => {
          if (res.confirm) {
            const delRes = await deletePlantApi({ id: this.plantId })
            if (delRes && delRes.data && delRes.data.success) {
              uni.showToast({ title: '删除成功', icon: 'success' })
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
            }
          }
        }
      })
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
  margin-bottom: 20rpx;
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

.status-growing {
  background-color: #E8F5E9;
}

.status-mature {
  background-color: #FFF3E0;
}

.status-harvested {
  background-color: #E3F2FD;
}

.status-text {
  font-size: 24rpx;
}

.status-growing .status-text {
  color: #4CAF50;
}

.status-mature .status-text {
  color: #FF9800;
}

.status-harvested .status-text {
  color: #2196F3;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #999999;
}

.info-value {
  font-size: 26rpx;
  color: #333333;
}

.info-value.stage {
  color: #4CAF50;
  font-weight: 500;
}

.growth-card {
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
  margin-bottom: 20rpx;
}

.growth-stages {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 0;
}

.stage-dot {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stage-dot.stage-active {
  background-color: #4CAF50;
}

.stage-label {
  font-size: 18rpx;
  color: #999999;
}

.stage-active .stage-label {
  color: #ffffff;
}

.stage-line {
  flex: 1;
  height: 4rpx;
  background-color: #e0e0e0;
  margin: 0 4rpx;
}

.stage-line.line-active {
  background-color: #4CAF50;
}

.desc-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.desc-content {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.8;
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 16rpx 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.btn {
  flex: 1;
  padding: 20rpx 0;
  border-radius: 12rpx;
  text-align: center;
  margin: 0 8rpx;
}

.btn-edit {
  background-color: #4CAF50;
}

.btn-delete {
  background-color: #ffffff;
  border: 1rpx solid #FF5722;
}

.btn-text {
  font-size: 28rpx;
  font-weight: bold;
}

.btn-edit .btn-text {
  color: #ffffff;
}

.btn-delete .btn-text {
  color: #FF5722;
}
</style>
