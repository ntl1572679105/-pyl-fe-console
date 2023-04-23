const getters = {
  token: (state) => state.user.token,
  roles: (state) => state.user.roles,
  userInfo: (state) => state.user.info,
  addRouters: (state) => state.permission.addRouters,
  permissions: (state) => state.user.permissions,
};

export default getters;
