import request from '@/utils/request'

/**
 * @param 客户列表
 */
export function getUserList(query) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params: query
  })
}
/**
 * @param  拉黑用户/移除黑名单
 */
export function postBlack(data) {
  return request({
    url: '/api/user/black',
    method: 'post',
    data
  })
}

