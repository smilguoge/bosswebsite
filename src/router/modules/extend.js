/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const extendRouter = {
  path: '/extend',
  component: Layout,
  redirect: 'noredirect',
  name: 'Extend',
  meta: {
    title: '营销推广',
    icon: 'extend'
  },
  children: [
    {
      path: 'shop_list',
      component: () => import('@/views/extend/shop_list'),
      name: 'ExtendShop',
      meta: { title: '商户推广', icon: 'extend', auth: true }
    },
    {
      path: 'shop_log/:shop_id',
      component: () => import('@/views/extend/shop_log'),
      name: 'ShopLog',
      meta: { title: '推广记录', noCache: true, auth: true },
      hidden: true
    }
  ]
}
export default extendRouter
