import request from '@/utils/request'

export function getSmsList(query) {
  return request({
    url: '/api/sms/list',
    method: 'get',
    params: query
  })
}

export function getSmsStats(query) {
  return request({
    url: '/api/sms/stats',
    method: 'get',
    params: query
  })
}

