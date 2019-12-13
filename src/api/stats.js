import request from '@/utils/request'

export function getTemporalCount(query) {
  return request({
    url: '/api/stats/temporal',
    method: 'get',
    params: query
  })
}

export function getOrder(query) {
  return request({
    url: '/api/stats/order',
    method: 'get',
    params: query
  })
}

export function getOrderUnion(query) {
  return request({
    url: '/api/stats/order_union',
    method: 'get',
    params: query
  })
}

export function getDriver(query) {
  return request({
    url: '/api/stats/driver',
    method: 'get',
    params: query
  })
}

export function getDriverRecharge(query) {
  return request({
    url: '/api/stats/driver_recharge',
    method: 'get',
    params: query
  })
}
