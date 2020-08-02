<template>
  <div class="login-form-wrapper">
    <login-input v-model="phone" form-type="phone" placeholder="请输入手机号" />
    <login-input
      ref="captcha"
      v-model="captcha"
      :phone="phone"
      form-type="captcha"
      placeholder="请输入验证码"
      @captcha="onCaptcha"
    />
  </div>
</template>

<script>
import LoginInput from './LoginInput';
import { getSMSCodeLogin, postUserCenterLoginSms } from '@/utils/passport';
import { getToken } from 'api/login/h5login';
import { sensorsLogin } from '@/trackPoint/trackPoint';
import {
  loginPageVerifyCode,
  loginPageSuccess,
} from '@/trackPoint/trackPointLogin';
import { setCookie, storage, getQueryObj } from '@/utils/tool';

export default {
  components: {
    LoginInput,
  },
  data () {
    return {
      phone: '',
      captcha: '',
    };
  },

  watch: {
    captcha (newVal) {
      if (newVal.length === 6 && this.phone.length === 11) {
        if (!/^1[3456789]\d{9}$/.test(this.phone)) {
          this.$MkToast('请输入正确的手机号');
          return;
        }

        // 登录
        this.login();
      }
    },
  },

  created () {
    this.auth = this.$route.query.auth;
  },

  methods: {
    // 获取验证码
    async onCaptcha () {
      try {
        await getSMSCodeLogin({
          phone: this.phone,
        });
        this.$MkToast('发送成功');
        // 埋点
        loginPageVerifyCode('loginpage_verifycode');
      } catch (error) {
        this.$MkToast(error.errmsg);
      }
    },

    // 登录两步骤
    // 1.集团用户中心短信验证码登录
    // 2.小猴思维后端登录，获取token、openId、用户信息
    async login () {
      let code = '';

      try {
        // 短信验证码登录
        const response = await postUserCenterLoginSms({
          phone: this.phone,
          sms_code: this.captcha,
        });
        code = response.data.code;
      } catch (error) {
        this.$MkToast(error.errmsg);
        return;
      }

      try {
        // eslint-disable-next-line camelcase
        const from_user_id = storage.get('fromWhere')
          ? getQueryObj(storage.get('fromWhere')).fromUser
          : '';
        const from_channel = getQueryObj(
          storage.get('fromWhere')
        ).hasOwnProperty('fromUser')
          ? '老带新'
          : '';
        const response = await getToken({
          code,
          auth: this.auth,
          from_user_id,
          from_channel,
        });

        if (response.code === 200) {
          const { data } = response;
          // 种植cookie
          const COOKIE_TOKEN = 'CUSTOM-TAL-TOKEN';
          const USER_TYPE = 'USER-TYPE';
          setCookie(COOKIE_TOKEN, data.tal_token);
          setCookie(USER_TYPE, data.user_type);
          localStorage.setItem('token', data.tal_token);
          localStorage.setItem('userId', data.user_id);
          localStorage.setItem('platform', 'h5');
          localStorage.setItem('mathOpenId', data.openid);

          sensorsLogin(data.user_id);

          loginPageSuccess({
            stu_id: localStorage.getItem('userId') || '',
            is_fist_regist: data.is_empty_profile,
          });

          // 登录成功之后，使活动元素失去焦点
          document.activeElement.blur && document.activeElement.blur();

          // 返回之前的页面
          const fromWhere = sessionStorage.getItem('fromWhere');
          this.$nextTick(() => {
            (fromWhere && this.$router.replace(fromWhere)) ||
              this.$router.go(-1);
          });
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="less" scoped>
</style>
