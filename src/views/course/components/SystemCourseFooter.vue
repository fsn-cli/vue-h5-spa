<template>
  <div class="footerContainer">
    <div v-if="pageLoading" class="emptyBox" />
    <div v-else-if="isSoldOut && nextSaleTime" class="out">
      <div class="left">
        <p>已售罄，距离下期还有</p>
        <div>
          <countdown key="3" :type="countType" />
        </div>
      </div>
      <div class="right">
        <a v-if="!subNextState" @click="handleSubscribe">订阅开售提醒</a>
        <span v-else>已订阅开售提醒</span>
      </div>
    </div>
    <div v-else-if="isSoldOut && !nextSaleTime" class="soldOut">今日已售罄</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Countdown from './CountDown';
import { toLogin } from 'api/login/h5login';
import { subscriber } from 'api/course/';
import { sensorsSystemClassBotBtn } from '@/trackPoint/trackPoint';

// import format from 'date-fns/format';

export default {
  /**
        @isLogin boolean 是否登录
        @isSoldOut boolean 是否售罄
        @isSelling boolean 是否开售,可能用getter从课程详情中获取
        @ifShowSubscrib boolean 是否展示订阅按钮
        @isOldUser boolean 是否买过该课程
        @ifShowScore boolean 是否展示增加积分的图片
  **/
  components: {
    Countdown
  },
  data() {
    return {
      // ifShowSubscrib: true,
      ifShow: false
    };
  },
  computed: {
    ...mapState('course', [
      'courseInfo',
      'isLogin',
      'isSoldOut',
      'isSelling',
      'isOldUser',
      'pageLoading',
      'isInSell',
      'ifShowBanana',
      'subCurrentState',
      'subNextState',
      'countType',
      'saleTime',
      'nextSaleTime',
      'buttonType'
    ]),
    ...mapGetters('course', [
      'courseType',
      'subject',
      'coursePeriods',
      'nextCoursePeriods',
      'courseStartDate'
    ])
  },
  mounted() {
    let orignalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, newValue) {
      let setItemEvent = new Event('setItemEvent');
      setItemEvent.key = key;
      orignalSetItem.apply(this, arguments);
      window.dispatchEvent(setItemEvent);
    };
    window.addEventListener('setItemEvent', e => {
      if (e.key === 'token') {
        this.$store.commit('course/SET_LOGIN_STATUS', true);
      }
    });
  },

  methods: {
    // TODO点击订阅开售提醒
    handleSubscribe() {
      if (!this.isLogin) {
        this.hadleGoToLogin();
      } else {
        const platform = localStorage.getItem('platform');
        if (platform === 'ios' || platform === 'android') {
          // 埋点相关
          // 底部按钮埋点
          sensorsSystemClassBotBtn({
            purchase_status: this.courseInfo.purchase_status,
            subject: this.subject,
            course_periods: this.coursePeriods,
            course_startdate: this.courseStartDate,
            button_type: this.buttonType
          });
          this.$MkToast({ message: '订阅中..', duration: 0 });
          const query = {
            spu_id: this.courseInfo.spu_id,
            sale_time: Math.floor(
              new Date(this.nextSaleTime.replace(/\-/g, '/')).getTime() / 1000
            ),
            course_type: this.courseInfo.course_type,
            subject_id: this.courseInfo.subject_id,
            period_id: this.nextCoursePeriods
          };
          subscriber(query).then(result => {
            if (!result) return;
            const { code, data } = result;
            if (code === 200) {
              data && this.$store.commit('course/SET_NEXT_SUBSTATE', true);
              this.$MkToast({ type: 'success', message: '订阅成功' });
            } else {
              this.$MkToast({ type: 'warn', message: result.msg });
            }
          });
        } else {
          // 目前端外不考虑，均由增长测做
          // this.getH5Qrcode({ sale_time: this.saleTime });
          // this.$refs.qrcodePopup.show = true;
        }
      }
    },
    // *根据平台去登录页面
    hadleGoToLogin() {
      toLogin();
    },
    ...mapActions('course', [
      'checkIsSoldOut',
      'getAppStatus',
      'checkOldUser',
      'getCourse'
    ])
  }
};
</script>

<style lang="less" scoped>
.footerContainer {
  display: flex;
  height: 100%;
  align-items: center;
  .soldOut {
    width: 670px;
    height: 90px;
    margin: 0 auto;
    background-color: #eaeaea;
    line-height: 90px;
    text-align: center;
    font-size: 34px;
    color: #999;
    border-radius: 45px;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .out {
    display: flex;
    justify-content: space-between;
    width: 670px;
    margin: 0 auto;
    p {
      //width: 144px;
      height: 33px;
      font-size: 24px;
      font-weight: 600;
      color: rgba(34, 34, 34, 1);
      line-height: 33px;
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 15px;
  }
  .right {
    width: 300px;
    height: 100px;
    font-size: 34px;
    a {
      font-weight: 400;
      color: #fff;
      background: #ff8a66;
      border-color: #ff8a66;
      border-radius: 999px;
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
    span {
      display: flex;
      height: 100%;
      color: #ff6c48;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
