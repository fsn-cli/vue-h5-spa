import Vue from 'vue';

export const loading = {
  show () {
    // 加载中显示loading组件
    new Vue().$MkLoading.show({
      forbidClick: true,
    });
  },
  hide () {
    new Vue().$MkLoading.hide();
  },
};
