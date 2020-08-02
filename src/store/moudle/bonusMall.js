const state = {
  // 下单接口是否触发的标志
  isPostOrder: false,
};

const getters = {};

const actions = {};

const mutations = {
  updatePostOrder (state, payload) {
    state.isPostOrder = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
