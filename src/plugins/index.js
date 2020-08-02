import Vue from 'vue';
import format from 'date-fns/format';
import { Toast, Lazyload, Button, Image } from 'vant';
import * as filters from '@/utils/filters';

import Loading from '@/components/global/loading/loading.vue';

Vue.component('loading', Loading);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.prototype.$formatTime = function (value, pattern) {
  if (!value) return;
  value = value.replace(/-/g, '/');
  return format(new Date(value), pattern);
};

const plugins = [Lazyload, Toast, Button, Image];
plugins.forEach(item => {
  Vue.use(item);
});
