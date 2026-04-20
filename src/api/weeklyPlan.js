import { request } from './index'

export function getWeeklyPlansByLand(data) {
  return request('/api/weeklyPlan/listByLand', data)
}

export function getWeeklyPlansByPlant(data) {
  return request('/api/weeklyPlan/listByPlant', data)
}

export function completeWeeklyPlan(data) {
  return request('/api/weeklyPlan/complete', data)
}
