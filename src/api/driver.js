import request from '@/utils/request'

export function getDriverList(query) {
  return request({
    url: '/api/driver/list',
    method: 'get',
    params: query
  })
}

export function getDriverOnlineTime(query) {
  return request({
    url: '/api/driver/online_time',
    method: 'get',
    params: query
  })
}

export function getDriverPlist(query) {
  return request({
    url: '/api/driver/plist',
    method: 'get',
    params: query
  })
}

export function getDriverSearch(query) {
  return request({
    url: '/api/driver/search',
    method: 'get',
    params: query
  })
}

export function getDriverStatusCount(query) {
  return request({
    url: '/api/driver/status_count',
    method: 'get',
    params: query
  })
}

export function postDriver(data) {
  return request({
    url: '/api/driver/save',
    method: 'post',
    data
  })
}

export function deleteDriver(data) {
  return request({
    url: '/api/driver/delete',
    method: 'delete',
    data
  })
}

export function getDriverNearby(query) {
  return request({
    url: '/api/driver/nearby',
    method: 'get',
    params: query
  })
}

/**
 * 设备解绑
 */
export function postUntying(data) {
  return request({
    url: '/api/driver/untying',
    method: 'post',
    data
  })
}
/**
 *冻结/解冻司机
 */
export function postFrozen(data) {
  return request({
    url: '/api/driver/frozen',
    method: 'post',
    data
  })
}

/**
 *强制司机下班
 */
export function postOffwork(data) {
  return request({
    url: '/api/driver/offwork',
    method: 'post',
    data
  })
}

/**
 * 修改服务人员密码
 */
export function postChangePassword(data) {
  return request({
    url: '/api/driver/change_password',
    method: 'post',
    data
  })
}

/**
 *充值列表
 */
export function getDriverRecharge(query) {
  return request({
    url: '/api/driver/recharge/list',
    method: 'get',
    params: query
  })
}

/**
 * 服务人员充值
 */
export function postDriverRecharge(data) {
  return request({
    url: '/api/driver/recharge/money',
    method: 'post',
    data
  })
}

/**
 * 服务人员信息
 */
export function getDriverInfo(query) {
  return request({
    url: '/api/driver/info',
    method: 'get',
    params: query
  })
}

