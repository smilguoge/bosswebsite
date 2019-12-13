import request from '@/utils/request'

export function getOrderList(query) {
  return request({
    url: '/api/order/list',
    method: 'get',
    params: query
  })
}

export function postOrder(data) {
  return request({
    url: '/api/order/save',
    method: 'post',
    data
  })
}

export function getOrderDetail(id) {
  return request({
    url: '/api/order/detail',
    method: 'get',
    params: { id: id }
  })
}

export function postOrderPatch(data) {
  return request({
    url: '/api/order/patch',
    method: 'post',
    data
  })
}

export function postOrderRemark(data) {
  return request({
    url: '/api/order/remark',
    method: 'post',
    data
  })
}

export function postOrderCancel(data) {
  return request({
    url: '/api/order/cancel',
    method: 'post',
    data
  })
}

export function postOrderRecover(order_id) {
  return request({
    url: '/api/order/recover',
    method: 'post',
    params: { order_id: order_id }
  })
}

export function getOrderStep(order_id) {
  return request({
    url: '/api/order/step',
    method: 'get',
    params: { id: order_id }
  })
}

export function getOrderLog(order_id) {
  return request({
    url: '/api/order/log',
    method: 'get',
    params: { order_id: order_id }
  })
}
export function getOrderDrivingTime(order_id) {
  return request({
    url: '/api/order/driving_time',
    method: 'get',
    params: { order_id: order_id }
  })
}
export function getOrderRefuseLog(order_id) {
  return request({
    url: '/api/order/refuse_log',
    method: 'get',
    params: { order_id: order_id }
  })
}

export function getOrderTrack(order_id) {
  return request({
    url: '/api/order/track',
    method: 'get',
    params: { order_id: order_id }
  })
}

export function getOrderSound(order_id) {
  return request({
    url: '/api/order/sound',
    method: 'get',
    params: { order_id: order_id }
  })
}

export function postOrderComplate(data) {
  return request({
    url: '/api/order/complate',
    method: 'post',
    data
  })
}

/**
 * 获取订单金额
 * @param data
 */
export function postOrderMoney(data) {
  return request({
    url: '/api/order/money',
    method: 'post',
    data
  })
}

