<template>
  <div class="mk-button-wrapper">
    <button
      :class="classes"
      @click="onClick"
    >
      <mk-icon v-if="icon" :icon="icon"></mk-icon>
      <span v-if="this.$slots.default"><slot></slot></span>
    </button>
  </div>
</template>

<script>
import { oneOf } from '../utils/assist';
import MkIcon from './MkIcon';

const prefixCls = 'mk-button';

export default {
  name: 'MkButton',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    safeArea: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      validator(value) {
        return oneOf(value, ['mini', 'small300', 'small460', 'normal', 'large']);
      },
      default: 'normal',
    },
    plain: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  components: {
    MkIcon
  },
  computed: {
    classes() {
      const buttonArr = [`${prefixCls}`,
        `${prefixCls}--${this.type}`,
        {
          [`${prefixCls}--plain`]: this.plain,
          [`${prefixCls}--${this.size}`]: this.size,
        }];
      // 适配iphonex
      if (this.safeArea) {
        buttonArr.push(`${prefixCls}--safe-${this.safeArea}`);
      }
      return buttonArr;
    },
  },
  methods: {
    onClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>


<style lang="less" scoped>
@import '../styles/button.reset.css';

.mk-button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 460px;
  height: 90px;
  font-size: 34px;
  border-radius: 999px;
  -webkit-appearance: none;
  margin: 0 auto;

  // 按钮类型
  &--default {
    color: var(--white-color);
    background-color: var(--main-color);
  }

  &--disabled {
    color: var(--sub-black);
    background-color: var(--sepline-color);
    cursor: not-allowed;
  }

  // 按钮大小
  &--mini {
    width: 240px;
    height: 66px;
    font-size: 24px;
  }

  &--small300 {
    width: 300px;
  }

  &--small460 {
    width: 460px;
  }

  &--normal {
    width: 590px;
    height: 100px;
  }

  &--large {
    width: 670px;
    height: 100px;
  }

  //朴素按钮
  &--plain {
    width: 220px;
    height: 70px;
    font-size: 26px;
    font-family: PingFangSC-Regular,PingFang SC;
    color: var(--main-color);
    background-color: var(--white-color);
    border: 1px solid var(--main-color);
  }

  &--safe-bottom {
    margin-bottom: env(safe-area-inset-bottom);
    margin-bottom: constant(safe-area-inset-bottom);
  }

  .mk-icon{
    width: 29px;
    height: 29px;
    margin-right: 8px;
  }
}
</style>
