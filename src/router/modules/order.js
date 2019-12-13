/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: 'noredirect',
  name: 'Order',
  meta: {
    title: '订单管理',
    icon: 'order'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/order/list'),
      name: 'OrderList',
      meta: { title: '订单列表', icon: 'order', auth: true }
    },
    { path: '/create', name: 'OrderCreate', component: () => import('@/views/order/create'), hidden: true },
    { path: '/create/:group_id', name: 'OrderGroup', component: () => import('@/views/order/create'), hidden: true }
  ]
}

export default orderRouter
