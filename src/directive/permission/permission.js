import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const menus = store.getters && store.getters.menus

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = menus.some(menu => {
        if (store.getters.system === '1') {
          return true
        } else {
          return permissionRoles.includes(menu)
        }
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
