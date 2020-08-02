import Vue from 'vue';
import { getUserCenterCode } from '@/utils/passport';
import { getToken } from '@/api/login/h5login';
import { getWxAuth } from '@/utils';

const state = {
  // 用户中心code码
  code: '',
  auth: '',
};

const getter = {};

const actions = {
  // 获取用户中心code码
  async queryUserCenterCode ({ commit }, payload) {
    try {
      const response = await getUserCenterCode();
      const { code } = response.data;
      commit('updateCode', code);
      return code;
    } catch (error) {
      // 重定向登录页获取auth
      getWxAuth();
    }
  },

  // 通过auth、code参数进行登录
  async login ({ commit, state }) {
    try {
      const { auth, code } = state;
      const response = await getToken({
        auth,
        code,
      });

      if (response.code === 200) {
        const { data } = response;
        localStorage.setItem('token', data.tal_token);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('platform', 'h5');
        localStorage.setItem('mathOpenId', data.openid);
      } else {
        new Vue().$MkToast(response.msg);
      }
    } catch (error) { }
  },
};

const mutations = {
  updateCode (state, payload) {
    state.code = payload;
  },

  // 更新auth参数，获取后端token时使用
  updateAuth (state, payload) {
    state.auth = payload;
  },
};

export default {
  namespaced: true,
  state,
  getter,
  actions,
  mutations,
};
