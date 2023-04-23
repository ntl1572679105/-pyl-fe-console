import storage from 'store';
import { login, getInfo } from '@/api/login';
import { ACCESS_TOKEN } from '@/store/mutation-types';

const user = {
  state: {
    token: '',
    // 权限数组
    permissions: [],
    // 角色数组
    roles: [],
    // 用户信息
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            const { token } = res;
            // 保存token
            storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000);
            commit('SET_TOKEN', token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const { permissions, roles, user } = res;
            commit('SET_PERMISSIONS', permissions);
            commit('SET_ROLES', roles);
            commit('SET_INFO', user);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        commit('SET_PERMISSIONS', []);
        commit('SET_ROLES', []);
        storage.remove(ACCESS_TOKEN);
        resolve();
        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_PERMISSIONS', [])
        //   commit('SET_ROLES', [])
        //   storage.remove(ACCESS_TOKEN)
        //   resolve()
        // }).catch((err) => {
        //   console.log('logout fail:', err)
        //   // resolve()
        // }).finally(() => {
        // })
      });
    },
    // 强制退出
    Reset({ commit }) {
      commit('SET_TOKEN', '');
      commit('SET_PERMISSIONS', []);
      commit('SET_ROLES', []);
      commit('SET_INFO', {});
      storage.remove(ACCESS_TOKEN);
    },
  },
};

export default user;
