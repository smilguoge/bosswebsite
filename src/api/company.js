import request from '@/utils/request'

/**
 * @param 获取公司基本信息
 */
export function getCompanyInfo(query) {
  return request({
    url: '/api/company/info',
    method: 'get',
    params: query
  })
}

/**
 * @param 保存公司基本信息
 */
export function postCompany(data) {
  return request({
    url: '/api/company/save',
    method: 'post',
    data
  })
}

/**
 * @param 获取公司提成列表
 */
export function getCompanyRoyalty(query) {
  return request({
    url: '/api/company/royalty/list',
    method: 'get',
    params: query
  })
}
/**
 * @param 保存公司提成列表
 */
export function postCompanyRoyalty(data) {
  return request({
    url: '/api/company/royalty/save',
    method: 'post',
    data
  })
}
/**
 * @param 删除公司提成列表
 */
export function deleteCompanyRoyalty(data) {
  return request({
    url: '/api/company/royalty/delete',
    method: 'delete',
    data
  })
}

/**
 * @param 获取公司收费列表
 */
export function getCompanyStandard(query) {
  return request({
    url: '/api/company/standard/list',
    method: 'get',
    params: query
  })
}

/**
 * @param 保存公司收费列表
 */
export function postCompanyStandard(data) {
  return request({
    url: '/api/company/standard/save',
    method: 'post',
    data
  })
}

/**
 * @param 删除公司收费
 */
export function deleteCompanyStandard(data) {
  return request({
    url: '/api/company/standard/delete',
    method: 'delete',
    data
  })
}

/**
 * @param 获取公司收费数组
 */
export function getCompanyStandardPlist(query) {
  return request({
    url: '/api/company/standard/plist',
    method: 'get',
    params: query
  })
}

/**
 * @param 获取公司提成数组
 */
export function getCompanyRoyaltyPlist(query) {
  return request({
    url: '/api/company/royalty/plist',
    method: 'get',
    params: query
  })
}

/**
 * @param 获取公司代驾业务收费列表
 */
export function getCompanyChargeStandard(query) {
  return request({
    url: '/api/company/charge_standard/list',
    method: 'get',
    params: query
  })
}

/**
 * @param 保存公司代驾业务收费列表
 */
export function postCompanyChargeStandard(data) {
  return request({
    url: '/api/company/charge_standard/save',
    method: 'post',
    data
  })
}
/**
 * @param 删除公司代驾业务收费
 */
export function deleteCompanyChargeStandard(data) {
  return request({
    url: '/api/company/charge_standard/delete',
    method: 'delete',
    data
  })
}

/**
 * @param 获取公司配置
 */
export function getCompanySetup(query) {
  return request({
    url: '/api/company/setup/detail',
    method: 'get',
    params: query
  })
}

/**
 * @param 公司配置 保存
 */
export function postCompanySetup(data) {
  return request({
    url: '/api/company/setup/save',
    method: 'post',
    data
  })
}

/**
 * @param 获取公司围栏
 */
export function getFencelist(query) {
  return request({
    url: '/api/company/fence/list',
    method: 'get',
    params: query
  })
}

/**
 * @param 保存公司围栏
 */
export function postFence(data) {
  return request({
    url: '/api/company/fence/save',
    method: 'post',
    data
  })
}
/**
 * @param 删除公司代驾业务收费
 */
export function deleteFence(data) {
  return request({
    url: '/api/company/fence/delete',
    method: 'delete',
    data
  })
}
/**
 * @param 公司充值
 */
export function postRecharge(data) {
  return request({
    url: '/api/recharge/save',
    method: 'post',
    data
  })
}

/**
 * @param 围栏设置
 */
export function getFenceSet(query) {
  return request({
    url: '/api/company/fence/set',
    method: 'get',
    params: query
  })
}

/**
 * @param 保存围栏设置
 */
export function postFenceSet(data) {
  return request({
    url: '/api/company/fence/set',
    method: 'post',
    data
  })
}

/**
 * 获取公众号下的公司
 */
export function getWechatCompany(query) {
  return request({
    url: '/api/company/company_array',
    method: 'get',
    params: query
  })
}

/**
 * 获取公司报名列表
 */
export function getDriverSign(query) {
  return request({
    url: '/api/company/driver_sign/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取公司app下载链接
 */
export function getAppdownurl(query) {
  return request({
    url: '/api/company/appdownurl',
    method: 'get',
    params: query
  })
}
