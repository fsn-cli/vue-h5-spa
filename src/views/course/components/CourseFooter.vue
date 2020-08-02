<template>
  <div class="footerContainer">
    <div v-if="pageLoading" class="emptyBox" />
    <div v-else-if="isOldUser" class="share" @click="handleShare">
      分享海报
      <div v-show="ifShowBanana" class="imgBox">
        <img v-show="ifShowBanana" src="@/assets/images/course/score.png" alt />
      </div>
    </div>
    <div v-else-if="isSoldOut && nextSaleTime" class="out">
      <div class="left">
        <p>已售罄，距离下期还有</p>
        <div>
          <countdown key="3" :type="countType" />
        </div>
      </div>
      <div class="right">
        <a v-if="!subNextState" @click="handleSubscribe('subNextState')"
          >订阅开售提醒</a
        >
        <span v-else>已订阅开售提醒</span>
      </div>
    </div>
    <div v-else-if="isSoldOut && !nextSaleTime" class="soldOut">今日已售罄</div>
    <div v-else-if="!isSelling" class="out">
      <div class="left">
        <p>距离开售还有</p>
        <div>
          <countdown key="1" :type="countType" />
        </div>
      </div>
      <div class="right">
        <a v-if="!subCurrentState" @click="handleSubscribe('subCurrentState')"
          >订阅开售提醒</a
        >
        <span v-else>已订阅开售提醒</span>
      </div>
    </div>
    <div v-else-if="isSelling" class="out">
      <div class="left">
        <p>距离停售还有</p>
        <div>
          <countdown key="2" :type="countType" />
        </div>
      </div>
      <div class="right">
        <a @click="handleOrder()">立即购买</a>
      </div>
    </div>
    <div v-else class="share" @click="handleShare">
      分享海报
      <div v-show="ifShowBanana" class="imgBox">
        <img src="@/assets/images/course/score.png" alt />
      </div>
    </div>

    <bottom-popup ref="popup" :class-type="1" />
    <!-- 端外分享由增长处理 -->
    <!-- <qrcode-popup ref="qrcodePopup" /> -->
    <h5-share ref="h5Share" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Countdown from './CountDown';
import BottomPopup from './BottomPopup';
import QrcodePopup from './QrcodePopup';
import H5Share from './H5Share';
import { appShare } from '@/utils/jsBridge';
import { toLogin } from 'api/login/h5login';
import { subscriber } from 'api/course/';
import { sensorsExperienceBotBtn } from '@/trackPoint/trackPoint';
import {
  POSTER_MATH_IMG_URL,
  POSTER_CH_IMG_URL,
  POSTER_EN_IMG_URL
} from '@/utils/constant';
import { getObjValue } from '@/utils/local';

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
    Countdown,
    BottomPopup,
    QrcodePopup,
    H5Share
  },
  data() {
    return {
      // ifShowSubscrib: true,
      ifShow: false
    };
  },
  props: ['shareLink'],
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
      'nextSaleTime'
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
    /**
     * @description 订阅开售提醒
     * @params {String} type subNextState: 是否已经订阅下一销售期 subCurrentState：是否已经订阅当前期开售提醒
     */
    handleSubscribe(type) {
      if (!this.isLogin) {
        this.hadleGoToLogin();
      } else {
        const platform = localStorage.getItem('platform');
        if (platform === 'ios' || platform === 'android') {
          this.$MkToast({ message: '订阅中..', duration: 0 });
          let sale_time = this.saleTime;
          let period_id = this.coursePeriods;
          if (type === 'subNextState') {
            sale_time = this.nextSaleTime;
            period_id = this.nextCoursePeriods;
          }
          const query = {
            spu_id: this.courseInfo.spu_id,
            sale_time: Math.floor(
              new Date(sale_time.replace(/\-/g, '/')).getTime() / 1000
            ),
            course_type: this.courseInfo.course_type,
            subject_id: this.courseInfo.subject_id,
            period_id
          };
          subscriber(query).then(result => {
            if (!result) return;
            const { code, data } = result;
            if (code === 200) {
              if (type === 'subNextState') {
                data && this.$store.commit('course/SET_NEXT_SUBSTATE', true);
              } else {
                data && this.$store.commit('course/SET_CURRENT_SUBSTATE', true);
              }
              this.$MkToast({ type: 'success', message: '订阅成功' });
            } else {
              this.$MkToast({ type: 'warn', message: result.msg });
            }
          });
        } else {
          // 目前端外不考虑，均由增长测提供
          // this.getH5Qrcode({ sale_time: this.saleTime });
          // this.$refs.qrcodePopup.show = true;
        }
      }
      // 体验课介绍页_底部按钮-埋点
      this.sensorsExperienceBotBtnHandle('订阅开售提醒');
    },
    // 分享海报
    handleShare() {
      // 体验课介绍页_底部按钮-埋点
      this.sensorsExperienceBotBtnHandle('分享海报');
      if (localStorage.getItem('platform') !== 'h5') {
        const imgMap = new Map([
          [1, POSTER_CH_IMG_URL],
          [2, POSTER_MATH_IMG_URL],
          [3, POSTER_EN_IMG_URL]
        ]);
        const inviteDescMap = new Map([
          [1, '孩子很喜欢小猴语文，我也邀请你一起学'],
          [2, '孩子很喜欢小猴思维，我也邀请你一起学'],
          [3, '孩子很喜欢小猴英语，我也邀请你一起学']
        ]);
        const colorMap = new Map([
          [1, '#FF8A66'],
          [2, '#539AFA'],
          [1, '#FF9A29']
        ]);
        const option = {
          pageId: 'experienceClass',
          data: [
            {
              subject: this.courseInfo.subject_id,
              img: imgMap.get(Number(this.courseInfo.subject_id)),
              inviteDesc: inviteDescMap.get(Number(this.courseInfo.subject_id)),
              qrcode: this.shareLink,
              price: this.courseInfo.card_price,
              originPrice: this.courseInfo.card_promotion_price,
              incentive: '打卡4天，返券49元',
              isShowPoster: '1',
              color: colorMap.get(Number(this.courseInfo.subject_id)),
              isAddCredits: this.ifShowBanana ? '1' : '0',
              credits: '5',
              course_startdate: this.courseStartDate,
              course_periods: this.coursePeriods,
              course_type: this.courseInfo.course_type,
              course_id: this.courseInfo.spu_id,
              callback: () => {
                this.$store.commit('course/SET_IFSHOWBANANA', false);
              }
            }
          ]
        };
        appShare(option);
      } else {
        // TODO h5分享
        this.$refs.h5Share.show = true;
      }
    },
    // *点击立即购买
    handleOrder() {
      // this.$refs.popup.ifShow = true;
      if (!this.isLogin) {
        this.hadleGoToLogin();
      } else {
        // 处理微信环境下可能没有openId的问题
        let loginStatus;
        if (
          localStorage.getItem('platform') === 'ios' ||
          localStorage.getItem('platform') === 'android'
        ) {
          loginStatus = !!localStorage.getItem('token');
        } else {
          loginStatus =
            !!localStorage.getItem('token') &&
            !!localStorage.getItem('mathOpenId') &&
            localStorage.getItem('mathOpenId') !== 'undefined';
        }
        !loginStatus && this.hadleGoToLogin();
        this.$refs.popup.ifShow = true;
      }
      // 体验课介绍页_底部按钮-埋点
      this.sensorsExperienceBotBtnHandle('立即购买');
    },
    // 体验课介绍页_底部按钮埋点
    sensorsExperienceBotBtnHandle(buttonType) {
      // 体验课介绍页_底部按钮
      try {
        sensorsExperienceBotBtn({
          stu_id: localStorage.getItem('userId') || '',
          purchase_status: this.courseInfo.purchase_status,
          subject: this.subject,
          course_periods: this.coursePeriods,
          course_startdate: this.courseStartDate,
          button_type: buttonType
        });
      } catch (e) {}
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
  .share {
    width: 460px;
    height: 90px;
    margin: 0 auto;
    background: #45a6ff;
    border-radius: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    color: #fff;
    .imgBox {
      width: 105px;
      height: 42px;
      padding-left: 20px;
      img {
        display: flex;
        width: 100%;
        height: 100%;
      }
    }
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
    font-size: 36px;
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
