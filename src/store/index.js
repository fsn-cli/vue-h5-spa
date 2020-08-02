import Vue from 'vue';
import Vuex from 'vuex';
import course from './moudle/course';
import bonusMall from './moudle/bonusMall';
import login from './moudle/login';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    course,
    bonusMall,
    login,
  },
});
