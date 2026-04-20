import { registerMock } from './index'

const plants = [
  {
    id: 1,
    landId: 5,
    landName: '云溪田庄E05',
    name: '有机番茄',
    plantDate: '2026-02-15',
    expectedHarvestDate: '2026-06-15',
    status: 'growing',
    growthStage: '开花期',
    description: '选用优质番茄品种，采用有机种植方式。'
  },
  {
    id: 2,
    landId: 5,
    landName: '云溪田庄E05',
    name: '紫薯',
    plantDate: '2026-01-10',
    expectedHarvestDate: '2026-07-10',
    status: 'growing',
    growthStage: '生长期',
    description: '富硒紫薯，营养价值高。'
  },
  {
    id: 3,
    landId: 5,
    landName: '云溪田庄E05',
    name: '小白菜',
    plantDate: '2026-03-01',
    expectedHarvestDate: '2026-04-15',
    status: 'mature',
    growthStage: '成熟期',
    description: '无农药小白菜，新鲜健康。'
  }
]

let plantIdCounter = plants.length + 1

registerMock('/api/plant/list', (data) => {
  const { userId } = data || {}
  return plants
})

registerMock('/api/plant/detail', (data) => {
  const { id } = data || {}
  return plants.find(p => p.id === id) || null
})

registerMock('/api/plant/create', (data) => {
  const plant = {
    id: plantIdCounter++,
    ...data,
    status: 'growing',
    growthStage: '播种期',
  }
  plants.push(plant)
  return plant
})

registerMock('/api/plant/update', (data) => {
  const { id, ...updates } = data || {}
  const idx = plants.findIndex(p => p.id === id)
  if (idx !== -1) {
    Object.assign(plants[idx], updates)
    return plants[idx]
  }
  return null
})

registerMock('/api/plant/delete', (data) => {
  const { id } = data || {}
  const idx = plants.findIndex(p => p.id === id)
  if (idx !== -1) {
    plants.splice(idx, 1)
    return { success: true }
  }
  return { success: false }
})
