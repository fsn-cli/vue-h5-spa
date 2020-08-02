<template>
  <div class="el-input-container">
    <div class="input-wraper mk-border-bottom-1px" :class="{'is-focus': isPhoneNumFocus, 'no-border': isCodeFocus || isPhoneNumFocus}">
      <input v-model="phoneNum" @focus="isPhoneNumFocus = true" @blur="isPhoneNumFocus = false" class="phone-num-inp" type="tel" placeholder="请输入手机号" />
      <img v-show="phoneNum.length" class="phone-num-clear-btn" src="https://activity.xueersi.com/oss/resource/clear-71374.png" alt="" @click="clearPhone">
    </div>
    <div class="input-wraper mk-border-bottom-1px" :class="{'is-focus': isCodeFocus}">
      <input v-model="verifyCode" @focus="isCodeFocus = true" @blur="isCodeFocus = false" class="code-inp" type="tel" placeholder="请输入验证码" />
      <span v-if="countDownNum === -1"
        :class="{'is-active': removeAllSpace(phoneNum).length === 11}"
        @click="getVerifyCode"
        class="get-code">
        获取验证码
      </span>
      <span v-else class="reget-code">重新获取{{ countDownNum }}s</span>
    </div>
  </div>
</template>
<script>
import { removeAllSpace } from '../utils/index';

export default {
  name: 'MkLogin',
  props: {
    phone: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      phoneNum: '',
      verifyCode: '',
      countDownNum: -1,
      timeInter: 0,
      removeAllSpace,
      isPhoneNumFocus: false,
      isCodeFocus: false,
    };
  },
  computed: {
  },
  watch: {
    phone(val) {
      this.phoneNum = val;
    },
    code(val) {
      this.verifyCode = val;
    },
    phoneNum(val, old) {
      if (!/^[0-9 ]{0,13}$/.test(val)) {
        this.phoneNum = old;
      }
      // 输入第3个，且不是删除剩下3个
      if (val.length === 3 && old.length !== 4) {
        this.phoneNum += ' ';
      }
      // 输入第8个，而不是删除剩下8个
      if (val.length === 8 && old.length !== 9) {
        this.phoneNum += ' ';
      }
      // 从4个删除为3个
      if (val.length === 3 && old.length === 4) {
        this.phoneNum = val.substring(0, 2);
      }
      // 从9个删除为8个
      if (val.length === 8 && old.length === 9) {
        this.phoneNum = val.substring(0, 7);
      }
    },
    verifyCode(val, old) {
      if (!/^[0-9]{0,6}$/.test(val)) {
        this.verifyCode = old;
      }
    },
  },
  mounted() {
    this.phoneNum = this.phone;
    this.verifyCode = this.code;
  },
  methods: {
    getVerifyCode() {
      const sendPhoneNum = removeAllSpace(this.phoneNum);
      // 校验手机号
      if (!(/^1\d{10}$/.test(sendPhoneNum))) {
        // this.$mytoast('请输入正确的手机号');
        return;
      }
      this.countDownNum = 60;
      this.timeInter = setInterval(() => {
        this.countDownNum--;
        if (this.countDownNum === -1) {
          clearInterval(this.timeInter);
        }
      }, 1000);
      this.$emit('getVerifyCode', {
        phone: this.phoneNum,
      });
    },
    clearPhone() {
      this.phoneNum = '';
    },
  },
  beforeDestory() {
    clearInterval(this.timeInter);
  },
};
</script>
<style lang="less" scoped>
@import '../styles/input.reset.css';
.el-input-container {
  .input-wraper {
    width: 670px;
    // height: 140px;
    // border-bottom: 1px solid #D9D9D9;
    padding: 40px 0px 34px 80px;
    font-size: 0;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input::-webkit-input-placeholder {
      color: #cccccc;
      font-weight: 500;
      font-size: 28px;
      position: relative;
      top: -15px;
    }
    input {
      height: 66px;
      font-size: 66px;
      line-height: 66px;
    }
    span {
      display: inline-block;
      font-size: 28px;
      white-space:nowrap;
    }
    .phone-num-inp {
      width: 590px;
    }
    .code-inp {
      width: 350px;
    }
    .get-code {
      color: var(--subdesc-color);
    }
    .is-active {
      color: var(--title-color);
    }
    .reget-code {
      color: var(--num-color);
    }
    &.is-focus {
      box-shadow: 0 0 46px rgba(34, 34 , 34, .2);
      border: none;
    }
    &.no-border {
      border: none;
    }
    .phone-num-clear-btn {
      position: absolute;
      z-index: 1;
      width: 38px;
      height: 38px;
      top: 50%;
      right: 29px;
      margin-top: -19px;
    }
  }
}

</style>
