import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
/* Router Modules */
import companyRouter from './modules/company'
import driverRouter from './modules/driver'
import wechatRouter from './modules/wechat'
import orderRouter from './modules/order'
import activityRouter from './modules/activity'
import userRouter from './modules/user'
import financeRouter from './modules/finance'
import extendRouter from './modules/extend'
import smsRouter from './modules/sms'
import statsRouter from './modules/stats'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/autologin', component: () => import('@/views/login/auto'), hidden: true },
  { path: '/404', name: '404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', name: '401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true },
        component: () => import('@/views/dashboard/index')
      },
      { path: 'profile', name: 'Profile', component: () => import('@/views/set/profile'), hidden: true },
      { path: 'password', name: 'Password', component: () => import('@/views/set/password'), hidden: true }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  orderRouter,
  {
    path: '/order1',
    component: Layout,
    redirect: 'noredirect',
    name: 'Order1',
    meta: {
      title: '订单管理',
      icon: 'order'
    },
    children: [
      {
        path: '/order/dispatch',
        name: 'OrderDispatch',
        component: () => import('@/views/order/dispatch'),
        meta: { title: '调度中心', icon: 'dispatch', auth: true }
        // meta: { title: '调度中心', icon: 'dispatch', target: '_blank', auth: true }
      }
    ]
  },
  // {
  //   path: '/order/dispatch',
  //   component: () => import('@/views/order/dispatch'),
  //   redirect: 'noredirect',
  //   name: 'Dispatch',
  //   meta: { title: '调度中心', icon: 'dispatch' },
  //   children: [
  //     {
  //       path: '/order/dispatch',
  //       name: 'OrderDispatch',
  //       component: () => import('@/views/order/dispatch'),
  //       meta: { title: '调度中心', icon: 'dispatch', target: '_blank', auth: true }
  //     }
  //   ]
  // },
  companyRouter,
  driverRouter,
  activityRouter,
  extendRouter,
  userRouter,
  financeRouter,
  statsRouter,
  smsRouter,
  wechatRouter,
  {
    path: '/set',
    component: Layout,
    redirect: 'noredirect',
    name: 'Set',
    meta: { title: '系统设置', icon: 'example' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/set/admin'),
        name: 'AdminList',
        meta: { title: '人员管理', icon: 'form', auth: true }
      },
      {
        path: 'role',
        component: () => import('@/views/set/role'),
        name: 'AdminRoleList',
        meta: { title: '角色管理', icon: 'form', auth: true }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
