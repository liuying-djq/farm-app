<template>
  <view class="shop-page">
    <view class="search-bar">
      <view class="search-input-wrap">
        <input class="search-input" v-model="searchKeyword" placeholder="搜索产品名称" @input="onSearch" />
        <view v-if="searchKeyword" class="search-clear" @click="clearSearch">
          <text class="clear-icon">×</text>
        </view>
      </view>
    </view>

    <view class="tab-bar">
      <view :class="['tab-item', currentTab === 'all' ? 'tab-active' : '']" @click="switchTab('all')">
        <text>全部产品</text>
      </view>
      <view :class="['tab-item', currentTab === 'mine' ? 'tab-active' : '']" @click="switchTab('mine')">
        <text>我的产品</text>
      </view>
    </view>

    <view class="product-list" v-if="filteredProducts.length">
      <view class="product-card" v-for="item in filteredProducts" :key="item.id" @click="goEdit(item)">
        <view class="product-header">
          <text class="product-name">{{ item.name }}</text>
          <view v-if="item.status" :class="['product-status', 'status-' + item.status]">
            <text class="status-text">{{ statusMap[item.status] }}</text>
          </view>
        </view>
        <view class="product-body">
          <text class="product-desc">{{ item.description }}</text>
        </view>
        <view class="product-footer">
          <view class="price-info">
            <text class="product-price">¥{{ item.price }}</text>
            <text class="product-unit">/{{ item.unit }}</text>
          </view>
          <text class="product-qty">库存：{{ item.quantity }}{{ item.unit }}</text>
        </view>
        <view class="product-actions" v-if="currentTab === 'mine'">
          <view class="action-btn btn-edit" @click.stop="goEdit(item)">
            <text class="action-text">编辑</text>
          </view>
          <view v-if="item.status === 'on_sale'" class="action-btn btn-off" @click.stop="offShelf(item)">
            <text class="action-text">下架</text>
          </view>
          <view v-if="item.status === 'off_shelf'" class="action-btn btn-on" @click.stop="onShelf(item)">
            <text class="action-text">上架</text>
          </view>
        </view>
        <view class="product-actions" v-else>
          <view class="action-btn btn-buy" @click.stop="showBuyDialog(item)">
            <text class="action-text">购买</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty">
      <text class="empty-text">{{ searchKeyword ? '未找到匹配的产品' : '暂无产品' }}</text>
    </view>

    <view class="fab-btn" v-if="currentTab === 'mine'" @click="goEdit(null)">
      <text class="fab-text">+</text>
    </view>

    <!-- 购买弹窗 -->
    <view class="buy-modal" v-if="showBuyModal" @click="closeBuyModal">
      <view class="buy-modal-content" @click.stop>
        <view class="buy-modal-header">
          <text class="buy-modal-title">购买产品</text>
          <text class="buy-modal-close" @click="closeBuyModal">×</text>
        </view>
        <view class="buy-product-info">
          <text class="buy-product-name">{{ currentProduct.name }}</text>
          <text class="buy-product-price">￥{{ currentProduct.price }}/{{ currentProduct.unit }}</text>
        </view>
        <view class="buy-quantity">
          <text class="buy-label">购买数量：</text>
          <view class="quantity-control">
            <view class="quantity-btn" @click="decreaseQuantity">
              <text class="quantity-btn-text">-</text>
            </view>
            <input class="quantity-input" type="number" v-model.number="buyQuantity" :max="currentProduct.quantity" />
            <view class="quantity-btn" @click="increaseQuantity">
              <text class="quantity-btn-text">+</text>
            </view>
          </view>
          <text class="buy-stock">库存：{{ currentProduct.quantity }}{{ currentProduct.unit }}</text>
        </view>
        <view class="buy-total">
          <text class="buy-total-label">合计：</text>
          <text class="buy-total-price">￥{{ (currentProduct.price * buyQuantity).toFixed(2) }}</text>
        </view>
        <view class="buy-actions">
          <view class="buy-btn buy-btn-cancel" @click="closeBuyModal">
            <text class="buy-btn-text">取消</text>
          </view>
          <view class="buy-btn buy-btn-confirm" @click="confirmBuy">
            <text class="buy-btn-text">确认购买</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getMarketAll, getMyProducts, offShelfProduct, onShelfProduct } from '../../api/market'
import { buyProduct } from '../../api/order'
import { getCurrentUserId } from '../../utils/auth'

export default {
  data() {
    return {
      products: [],
      currentTab: 'all',
      searchKeyword: '',
      searchTimer: null,
      statusMap: {
        on_sale: '在售',
        sold_out: '已售罄',
        off_shelf: '已下架'
      },
      showBuyModal: false,
      currentProduct: {},
      buyQuantity: 1
    }
  },
  computed: {
    filteredProducts() {
      return this.products
    }
  },
  onShow() {
    this.loadProducts()
  },
  methods: {
    async loadProducts() {
      let res
      if (this.currentTab === 'all') {
        const data = {}
        if (this.searchKeyword) {
          data.keyword = this.searchKeyword
        }
        res = await getMarketAll(data)
        if (res && res.data) {
          this.products = res.data.map(p => ({ ...p, status: 'on_sale' }))
        }
      } else {
        const userId = getCurrentUserId()
        const data = { userId }
        if (this.searchKeyword) {
          data.keyword = this.searchKeyword
        }
        res = await getMyProducts(data)
        if (res && res.data) {
          this.products = res.data
        }
      }
    },
    switchTab(tab) {
      this.currentTab = tab
      this.loadProducts()
    },
    onSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadProducts()
      }, 300)
    },
    clearSearch() {
      this.searchKeyword = ''
    },
    goEdit(item) {
      if (this.currentTab === 'mine') {
        if (item) {
          uni.navigateTo({ url: '/pages/market/edit?id=' + item.id })
        } else {
          uni.navigateTo({ url: '/pages/market/edit' })
        }
      }
    },
    async offShelf(item) {
      uni.showModal({
        title: '确认下架',
        content: `确定要下架「${item.name}」吗？`,
        success: async (res) => {
          if (res.confirm) {
            const result = await offShelfProduct({ id: item.id })
            if (result && result.data) {
              uni.showToast({ title: '已下架', icon: 'success' })
              this.loadProducts()
            }
          }
        }
      })
    },
    async onShelf(item) {
      const result = await onShelfProduct({ id: item.id })
      if (result && result.data) {
        uni.showToast({ title: '已上架', icon: 'success' })
        this.loadProducts()
      }
    },
    showBuyDialog(product) {
      this.currentProduct = product
      this.buyQuantity = 1
      this.showBuyModal = true
    },
    closeBuyModal() {
      this.showBuyModal = false
      this.currentProduct = {}
      this.buyQuantity = 1
    },
    decreaseQuantity() {
      if (this.buyQuantity > 1) {
        this.buyQuantity--
      }
    },
    increaseQuantity() {
      if (this.buyQuantity < this.currentProduct.quantity) {
        this.buyQuantity++
      } else {
        uni.showToast({ title: '超出库存', icon: 'none' })
      }
    },
    async confirmBuy() {
      if (this.buyQuantity < 1) {
        uni.showToast({ title: '数量至少为1', icon: 'none' })
        return
      }
      uni.showLoading({ title: '购买中...' })
      try {
        const res = await buyProduct({
          productId: this.currentProduct.id,
          buyerId: getCurrentUserId(),
          quantity: this.buyQuantity
        })
        if (res && res.code === 200) {
          uni.hideLoading()
          this.closeBuyModal()
          uni.showToast({ title: '购买成功', icon: 'success' })
          this.loadProducts()
        } else {
          uni.hideLoading()
          uni.showToast({ title: res.message || '购买失败', icon: 'none' })
        }
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: '购买失败', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 24rpx;
  padding-bottom: 140rpx;
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

.tab-bar {
  display: flex;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666666;
  border-radius: 12rpx;
}

.tab-active {
  background-color: #FA8C16;
  color: #ffffff;
}

.product-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.product-status {
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-on_sale { background-color: #f6ffed; }
.status-sold_out { background-color: #fff7e6; }
.status-off_shelf { background-color: #f5f5f5; }

.status-text { font-size: 24rpx; }
.status-on_sale .status-text { color: #52C41A; }
.status-sold_out .status-text { color: #FA8C16; }
.status-off_shelf .status-text { color: #999999; }

.product-body { margin-bottom: 12rpx; }

.product-desc {
  font-size: 26rpx;
  color: #999999;
  line-height: 1.6;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12rpx;
  border-top: 1px solid #f0f0f0;
}

.price-info { display: flex; align-items: baseline; }

.product-price {
  font-size: 32rpx;
  color: #FF3B30;
  font-weight: 600;
}

.product-unit { font-size: 24rpx; color: #FF3B30; }
.product-qty { font-size: 24rpx; color: #999999; }

.product-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1px solid #f0f0f0;
}

.action-btn { padding: 10rpx 24rpx; border-radius: 20rpx; }
.btn-edit { background-color: #FA8C16; }
.btn-off { background-color: #ffffff; border: 1px solid #FA8C16; }
.btn-on { background-color: #ffffff; border: 1px solid #52C41A; }
.btn-buy { background: linear-gradient(135deg, #FA8C16, #FFC53D); }

.action-text { font-size: 24rpx; }
.btn-edit .action-text { color: #ffffff; }
.btn-off .action-text { color: #FA8C16; }
.btn-on .action-text { color: #52C41A; }
.btn-buy .action-text { color: #ffffff; }

.empty {
  display: flex;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-text { font-size: 28rpx; color: #cccccc; }

.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FA8C16, #FFC53D);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(250, 140, 22, 0.4);
}

.fab-text { font-size: 48rpx; color: #ffffff; font-weight: 600; }

/* 购买弹窗 */
.buy-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.buy-modal-content {
  width: 600rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx;
}

.buy-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.buy-modal-title { font-size: 36rpx; font-weight: 600; color: #1a1a1a; }
.buy-modal-close { font-size: 48rpx; color: #999999; line-height: 1; }

.buy-product-info {
  padding: 24rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  margin-bottom: 32rpx;
}

.buy-product-name { font-size: 32rpx; font-weight: 600; color: #1a1a1a; display: block; margin-bottom: 12rpx; }
.buy-product-price { font-size: 28rpx; color: #FF3B30; font-weight: 600; }

.buy-quantity { margin-bottom: 32rpx; }
.buy-label { font-size: 28rpx; color: #666666; display: block; margin-bottom: 16rpx; }

.quantity-control { display: flex; align-items: center; margin-bottom: 12rpx; }
.quantity-btn {
  width: 60rpx; height: 60rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  display: flex; align-items: center; justify-content: center;
}
.quantity-btn-text { font-size: 36rpx; color: #FA8C16; font-weight: 600; }
.quantity-input {
  flex: 1; height: 60rpx; text-align: center;
  font-size: 32rpx; color: #1a1a1a;
  margin: 0 20rpx; border: 2rpx solid #e0e0e0; border-radius: 12rpx;
}
.buy-stock { font-size: 24rpx; color: #999999; }

.buy-total {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24rpx; background-color: #fff7e6;
  border-radius: 12rpx; margin-bottom: 32rpx;
}
.buy-total-label { font-size: 28rpx; color: #666666; }
.buy-total-price { font-size: 36rpx; color: #FF3B30; font-weight: 700; }

.buy-actions { display: flex; gap: 20rpx; }
.buy-btn { flex: 1; height: 80rpx; border-radius: 40rpx; display: flex; align-items: center; justify-content: center; }
.buy-btn-cancel { background-color: #f5f7fa; }
.buy-btn-confirm { background: linear-gradient(135deg, #FA8C16, #FFC53D); }
.buy-btn-text { font-size: 28rpx; font-weight: 600; }
.buy-btn-cancel .buy-btn-text { color: #666666; }
.buy-btn-confirm .buy-btn-text { color: #ffffff; }
</style>
