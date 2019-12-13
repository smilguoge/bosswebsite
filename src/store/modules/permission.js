import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route, system, manage_service) {
  if (route.meta && route.meta.manage_service === true) {
    return manage_service === '1' && (system === '1' || menus.some(role => route.name === role))
  } else if (system === '1') {
    return true
  } else if (route.meta && route.meta.auth === true) {
    return menus.some(role => route.name === role)
    // return menus.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param menus
 */
function filterAsyncRouter(routes, menus, system, manage_service) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menus, tmp, system, manage_service)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, menus, system, manage_service)
      }
      if (tmp.children === undefined || tmp.children.length > 0) {
        res.push(tmp)
      }
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus, system, manage_service } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menus, system, manage_service)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
