import request from '@/utils/request'

/**
 * 推广列表
 * @param query
 */
export function getShoplist(query) {
  return request({
    url: '/api/extend/shop/list',
    method: 'get',
    params: query
  })
}

/**
 *
 * @param data
 */
export function postShopsave(data) {
  return request({
    url: '/api/extend/shop/save',
    method: 'post',
    data
  })
}

export function postShopstatus(data) {
  return request({
    url: '/api/extend/shop/status',
    method: 'post',
    data
  })
}

/**
 * 推广记录
 * @param query
 */
export function getShoplog(query) {
  return request({
    url: '/api/extend/shop/log',
    method: 'get',
    params: query
  })
}

/**
 * 退回
 */
export function postRecover(data) {
  return request({
    url: '/api/extend/shop/recover',
    method: 'post',
    data
  })
}

/**
 * 线下支付
 */
export function postOffline(data) {
  return request({
    url: '/api/extend/shop/offline',
    method: 'post',
    data
  })
}

