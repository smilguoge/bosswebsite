import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function autologin(code) {
  return request({
    url: '/api/auth/code',
    method: 'post',
    data: {
      code
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/auth/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'get'
  })
}

export function postRefresh() {
  return request({
    url: '/api/auth/refresh',
    method: 'post'
  })
}
