import request from '@/utils/request'
/**
 * @param 公司流水明细
 */
export function getCompanyFinanceList(query) {
  return request({
    url: '/api/finance/platformdeal',
    method: 'get',
    params: query
  })
}

/**
 * 服务人员流水明细
 */
export function getDriverFinanceList(query) {
  return request({
    url: '/api/finance/driverdeal',
    method: 'get',
    params: query
  })
}

/**
 *支付账单
 */
export function postRechargetopay(data) {
  return request({
    url: '/api/finance/topay',
    method: 'post',
    data
  })
}
