<template>
  <div
    class="login-input"
    :class="[{active: isActive}]"
  >
    <!-- 输入框 -->
    <div
      class="inputWrap"
      :class="{inputCaptcha: formType === CAPTCHA}"
    >
      <input
        ref="input"
        v-model="showValue"
        type="tel"
        :placeholder="placeholder"
        :maxlength="getMaxLength"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      >
    </div>
    <!-- 控制框 -->
    <div class="controlWrap">
      <!-- 删除 -->
      <div
        v-show="closeShow"
        class="close-btn"
        @touchstart.prevent="onClearClick"
      >
        <div class="close">
          <div class="close-img">
            <i />
          </div>
        </div>
      </div>

      <!-- 获取验证码 -->
      <div
        v-if="formType === CAPTCHA"
        class="captcha"
      >
        <div
          v-show="!isActive || !showValue"
          class="capchaWrap"
        >
          <div
            v-show="!isTimerStart"
            class="captcha-btn"
            @touchstart.stop.prevent="onCaptchaClick"
          >
            <button>{{ isFirstGetCaptcha ? '获取验证码' : '重新获取' }}</button>
          </div>
          <div
            v-show="isTimerStart"
            class="captcha-seconds"
          >
            <span class="text">{{ timerTxt }}s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const PHONE = 'phone';
const CAPTCHA = 'captcha';
export default {
  props: {
    // 表单类型
    // 确定手机输入框、验证码框
    // 值可选：phone、captcha
    formType: {
      type: String,
      required: true,
      validator (value) {
        return [PHONE, CAPTCHA].indexOf(value) !== -1;
      },
    },

    maxLength: {
      type: Number,
      default: 11,
    },

    placeholder: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      PHONE,
      CAPTCHA,
      isActive: false,
      showValue: '',
      originValue: '',
      timer: null,
      timerTxt: 60,
      isTimerStart: false,
      isFirstGetCaptcha: true,
    };
  },

  computed: {
    getMaxLength () {
      if (this.formType === PHONE) {
        return this.maxLength + 2;
      } else {
        return 7;
      }
    },

    closeShow () {
      return this.isActive && this.showValue;
    },
  },

  watch: {},

  destroyed () {
    clearInterval(this.timer);
  },

  methods: {
    onInput () {
      this.showValue = this.formatInputContent(this.showValue);
      this.originValue = this.showValue.replace(/\s/g, '');
      this.$emit('input', this.originValue);
    },

    onFocus () {
      if (this.isActive) return;
      this.isActive = true;
    },

    onBlur () {
      this.isActive = false;
    },

    formatInputContent (value) {
      if (this.formType === PHONE) {
        value = value.replace(/^([023456789])|([^\d])/g, '');
      } else {
        value = value.replace(/[^\d]/g, '');
      }

      const len = value.length;
      let format = [];

      len > 3 && format.push(3);

      if (this.formType === PHONE) {
        len > 7 && format.push(8);
      }

      let valArr = value.split('');
      for (let i = 0; i < format.length; i++) {
        const spliceIndex = format[i];
        valArr[spliceIndex] && valArr.splice(spliceIndex, 0, ' ');
      }
      return valArr.join('');
    },

    onClearClick () {
      if (this.showValue === '') return;
      this.showValue = '';
      this.onInput();
      this.$refs.input.focus();
    },

    onCaptchaClick () {
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        this.$MkToast('请输入正确的手机号');
        return;
      }

      this.$emit('captcha');

      // 开启定时器
      clearInterval(this.timer);
      this.isTimerStart = true;
      this.isFirstGetCaptcha = false;
      this.timer = setInterval(() => {
        this.timerTxt -= 1;
        if (this.timerTxt === 0) {
          clearInterval(this.timer);
          this.isTimerStart = false;
          this.timerTxt = 60;
        }
      }, 1000);
    },

    focus () {
      if (this.isActive) return;
      this.isActive = true;
      this.$refs.input.focus();
    },
  },
};
</script>

<style lang="less" scoped>
@leftWidth: 80px;

.login-input {
  position: relative;
  padding-left: @leftWidth;
  height: 140px;
  transition: all 0.3s;

  & + & {
    // border-top: 1px solid #d9d9d9;
    // border-bottom: 1px solid #d9d9d9;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 200%;
      border-top: 1px solid #d9d9d9;
      transform: scale(0.5);
      transform-origin: 0 0;
    }

    &::after {
      top: 100%;
    }
  }

  &.active + & {
    // border-top-color: transparent;
    &::before {
      display: none;
    }
  }

  &.active {
    border-color: transparent;
    box-shadow: 2px 4px 30px #d0cbcb;

    &::before,
    &::after {
      display: none;
    }
  }

  .inputWrap {
    float: left;
    display: flex;
    align-items: center;
    height: 100%;
    width: 65%;
    input {
      display: block;
      width: 100%;
      font-size: 66px;
      line-height: 66px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      padding-top: 20px;
      &::placeholder {
        vertical-align: middle;
        font-weight: normal !important;
        line-height: 66px !important;
        font-size: 28px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  .controlWrap {
    position: relative;
    float: left;
    width: 35%;
    height: 100%;

    .close-btn {
      padding-right: 40px;
      width: 100%;
      height: 100%;

      .close {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
      }

      .close-img {
        width: 36px;
        height: 36px;

        i {
          display: block;
          width: 100%;
          height: 100%;
          background: url(~images/login/del-icon@2x.png);
          background-size: 100% 100%;
        }
      }
    }

    .captcha {
      height: 100%;

      .capchaWrap {
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
        width: 100%;
        height: 100%;
      }

      .captcha-btn {
        display: flex;
        align-items: center;
        height: 100%;
        button {
          height: 40px;
          border: none;
          background: transparent;
          -webkit-appearance: none;
          font-size: 28px;
          font-weight: 600;
          line-height: 40px;
          color: rgba(34, 34, 34, 1);
          cursor: pointer;
        }
      }

      .captcha-seconds {
        display: flex;
        align-items: center;
        height: 100%;
        padding-right: 20px;
        padding-top: 10px;
        .text {
          font-size: 32px;
          font-weight: bold;
          color: rgba(255, 132, 67, 1);
          line-height: 40px;
        }
      }
    }
  }
}
</style>
