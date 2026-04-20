import { registerMock } from './index'

const user = {
  id: 1,
  nickname: '农场主小明',
  phone: '138****8888',
  avatar: '',
  leaseCount: 1,
  plantCount: 3,
  productCount: 2
}

registerMock('/api/user/info', () => {
  return user
})

registerMock('/api/user/update', (data) => {
  Object.assign(user, data)
  return user
})
