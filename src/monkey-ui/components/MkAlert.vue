<template>
  <transition name="mk-alert__fade">
    <div
      v-if="alertShow"
      class="mk-alert"
    >
    <div class="mk-alert__title">{{ title }}</div>
    <div class="mk-alert__outer">
      <div class="mk-alert__content">{{ content }}</div>
    </div>
      <slot>
      </slot>
      <button v-if="isSingle" class="mk-alert--single" @click="close">{{ buttonMessage.agree || '关闭' }}</button>
      <div v-if="!isSingle" class="mk-alert--double">
        <button class="mk-alert__disagree" @click="disagree">{{ buttonMessage.disagree || '不同意' }}</button>
        <button class="mk-alert__agree" @click="agree">{{ buttonMessage.agree || '同意' }}</button>
      </div>
    </div>
  </transition>
</template>
<script>

export default {
  name: 'MkAlert',
  customType: 'add',
  data() {
    return {
      resolve: '',
      reject: '',
      promise: '', // 保存promise对象

    };
  },
  model: {
    event: 'close',
    prop: 'alertShow',
  },
  props: {
    title: {
      type: String,
      default: 'normal',
    },
    content: {
      type: String,
      default: 'normal',
    },
    alertShow: {
      type: Boolean,
      default: false,
    },
    isSingle: {
      type: Boolean,
      default: true,
    },
    buttonMessage: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    close() {
      this.resolve('close');
      this.alertShow = false;
    },
    agree() {
      this.resolve('agree');
      this.alertShow = false;
    },
    disagree() {
      this.alertShow = false;
      this.reject('disagree');
    },
    addMethod(Vue, component) {
      const CustomConstructor = Vue.extend(component);
      const instance = new CustomConstructor();

      instance.$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);

      Vue.prototype.$MkAlert = (params) => {
        const {
          title, content, buttonMessage, isSingle,
        } = params;
        instance.title = title;
        instance.content = content;
        instance.isSingle = isSingle;
        instance.buttonMessage = buttonMessage || {};
        instance.alertShow = true;
        instance.promise = new Promise((resolve, reject) => {
          instance.resolve = resolve;
          instance.reject = reject;
        });
        return instance.promise;
      };
    },
  },
};
</script>

<style lang="less" scoped>
.mk-alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  box-sizing: border-box;
  font-size: 16px;
  overflow: hidden;
  font-family:PingFangSC-Regular,PingFang SC;
  width:500px;
  // height: 357px;
  height: fit-content;
  display: block;
  border-radius:30px;
  text-align: center;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 10px 0px rgba(0,0,0,0.05);
  &__title {
    height: 45px;
    margin: 50px 0 9px 0;
    font-size:32px;
    font-weight:600;
    color:rgba(34,34,34,1);
    line-height:45px;
    font-family:PingFangSC-Semibold,PingFang SC;
  }
  &__outer {
    max-height: 400px;
    overflow: hidden;
    overflow-y:scroll;
    .mk-alert__content {
      width: 416px;
      text-align:justify;
      margin: auto;
      margin-bottom: 40px;
      font-size:26px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:40px;
    }
  }
  &--single,&--double {
    width: 100%;
    height:89px;
    font-size:32px;
    font-weight:400;
    background:rgba(255,255,255,1);
    color:rgba(69,166,255,1);
    line-height:89px;
    margin-top: 4px;
    .mk-alert__disagree,.mk-alert__agree{
      font-size:32px;
      background: #fff;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      line-height:45px;
      width: 100%;
      color:rgba(69,166,255,1);
      display: inline-block;
    }
    .mk-alert__disagree{
      color:rgba(51,51,51,1);
      border-right: 1px solid #CCC;
    }
  }
  &--double {
    border-top: 0.5px solid #CCC;
    padding-top: 2px;
    margin-top: 28px;
    display: flex;
    flex-wrap: nowrap;
  }
}
.mk-alert__fade-enter{
  opacity: 0;
}
.mk-alert__fade-enter-to{
  opacity: 1;
}
.mk-alert__fade-leave{
  opacity: 1;
}
.mk-alert__fade-leave-to{
  opacity: 0;
}
.mk-alert__fade-enter-active{
  transition: all .2s;
}
.mk-alert__fade-leave-active{
  transition: all .2s;
}
</style>
