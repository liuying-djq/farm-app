import { registerMock } from './index'

const products = [
  {
    id: 1,
    userId: 1,
    plantId: 3,
    name: '有机小白菜',
    price: 5.8,
    quantity: 200,
    unit: '斤',
    description: '自家种植无农药小白菜，新鲜采摘，口感鲜嫩。',
    status: 'on_sale',
    createTime: '2026-04-01'
  },
  {
    id: 2,
    userId: 1,
    plantId: 1,
    name: '有机番茄',
    price: 8.5,
    quantity: 0,
    unit: '斤',
    description: '有机种植番茄，自然成熟，酸甜可口。',
    status: 'sold_out',
    createTime: '2026-04-05'
  },
  {
    id: 3,
    userId: 2,
    plantId: null,
    name: '新鲜草莓',
    price: 25.0,
    quantity: 50,
    unit: '盒',
    description: '大棚种植草莓，颗颗饱满，香甜多汁。',
    status: 'on_sale',
    createTime: '2026-04-08'
  },
  {
    id: 4,
    userId: 2,
    plantId: null,
    name: '土鸡蛋',
    price: 2.0,
    quantity: 300,
    unit: '个',
    description: '散养土鸡所产，营养丰富。',
    status: 'on_sale',
    createTime: '2026-04-10'
  }
]

let productIdCounter = products.length + 1

registerMock('/api/market/list', (data) => {
  const { userId, status } = data || {}
  let result = products
  if (userId) {
    result = result.filter(p => p.userId === userId)
  }
  if (status) {
    result = result.filter(p => p.status === status)
  }
  return result
})

registerMock('/api/market/all', () => {
  return products.filter(p => p.status === 'on_sale')
})

registerMock('/api/market/detail', (data) => {
  const { id } = data || {}
  return products.find(p => p.id === id) || null
})

registerMock('/api/market/create', (data) => {
  const product = {
    id: productIdCounter++,
    ...data,
    userId: data.userId || 1,
    status: 'on_sale',
    createTime: new Date().toISOString().slice(0, 10)
  }
  products.push(product)
  return product
})

registerMock('/api/market/update', (data) => {
  const { id, ...updates } = data || {}
  const idx = products.findIndex(p => p.id === id)
  if (idx !== -1) {
    Object.assign(products[idx], updates)
    return products[idx]
  }
  return null
})

registerMock('/api/market/offShelf', (data) => {
  const { id } = data || {}
  const idx = products.findIndex(p => p.id === id)
  if (idx !== -1) {
    products[idx].status = 'off_shelf'
    return products[idx]
  }
  return null
})

registerMock('/api/market/onShelf', (data) => {
  const { id } = data || {}
  const idx = products.findIndex(p => p.id === id)
  if (idx !== -1) {
    products[idx].status = 'on_sale'
    return products[idx]
  }
  return null
})
