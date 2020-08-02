<template>
  <div class="login">
    <div class="main">
      <div class="logo">
        <div class="logo-img">
          <img src="~images/login/login-logo@2x.png" alt="logo" />
        </div>
      </div>

      <div class="welcome">
        <h1>欢迎你，</h1>
        <div>继续登录</div>
      </div>

      <div class="form">
        <login-form />
      </div>

      <!-- 滑块配置 -->
      <div id="captcha" />
    </div>

    <div class="footer">
      继续代表您已同意
      <span @click="goRegister">用户注册协议</span>和
      <span @click="goPrivacy">用户隐私协议</span>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm';
import { getWxAuth } from '@/utils';
import { loginPageShow } from '@/trackPoint/trackPointLogin';

export default {
  name: 'Login',
  components: {
    LoginForm,
  },

  data () {
    return {
      customHeight: '',
    };
  },

  created () {
    // 判断路径中auth参数是否存在
    this.auth = this.$route.query.auth;

    // if (!this.auth) {
    //   getWxAuth();
    //   return;
    // }

    this.handleFocusOut();
  },

  mounted () {
    this.customHeight = document.documentElement.clientHeight;
    // 无痕滑块配置-必须
    window.TAL_UC.configNVC({
      renderToEle: '#captcha',
      isH5: true,
    });

    let previousSourcesess = '';
    if (/experienceClass/ig.test(sessionStorage.getItem('fromWhere'))) {
      previousSourcesess = '体验课课程介绍页';
    } else if (/systemClass/ig.test(sessionStorage.getItem('fromWhere'))) {
      previousSourcesess = '系统课课程介绍页';
    }
    loginPageShow({
      previous_source: previousSourcesess,
    });
  },

  beforeDestroy () {
    this.handleRemoveFocusOut();
  },

  methods: {
    goRegister () {
      this.$router.push('/personal/agreement/register?platform=login');
    },

    goPrivacy () {
      this.$router.push("/personal/agreement/privacy?platform='login'");
    },

    focusOutHandler () {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        window.scroll(0, 0);
        document.body.style.height = '';
      }, 16);
    },

    focusInHandler () {
      const clientHeight = this.customHeight;
      clearTimeout(this.timer);
      document.body.style.height = clientHeight + 'px';
    },

    handleFocusOut () {
      // input失去焦点后，ios键盘收起，但没有触发 window resize，导致实际页面dom仍然被解盘顶上去
      document.addEventListener('focusout', this.focusOutHandler);

      document.addEventListener('focusin', this.focusInHandler);
    },

    handleRemoveFocusOut () {
      document.removeEventListener('focusout', this.focusOutHandler);

      document.removeEventListener('focusin', this.focusInHandler);
    },

    handleResize () {
      const clientHeight = this.customHeight;
      window.addEventListener('resize', () => {
        // 判断当前 active 的元素是否为 input 或 textarea
        if (
          document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA'
        ) {
          setTimeout(() => {
            // 原生方法，滚动至需要显示的位置
            document.activeElement.scrollIntoView();
          }, 0);
        }

        // 解决解盘弹起后 fixed 定位元素被顶起问题
        const bodyHeight = this.customHeight;
        const ele = document.getElementById('fixed-bottom');

        if (ele) {
          if (clientHeight > bodyHeight) {
            ele.style.display = 'none';
          } else {
            ele.style.display = 'block';
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  user-select: none;
  overflow: hidden;

  .main {
    position: relative;
    flex: 1;

    .logo {
      padding-top: 80px;
      .logo-img {
        margin-left: 80px;
        width: 314px;
        height: 90px;

        img {
          display: block;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      }
    }

    .welcome {
      padding: 60px 0 40px 80px;
      // margin: 80px 0 100px 80px;

      h1 {
        font-size: 48px;
        font-weight: 600;
        color: rgba(34, 34, 34, 1);
        line-height: 67px;
      }

      div {
        font-size: 28px;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 40px;
      }
    }

    .form {
      padding-right: 80px;
    }
  }

  .footer {
    padding-bottom: 100px;
    text-align: center;
    font-size: 24px;
    color: rgba(198, 198, 198, 1);
    line-height: 34px;
    text-align: center;

    span {
      color: #333;
    }
  }
}

#captcha {
  margin-top: 30px;
}
</style>
