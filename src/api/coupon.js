import request from '@/utils/request'

export function getCouponList(query) {
  return request({
    url: '/api/coupon/list',
    method: 'get',
    params: query
  })
}

export function getCouponPlist(query) {
  return request({
    url: '/api/coupon/plist',
    method: 'get',
    params: query
  })
}

export function postCouponInvalid(data) {
  return request({
    url: '/api/coupon/invalid',
    method: 'post',
    data
  })
}

export function getCouponRuleList(query) {
  return request({
    url: '/api/coupon/rule/list',
    method: 'get',
    params: query
  })
}

export function getCouponRulePutTime(rule_id) {
  return request({
    url: '/api/coupon/rule/put_time',
    method: 'get',
    params: { rule_id: rule_id }
  })
}

export function postCouponRuleInvalid(data) {
  return request({
    url: '/api/coupon/rule/invalid',
    method: 'post',
    data
  })
}

export function postCouponRuleBuild(data) {
  return request({
    url: '/api/coupon/rule/build',
    method: 'post',
    data
  })
}

export function postCouponRule(data) {
  return request({
    url: '/api/coupon/rule/save',
    method: 'post',
    data
  })
}

