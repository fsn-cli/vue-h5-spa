<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { sensorsLogin } from '@/trackPoint/trackPoint';

export default {
  data () {
    return {};
  },

  mounted () {
    // 神策登录
    sensorsLogin();
  },
};
</script>

<style lang="less">
@import "./assets/css/base.less";
#app {
  height: 100%;
}
</style>
