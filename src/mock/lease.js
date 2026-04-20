import { registerMock } from './index'

let contractCounter = 20260001

const leases = []

registerMock('/api/lease/create', (data) => {
  const { landId, userId, startDate, endDate, months } = data || {}
  const contractNo = 'HT' + contractCounter++
  const lease = {
    id: leases.length + 1,
    landId,
    userId: userId || 1,
    startDate,
    endDate,
    months,
    contractNo,
    status: 'active',
    createTime: new Date().toISOString().slice(0, 10)
  }
  leases.push(lease)
  return lease
})

registerMock('/api/lease/contract', (data) => {
  const { id } = data || {}
  const lease = leases.find(l => l.id === id)
  if (!lease) return null
  return {
    ...lease,
    partyA: '智慧农场管理有限公司',
    partyB: '用户' + lease.userId,
    terms: [
      '甲方将上述土地出租给乙方使用，租赁期限内乙方享有该土地的使用权。',
      '乙方应按照约定的用途使用土地，不得擅自改变土地用途。',
      '乙方应按时缴纳租金，逾期超过30日甲方有权解除合同。',
      '租赁期间，乙方负责土地的日常管理和维护。',
      '租赁期满，乙方如需续租，应在期满前30日书面通知甲方。',
      '任何一方违约，应承担违约责任，并赔偿对方因此造成的损失。'
    ]
  }
})

registerMock('/api/lease/my', (data) => {
  const { userId } = data || {}
  return leases.filter(l => l.userId === (userId || 1))
})
