<template>
  <transition name="mk-toast">
    <div>
      <div
        :class="['mk-toast', 'mk-toast--' + type]"
        v-show="isShow"
      >
        <div class="mk-toast__icon">
          <span class="mk-toast__icon-coin" v-if="coin">+{{coin}}</span>
          <mk-icon v-if="type" :icon='type'></mk-icon>
        </div>
        <p v-if="message">{{ message }}</p>
      </div>
      <div
        v-show="forbidClick"
        class="loading-mask-wrapper"
        @touchmove="touchmove"
      >
      </div>
    </div>

  </transition>
</template>

<script>
import MkIcon from './MkIcon';

export default {
  name: 'MkToast',
  customType: 'add', // 用来标记此组件注册时 需要 给Vue函数添加原型属性
  data () {
    return {
      isShow: false,
    };
  },
  components: {
    MkIcon,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    coin: {
      type: Number,
      default: 0,
    },
    forbidClick: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
  },
  methods: {
    // 给Vue函数添加原型属性 具体方法实现，类似this.$toast
    addMethod (Vue, component) {
      const CustomConstructor = Vue.extend(component);
      const instance = new CustomConstructor();

      instance.$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);

      Vue.prototype.$MkToast = (params) => {
        let duration = 2000;
        if (typeof params === 'string') {
          instance.message = params;
          instance.type = '';
          instance.coin = 0;
        } else {
          const {
            message, type, coin, forbidClick,
          } = params;
          duration = params.duration || duration;
          instance.message = message;
          instance.type = type;
          instance.coin = coin;
          instance.forbidClick = forbidClick;
        }
        instance.isShow = true;

        clearTimeout(instance.timer);

        instance.timer = setTimeout(() => {
          instance.isShow = false;
          instance.forbidClick = false;
        }, duration);
      };
    },
    // 阻止遮罩层的冒泡和默认事件
    touchmove (e) {
      e.stopPropagation();
      e.preventDefault();
    },
  },
};
</script>

<style lang="less" scoped>

.mk-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);

  box-sizing: border-box;
  padding: 40px;
  min-width: 260px;
  font-size: 26px;
  text-align: center;
  color: var(--white-color);
  background: rgba(0, 0, 0, .7);
  border-radius: 30px;
  -webkit-appearance: none;
  p {
    line-height: 37px;
  }
  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    color: #fff09e;
  }
  &__icon-coin {
    margin-right: 10px;
    font-size: 32px;
    font-family: PingFangSC-Regular,PingFang SC;
  }
  &__icon,
  &--fail,
  &--success {
    .mk-icon{
      width: 42px;
      height: 42px;
    }
  }
  &--identify-code {
    height: 179px;
    .mk-icon{
      margin-bottom: 18px;
    }
  }
}
.loading-mask-wrapper{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 9999;
}
</style>
