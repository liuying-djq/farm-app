<template>
  <view class="edit-page">
    <view class="form-card">
      <view class="form-item">
        <text class="form-label">产品名称</text>
        <input class="form-input" v-model="form.name" placeholder="请输入产品名称" />
      </view>

      <view class="form-item">
        <text class="form-label">价格（元）</text>
        <input class="form-input" v-model="form.price" type="digit" placeholder="请输入价格" />
      </view>

      <view class="form-item">
        <text class="form-label">数量</text>
        <input class="form-input" v-model="form.quantity" type="number" placeholder="请输入数量" />
      </view>

      <view class="form-item">
        <text class="form-label">单位</text>
        <picker :range="unitOptions" :value="unitIndex" @change="onUnitChange">
          <view class="picker-value">
            <text class="picker-text">{{ form.unit || '请选择单位' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">产品描述</text>
        <textarea class="form-textarea" v-model="form.description" placeholder="请输入产品描述" />
      </view>
    </view>

    <view class="submit-btn" @click="submit">
      <text class="submit-text">{{ isEdit ? '保存修改' : '发布产品' }}</text>
    </view>

    <view class="delete-btn" v-if="isEdit" @click="deleteProduct">
      <text class="delete-text">删除产品</text>
    </view>
  </view>
</template>

<script>
import { getMarketDetail, createProduct, updateProduct, deleteProduct } from '../../api/market'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      productId: null,
      isEdit: false,
      form: {
        name: '',
        price: '',
        quantity: '',
        unit: '',
        description: ''
      },
      unitOptions: ['斤', '公斤', '个', '盒', '箱', '袋'],
      unitIndex: 0
    }
  },
  onLoad(options) {
    if (options.id) {
      this.productId = parseInt(options.id)
      this.isEdit = true
      this.loadDetail()
    }
  },
  methods: {
    async loadDetail() {
      const res = await getMarketDetail({ id: this.productId })
      if (res && res.data) {
        const data = res.data
        this.form.name = data.name
        this.form.price = String(data.price)
        this.form.quantity = String(data.quantity)
        this.form.unit = data.unit
        this.form.description = data.description
        this.unitIndex = this.unitOptions.indexOf(data.unit)
        if (this.unitIndex === -1) this.unitIndex = 0
      }
    },
    onUnitChange(e) {
      this.unitIndex = e.detail.value
      this.form.unit = this.unitOptions[this.unitIndex]
    },
    async submit() {
      if (!this.form.name) {
        uni.showToast({ title: '请输入产品名称', icon: 'none' })
        return
      }
      if (!this.form.price || parseFloat(this.form.price) <= 0) {
        uni.showToast({ title: '请输入有效价格', icon: 'none' })
        return
      }
      if (!this.form.quantity || parseInt(this.form.quantity) < 0) {
        uni.showToast({ title: '请输入有效数量', icon: 'none' })
        return
      }
      if (!this.form.unit) {
        uni.showToast({ title: '请选择单位', icon: 'none' })
        return
      }

      const submitData = {
        name: this.form.name,
        price: parseFloat(this.form.price),
        quantity: parseInt(this.form.quantity),
        unit: this.form.unit,
        description: this.form.description
      }

      let res
      if (this.isEdit) {
        submitData.id = this.productId
        res = await updateProduct(submitData)
      } else {
        submitData.userId = getCurrentUserId()
        res = await createProduct(submitData)
      }

      if (res && res.data) {
        uni.showToast({
          title: this.isEdit ? '保存成功' : '发布成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    },
    async deleteProduct() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该产品吗？',
        success: async (res) => {
          if (res.confirm) {
            const delRes = await deleteProduct({ id: this.productId })
            if (delRes && delRes.data && delRes.data.success) {
              uni.showToast({ title: '已删除', icon: 'success' })
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
.edit-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.form-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
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

.picker-arrow {
  font-size: 24rpx;
  color: #cccccc;
}

.submit-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.submit-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: bold;
}

.delete-btn {
  background-color: #ffffff;
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  border: 1rpx solid #FF5722;
}

.delete-text {
  font-size: 28rpx;
  color: #FF5722;
}
</style>
