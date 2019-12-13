/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noredirect',
  name: 'User',
  meta: {
    title: '客户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'UserList',
      meta: { title: '客户管理', icon: 'user', auth: true }
    }
  ]
}
export default userRouter
