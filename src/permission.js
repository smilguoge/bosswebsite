import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// permission judge function
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

// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ['/login', '/autologin'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/autologin') {
    next()
  } else if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.username === '' && store.getters.system !== '1') { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          const menus = res.data.menus // note: roles must be a array! such as: ['editor','develop']
          const system = res.data.system
          const manage_service = res.data.manage_service
          store.dispatch('GenerateRoutes', { menus, system, manage_service }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // store.getters.is_system === '1' ||
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          const menus = res.data.menus // note: roles must be a array! such as: ['editor','develop']
          const system = res.data.system
          const manage_service = res.data.manage_service
          if (hasPermission(menus, to, system, manage_service)) {
            next()
          } else {
            next({
              path: '/401',
              replace: true,
              query: { noGoBack: true }
            })
          }
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
        // 可删 ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
