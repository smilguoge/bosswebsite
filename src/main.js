import Vue from 'vue'
import VueAMap from 'vue-amap'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'b6f6175fda66c5c2a1bda1fc73d08e7e',
  plugin: ['AMap.Autocomplete', 'AMap.MouseTool', 'AMap.Driving', 'AMap.RangingTool', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.Geocoder', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale, 'size': 'mini' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
