import { login, logout, getInfo, autologin } from '@/api/login'
import { getCompanyInfo } from '@/api/company'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    realname: '',
    mobile: '',
    username: '',
    company_id: '',
    company_uuid: '',
    avatar_url: '',
    system: '',
    menus: [],
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.realname = name
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_COMPANY_ID: (state, company_id) => {
      state.company_id = company_id
    },
    SET_COMPANY_UUID: (state, company_uuid) => {
      state.company_uuid = company_uuid
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar_url = avatar
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_SYSTEM: (state, system) => {
      state.system = system
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          var _token = data.token_type + ' ' + data.access_token
          setToken(_token)
          commit('SET_TOKEN', _token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    AutoLogin({ commit }, info) {
      const code = info.code.trim()
      return new Promise((resolve, reject) => {
        autologin(code).then(response => {
          const data = response.data
          var _token = data.token_type + ' ' + data.access_token
          setToken(_token)
          commit('SET_TOKEN', _token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          // if (data.system !== '1' && data.menus && data.menus.length === 0) { // 验证返回的roles是否是一个非空数组
          //   reject('请联系管理设置权限')
          // }
          commit('SET_ROLES', data.roles)
          commit('SET_MENUS', data.menus)
          commit('SET_SYSTEM', data.system)
          commit('SET_NAME', data.realname)
          commit('SET_AVATAR', data.avatar_url)
          commit('SET_COMPANY_ID', data.company_id)
          commit('SET_COMPANY_UUID', data.company_uuid)
          commit('SET_USERNAME', data.username)
          commit('SET_MOBILE', data.mobile)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetCompany({ commit, state }) {
      return new Promise((resolve, reject) => {
        getCompanyInfo().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_MENUS', [])
          commit('SET_SYSTEM', '')
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_COMPANY_ID', '')
          commit('SET_COMPANY_UUID', '')
          commit('SET_USERNAME', '')
          commit('SET_MOBILE', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_MENUS', [])
        commit('SET_SYSTEM', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_COMPANY_ID', '')
        commit('SET_COMPANY_UUID', '')
        commit('SET_USERNAME', '')
        commit('SET_MOBILE', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
