const path = require('path');

// 获取所有components/文件夹下的一级目录vue文件
const files = require.context('./components', false, /\.vue$/);
const modules = {};

// 给组件挂载install方法
files.keys().forEach((key) => {
  const name = path.basename(key, '.vue');
  modules[name] = files(key).default || files(key);

  // customType属性作用：用来给组件作标记，需要 给Vue函数添加原型属性 的组件（可参考MkToast.vue文件）
  // 适用场景：不需要在template中写标签的组件, 如toast/loading/alert/confirm
  if (modules[name].customType) {
    modules[name].install = (Vue) => {
      // addMethod方法定义位置：组件的methods中
      // 作用：具体实现 给Vue函数添加原型属性（可参考MkToast.vue文件）
      modules[name].methods.addMethod(Vue, modules[name]);
    };
  } else {
    modules[name].install = (Vue) => {
      Vue.component(modules[name].name, modules[name]);
    };
  }
});

// 初始化全局安装组件的install
function install(Vue) {
  files.keys().forEach((key) => {
    const name = path.basename(key, '.vue');

    // customType属性作用：用来给组件作标记，需要 给Vue函数添加原型属性 的组件（可参考MkToast.vue文件）
    // 适用场景：不需要在template中写标签的组件, 如toast/loading/alert/confirm
    if (modules[name].customType) {
      // addMethod方法定义位置：组件的methods中
      // 作用：具体实现 给Vue函数添加原型属性（可参考MkToast.vue文件）
      modules[name].methods.addMethod(Vue, modules[name]);
    } else {
      Vue.component(modules[name].name, modules[name]);
    }
  });
}

const {
  MkButton, MkToast, MkIcon, MkLogin, MkLoading, MkAlert, MkFooter, MkSwiper, MkLogisticsCard, MkTeacherCard, MkCourseSelect, MkExpress,
} = modules;

// 若要支持按需引入, 需要在此处显式声明
export {
  MkButton,
  MkIcon,
  MkToast,
  MkLogin,
  MkLoading,
  MkAlert,
  MkCourseSelect,
  MkFooter,
  MkSwiper,
  MkLogisticsCard,
  MkTeacherCard,
  MkExpress,
};
// 或者可以通过 import MKUI from '@xes/monkey-ui';
// Vue.use(MKUI) 来全量引入
export default {
  install,
  // ...modules,
};
