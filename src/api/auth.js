import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/api/auth/info',
    method: 'get'
  })
}

/**
 *  修改个人资料
 */
export function postProfile(data) {
  return request({
    url: '/api/auth/profile',
    method: 'post',
    data
  })
}

/**
 *  修改密码
 */
export function postPassword(data) {
  return request({
    url: '/api/auth/password',
    method: 'post',
    data
  })
}

