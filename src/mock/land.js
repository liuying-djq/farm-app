import { registerMock } from './index'

const lands = [
  {
    id: 1,
    name: '阳光田园A01',
    area: 2.5,
    price: 800,
    location: '东区-阳光大道1号',
    soilType: '黑土',
    status: 'available',
    description: '位于阳光田园核心区域，土壤肥沃，灌溉便利，适合种植各类蔬菜和粮食作物。'
  },
  {
    id: 2,
    name: '碧水田庄B03',
    area: 3.0,
    price: 750,
    location: '南区-碧水路15号',
    soilType: '黄土',
    status: 'available',
    description: '临近水源，排水良好，适合水稻及水生作物种植。'
  },
  {
    id: 3,
    name: '翠微农场C07',
    area: 1.8,
    price: 900,
    location: '西区-翠微山路8号',
    soilType: '沙壤土',
    status: 'available',
    description: '山地梯田，光照充足，适合种植果树和药材。'
  },
  {
    id: 4,
    name: '金穗田园D12',
    area: 5.0,
    price: 650,
    location: '北区-金穗大道22号',
    soilType: '壤土',
    status: 'available',
    description: '大面积平原地块，机械化程度高，适合大规模粮食种植。'
  },
  {
    id: 5,
    name: '云溪田庄E05',
    area: 2.0,
    price: 850,
    location: '东区-云溪路6号',
    soilType: '黏土',
    status: 'leased',
    description: '土壤保水性好，有机质含量高，适合根茎类作物。'
  },
  {
    id: 6,
    name: '丰收农场F09',
    area: 4.2,
    price: 700,
    location: '南区-丰收路30号',
    soilType: '黑土',
    status: 'available',
    description: '连片优质黑土地，基础设施完善，适合多种作物轮作。'
  }
]

registerMock('/api/land/list', (data) => {
  const { status } = data || {}
  if (status) {
    return lands.filter(l => l.status === status)
  }
  return lands
})

registerMock('/api/land/detail', (data) => {
  const { id } = data || {}
  return lands.find(l => l.id === id) || null
})
