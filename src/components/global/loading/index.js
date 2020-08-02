/**
 * @desc a toast plugin for mobile
 */
import ToastComponent from '@/components/global/loading/loading.vue';
import Vue from 'vue';

const ToastController = Vue.extend(ToastComponent);
let instance = new ToastController().$mount(document.createElement('div'));
const Loading = {
  show (opt) {
    const defaultOption = {
      type: 'fading-circle',
    };
    let option;
    if (typeof opt === 'string') {
      defaultOption.msg = opt;
      defaultOption.type = 'snake';
      option = {};
    } else {
      option = opt;
    }
    option = {
      ...defaultOption,
      ...option,
    };

    instance.msg = option.msg;
    instance.type = option.type;
    document.body.appendChild(instance.$el);
  },
  close () {
    try {
      document.body.removeChild(instance.$el);
    } catch (e) {}
  },
};

export default Loading;
