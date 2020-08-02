<template>
  <transition name="mk-top-tip-fade">
    <div
      class="mk-top-tip"
      v-show="isShow"
    >
      <div class="mk-top-tip__content">
        <div class="mk-top-tip__icon" />
        <div class="mk-top-tip__message">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'MkTopTip',
  customType: 'add',
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (window.history && window.history.pushState) {
      // history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.listenBack, false);
    }
  },
  methods: {
    addMethod(Vue, component) {
      const CustomConstructor = Vue.extend(component);
      const instance = new CustomConstructor();

      instance.$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);

      Vue.prototype.$topTip = {
        show: (params) => {
          instance.message = params.message || '';
          instance.isShow = true;
        },
        hide: () => {
          instance.isShow = false;
        },
      };
    },
    listenBack() {
      if (true) { // 必须有，否则可能无法关闭
        console.log(11111);
        this.isShow = false;
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.isShow = false;
    window.removeEventListener('popstate', this.listenBack, false);
    next();
  },
};
</script>


<style lang="less" scoped>
.mk-top-tip{
  .mk-top-tip__content {
    position: fixed;
    top: 0;
    width: 100%;
    min-height:80px;
    height: fit-content;
    background:rgba(255,108,72,0.04);
    .mk-top-tip__icon{
      width: 28px;
      height: 28px;
      background-size: 100% 100%;
      position: absolute;
      top: 26px;
      left: 39px;
      background-image: url('../assets/topTip/mk-top-tip__icon.png');
    }
    .mk-top-tip__message {
      font-size:24px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      margin: 22px 9px 22px 9px;
      text-indent: 64px;
      color:rgba(255,108,72,1);
      line-height:36px;
    }
  }
}
.mk-top-tip-fade-enter{
  opacity: 0;
}
.mk-top-tip-fade-enter-to{
  opacity: 1;
}
.mk-top-tip-fade-leave{
  opacity: 1;
}
.mk-top-tip-fade-leave-to{
  opacity: 0;
}
.mk-top-tip-fade-enter-active{
  transition: all .2s;
}
.mk-top-tip-fade-leave-active{
  transition: all .2s;
}
</style>
