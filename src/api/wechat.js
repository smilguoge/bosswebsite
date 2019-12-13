import request from '@/utils/request'

/**
 * 获取微信公众号父菜单
 * @param query
 */
export function getWechatmenuPlist(query) {
  return request({
    url: '/api/wechat/menu/plist',
    method: 'get',
    params: query
  })
}

/**
 * 获取公众号菜单
 * @param query
 */
export function getWechatmenuList(query) {
  return request({
    url: '/api/wechat/menu/list',
    method: 'get',
    params: query
  })
}

/**
 * 菜单树
 * @param query
 */
export function getWechatmenutree(query) {
  return request({
    url: '/api/wechat/menu/tree',
    method: 'get',
    params: query
  })
}

/**
 * 删除微信菜单
 * @param data
 */
export function deleteWechatmenu(data) {
  return request({
    url: '/api/wechat/menu/delete',
    method: 'delete',
    data
  })
}

/**
 * 新增微信菜单
 * @param data
 */
export function postWechatmenu(data) {
  return request({
    url: '/api/wechat/menu/save',
    method: 'post',
    data
  })
}

/**
 * 回复配置
 * @param data
 */
export function getWechatreply(data) {
  return request({
    url: '/api/wechat/followback/reply',
    method: 'get',
    data
  })
}

/**
 * 保存回复
 * @param data
 */
export function postWechatreply(data) {
  return request({
    url: '/api/wechat/followback/savereply',
    method: 'post',
    data
  })
}

/**
 * 创建菜单
 * @param data
 */
export function createWechatmenu(data) {
  return request({
    url: '/api/wechat/menu/create',
    method: 'post',
    data
  })
}

/**
 * 红包列表
 */
export function getRedpackList(query) {
  return request({
    url: '/api/wechat/redpack/list',
    method: 'get',
    params: query
  })
}

/**
 * 保存红包
 */
export function postRedpack(data) {
  return request({
    url: '/api/wechat/redpack/save',
    method: 'post',
    data
  })
}

/**
 * 删除红包
 */
export function deleteRedpack(data) {
  return request({
    url: '/api/wechat/redpack/delete',
    method: 'delete',
    data
  })
}

/**
 * 检查发放情况
*/
export function getRedpackCheck(query) {
  return request({
    url: '/api/wechat/redpack/check',
    method: 'get',
    params: query
  })
}
