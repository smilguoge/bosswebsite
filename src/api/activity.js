import request from '@/utils/request'

/**
 * @param 客户优惠活动
 */
export function getCustomerDiscount() {
  return request({
    url: '/api/activity/customer/discount',
    method: 'get'
  })
}

/**
 * @param 保存客户优惠活动
 */
export function postCustomerDiscount(data) {
  return request({
    url: '/api/activity/customer/discount',
    method: 'post',
    data
  })
}

/**
 * @param 司机推荐奖励获取
 */
export function getDriverReward() {
  return request({
    url: '/api/activity/driver/reward',
    method: 'get'
  })
}

/**
 * @param 司机推荐奖励保存
 */
export function postDriverReward(data) {
  return request({
    url: '/api/activity/driver/reward',
    method: 'post',
    data
  })
}
/**
 * @param  红包发放列表
 */
export function getRedpacklist(query) {
  return request({
    url: '/api/activity/redpack/list',
    method: 'get',
    params: query
  })
}
