/**
 * 公司管理
 */
import Layout from '@/views/layout/Layout'

const companyRouter = {
  path: '/company',
  component: Layout,
  redirect: 'noredirect',
  name: 'Company',
  meta: { title: '公司管理', icon: 'company' },
  children: [
    {
      path: 'info',
      name: 'CompanyInfo',
      component: () => import('@/views/company/info'),
      meta: { title: '基础信息', icon: 'form', auth: true }
    },
    {
      path: 'royalty',
      name: 'RoyaltyList',
      component: () => import('@/views/company/royalty'),
      meta: { title: '提成方案', icon: 'form', auth: true }
    },
    {
      path: 'standard',
      name: 'StandardList',
      component: () => import('@/views/company/standard'),
      meta: { title: '收费方案', icon: 'form', auth: true }
    },
    {
      path: 'charge_standard',
      name: 'ChargeStandardList',
      component: () => import('@/views/company/charge_standard'),
      meta: { title: '收费标准', icon: 'form', auth: true }
    },
    {
      path: 'setup',
      name: 'CompanySet',
      component: () => import('@/views/company/setup'),
      meta: { title: '公司设置', icon: 'form', auth: true }
    },
    {
      path: 'fence',
      name: 'CompanyFence',
      component: () => import('@/views/company/fence'),
      meta: { title: '围栏设置', icon: 'fence', auth: true }
    },
    {
      path: 'signlist',
      name: 'CompanySignlist',
      component: () => import('@/views/company/signlist'),
      meta: { title: '入职申请', icon: 'form', auth: true }
    }
  ]
}
export default companyRouter
