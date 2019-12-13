/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const activityRouter = {
  path: '/activity',
  component: Layout,
  redirect: 'noredirect',
  name: 'activity',
  meta: {
    title: '营销活动',
    icon: 'activity'
  },
  children: [
    {
      path: 'customer_activity',
      component: () => import('@/views/activity/customer_activity'),
      name: 'CustomerActivity',
      meta: { title: '客户活动', icon: 'form', auth: true }
    },
    {
      path: 'driver_activity',
      component: () => import('@/views/activity/driver_activity'),
      name: 'DriverActivity',
      meta: { title: '司机奖励', icon: 'form', auth: true }
    },
    {
      path: 'redpack_list',
      component: () => import('@/views/activity/redpack_list'),
      name: 'RedpackList',
      meta: { title: '红包发放', icon: 'form', auth: true }
    },
    {
      path: 'coupon_rule',
      component: () => import('@/views/activity/coupon_rule'),
      name: 'CouponRule',
      meta: { title: '优惠券规则', icon: 'form', auth: true }
    },
    {
      path: 'coupon',
      component: () => import('@/views/activity/coupon'),
      name: 'Coupon',
      meta: { title: '优惠券列表', icon: 'form', auth: true }
    }
  ]
}
export default activityRouter
