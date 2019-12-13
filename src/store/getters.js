const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar_url: state => state.user.avatar_url,
  realname: state => state.user.realname,
  company_id: state => state.user.company_id,
  company_uuid: state => state.user.company_uuid,
  mobile: state => state.user.mobile,
  username: state => state.user.username,
  roles: state => state.user.roles,
  system: state => state.user.system,
  menus: state => state.user.menus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}

export default getters
