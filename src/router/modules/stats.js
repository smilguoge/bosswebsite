/**
 * 统计
 */
import Layout from '@/views/layout/Layout'

const statsRouter = {
  path: '/stats',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Stats',
  meta: { title: '统计管理', icon: 'chart' },
  children: [
    {
      path: 'order',
      name: 'StatsOrder',
      component: () => import('@/views/stats/order'),
      meta: { title: '订单汇总', icon: 'form', auth: true }
    },
    {
      path: 'driver',
      name: 'StatsDriver',
      component: () => import('@/views/stats/driver'),
      meta: { title: '人员汇总', icon: 'form', auth: true }
    },
    {
      path: 'driver_recharge',
      name: 'StatsDriverRecharge',
      component: () => import('@/views/stats/driver_recharge'),
      meta: { title: '人员充值', icon: 'form', auth: true }
    }
  ]
}
export default statsRouter
