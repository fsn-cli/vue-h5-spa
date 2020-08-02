<template>
  <transition name="mk-loading">
    <div>
      <div
        class="mk-loading"
        v-show="isShow"
      >
        <mk-icon icon='loading'></mk-icon>
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
  name: 'MkLoading',
  customType: 'add',
  data () {
    return {
      isShow: false,
    };
  },
  components: {
    MkIcon,
  },
  props: {
    message: {
      type: String,
      default: '',
    },
    forbidClick: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
  },
  methods: {
    addMethod (Vue, component) {
      const CustomConstructor = Vue.extend(component);
      const instance = new CustomConstructor();

      instance.$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);

      Vue.prototype.$MkLoading = {
        show: (params) => {
          if (typeof params === 'string') {
            instance.message = params || '';
            instance.isShow = true;
          } else {
            const { message, forbidClick } = params;

            instance.message = message || '';
            instance.isShow = true;
            instance.forbidClick = forbidClick || false;
          }
        },
        hide: () => {
          instance.isShow = false;
          instance.forbidClick = false;
        },
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

.mk-loading {
  position: fixed;
  z-index: 9999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;
  width: 180px;
  height: 180px;
  font-size: 26px;
  color: var(--white-color);
  background: rgba(0, 0, 0, .5);
  border-radius: 30px;
  -webkit-appearance: none;
  .mk-icon{
    animation: rotate 1s linear infinite;
  }
  p {
    margin-top: 10px;
    line-height: 37px;
  }
}

@keyframes rotate {
  0%{
    transform: rotateZ(0deg);
  }
  100%{
    transform: rotateZ(360deg);
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
