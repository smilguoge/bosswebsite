/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const financeRouter = {
  path: '/finance',
  component: Layout,
  redirect: 'noredirect',
  name: 'Finance',
  meta: {
    title: '财务管理',
    icon: 'finance'
  },
  children: [
    {
      path: 'platformdeal',
      component: () => import('@/views/finance/platformdeal'),
      name: 'PlatformDeal',
      meta: { title: '公司流水', icon: 'form', auth: true }
    },
    {
      path: 'driverdeal',
      component: () => import('@/views/finance/driverdeal'),
      name: 'driverDeal',
      meta: { title: '司机流水', icon: 'form', auth: true }
    }
  ]
}
export default financeRouter
