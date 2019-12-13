/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const driverRouter = {
  path: '/driver',
  component: Layout,
  redirect: 'noredirect',
  name: 'Driver',
  meta: {
    title: '服务人员管理',
    icon: 'driver'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/driver/list'),
      name: 'DriverList',
      meta: { title: '服务人员', icon: 'driver', auth: true }
    },
    {
      path: 'recharge/:driver_id',
      component: () => import('@/views/driver/recharge'),
      name: 'DriverRecharge',
      meta: { title: '人员充值', noCache: true, auth: true },
      hidden: true
    }
  ]
}
export default driverRouter
