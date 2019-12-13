/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const userRouter = {
  path: '/sms',
  component: Layout,
  redirect: 'noredirect',
  name: 'Sms',
  meta: {
    title: '短信管理',
    icon: 'message'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/sms/list'),
      name: 'SmsList',
      meta: { title: '短信记录', icon: 'form', auth: true }
    },
    {
      path: 'stats',
      component: () => import('@/views/sms/stats'),
      name: 'SmsStats',
      meta: { title: '短信统计', icon: 'form', auth: true }
    }
  ]
}
export default userRouter
