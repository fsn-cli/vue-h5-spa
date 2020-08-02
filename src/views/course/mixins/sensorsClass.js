import { mapState, mapGetters } from 'vuex';
import { isWeiXin } from '@/utils/platformHelper';
import {
  sensorsExperienceClass,
  sensorsSystemClass,
} from '@/trackPoint/trackPoint';
import { getShareLink } from 'api/course/index';
import { refreshPage } from '@/utils/jsBridge';

export default {
  data() {
    return {
      startTime: new Date().getTime(),
      endTime: '',
      shareLink: '' // 分享得链接，供端外使用
    };
  },
  mounted() {
    // 控制退后台的时机以及刷新时间
    refreshPage({
      refreshType: 2,
      refreshTime: 120000
    })
  },
  computed: {
    ...mapState('course', [
      'courseInfo',
      'activeCard',
      'userGrade',
      'isLogin',
      'isOldUser',
      'subState',
      'hasBuyInfo',
      'userStatus',
      'isSoldOut',
      'pageLoading',
      'isSelling',
      'audioPlay',
      'isCheckOldUser',
      'allSkuInfo',
      'nextSaleTime',
      'subNextState'
    ]),
    ...mapGetters('course', ['courses', 'subject', 'coursePeriods', 'courseStartDate', 'activityInfo']),
    startRunSensors() {
      if (this.isLogin) {
        return this.userStatus && this.isCheckOldUser && this.courseInfo.spu_id;
      } else {
        return this.userStatus && this.courseInfo.spu_id;
      }
    },
    // 用于埋点的按钮状态
    buttonType: function () {
      let buttonType = '';
      if (Number(this.courseInfo.course_type) === 1) {
        if (this.isOldUser) {
          buttonType = '分享海报';
        } else if (this.isSoldOut && this.nextSaleTime) {
          buttonType = '已订阅开售提醒';
          if (!this.subNextState) {
            buttonType = '订阅开售提醒';
          }
        } else if (this.isSoldOut && !this.nextSaleTime) {
          buttonType = '已售罄';
        } else if (!this.isSelling) {
          buttonType = '已订阅开售提醒';
          if (!this.subCurrentState) {
            buttonType = '订阅开售提醒';
          }
        } else if (this.isSelling) {
          buttonType = '立即购买';
        }
      } else {
        if (!this.isSoldOut || (this.isSoldOut && this.isOldUser)) {
          if (this.isOldUser) {
            if (Number(this.courseInfo.use_buy_type) === 2) {
              buttonType = '立即购买';
            } else {
              buttonType = '立即续费';
            }
          } else {
            buttonType = '立即购买';
          }
        } else if (this.isSoldOut && this.nextSaleTime) {
          buttonType = '已订阅开售提醒';
          if (!this.subNextState) {
            buttonType = '订阅开售提醒';
          }
        } else if (this.isSoldOut && !this.nextSaleTime) {
          buttonType = '已售罄';
        }
      }
      this.$store.commit('course/SET_BUTTON_TYPE', buttonType);
      return buttonType;
    }
  },
  watch: {
    startRunSensors(val) {
      // 调用神策方法
      if (val) {
        this.sensorsReportFun();
      }
    },
  },
  methods: {
    sensorsExperienceClass() {
      console.log('-------体验课分享调用时机: ', this.endTime);
      this.endTime = new Date().getTime(); // 调用时获取时间
      sensorsExperienceClass({
        stay_time: (this.endTime - this.startTime) / 1000,
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        banner_type: Number(this.courseInfo.banner_type),
        course_periods: this.coursePeriods,
        course_startdate: this.courseStartDate,
        course_orginalprice: Number(this.courseInfo.card_promotion_price),
        course_saleprice: Number(this.courseInfo.card_price),
        activity_content: this.ctivityInfo.activity_desc,
        activity_link: this.activityInfo.activity_url,
        button_type: this.buttonType,
        video_paly: this.audioPlay,
        is_bottoming: localStorage.getItem('is_bottoming_experience') || false,
        is_activity_click: this.courseInfo.isActivityClick ? 1 : 0, //是否点击活动位
        channel_source: isWeiXin() ? '微信' : 'APP',
      });
    },
    sensorsSystemClass() {
      this.endTime = new Date().getTime(); // 调用时获取时间
      console.log('-------系统课分享调用时机: ', this.endTime);
      sensorsSystemClass({
        stay_time: (this.endTime - this.startTime) / 1000,
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        banner_type: Number(this.courseInfo.banner_type),
        course_periods: this.coursePeriods,
        course_startdate: this.courseStartDate,
        course_orginalprice: Number(this.courseInfo.card_promotion_price),
        course_saleprice: Number(this.courseInfo.card_price),
        activity_content: this.activityInfo.activity_desc,
        activity_link: this.activityInfo.activity_url,
        button_type: this.buttonType,
        video_paly: this.audioPlay,
        is_bottoming: localStorage.getItem('is_bottoming_experience') || false,
        is_activity_click: this.courseInfo.isActivityClick ? 1 : 0, //是否点击活动位
        channel_source: isWeiXin() ? '微信' : 'APP',
      });
    },
    /**
     * @description 获取分享到端外得链接
     */
    async getShareLinkHandle() {
      const res = await getShareLink({
        stuID: Number(localStorage.getItem('userId')) ? Number(localStorage.getItem('userId')) : 0,
        sourceId: Number(localStorage.getItem('sourceId')),
        sourceType: Number(localStorage.getItem('sourceType')),
        subject: this.courseInfo.subject_id,
        courseType: this.courseInfo.course_type
      })
      return res;
    }
  },

};
