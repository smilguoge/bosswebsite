/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const wechatRouter = {
  path: '/wechat',
  component: Layout,
  redirect: 'noredirect',
  name: 'Wechat',
  meta: {
    title: '公众号管理',
    icon: 'wechat'
  },
  children: [
    {
      path: 'menu',
      component: () => import('@/views/wechat/menu'),
      name: 'WechatMenu',
      meta: { title: '菜单列表', icon: 'form', auth: true, manage_service: true }
    },
    {
      path: 'replay',
      component: () => import('@/views/wechat/reply'),
      name: 'WechatReply',
      meta: { title: '关注回复', icon: 'form', auth: true, manage_service: true }
    },
    {
      path: 'redpack',
      component: () => import('@/views/wechat/redpack'),
      name: 'WechatRedpack',
      meta: { title: '红包活动', icon: 'redpack', auth: true, manage_service: true }
    }
  ]
}
export default wechatRouter
