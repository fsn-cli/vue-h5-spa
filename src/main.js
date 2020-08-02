import Vue from 'vue';
import App from './App.vue';
import './plugins/mkBridge';
import router from './router';
import store from './store';
import '@/sdk/arms';
import '@/sdk/sensors';
import mixins from '@/mixins/global';
import './plugins';
import './router/permission';

import { MkToast, MkLoading } from './monkey-ui';
import './monkey-ui/theme/default/index.css';

Vue.use(MkToast).use(MkLoading);

// window.TAL_UC.rankConfig({
//   'client-id': process.env.VUE_APP_PASSPORT_CLIENT_ID, // client-id由平台发放权限码，接入之前向平台申请
// });

Vue.config.productionTip = false;

new Vue({
  router,
  mixins: [mixins],
  store,
  render: h => h(App),
}).$mount('#app');
