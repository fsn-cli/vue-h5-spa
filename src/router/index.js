import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

let routes = [];

const routerContext = require.context('./', true, /index\.js$/);
routerContext.keys().forEach(route => {
  if (route.startsWith('./index')) {
    return;
  }
  const routerModule = routerContext(route);
  /**
   * 兼容 import export 和 requrie module.export 两种规范
   */
  routes = [...routes, ...(routerModule.default || routerModule)];
});

export default new Router({
  mode: 'history',
  base: process.env.VUE_APP_ROUTER_BASE_URL,
  routes: routes,
});
