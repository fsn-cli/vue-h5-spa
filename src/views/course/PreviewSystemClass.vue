<template>
  <div class="container">
    <skeleton v-show="!courseInfo.spu_id" />
    <div
      v-show="courseInfo.spu_id"
      ref="content"
      class="content"
      @scroll="handleScroll"
    >
      <!-- 课程详情锚点 -->
      <top-bar
        ref="topBar"
        :moduleList="moduleList"
        :isShow="isTopBarShow"
        @clickPoint="clickPoint"
      />
      <!-- 课程头部信息 -->
      <course-top ref="courseTop" />
      <!-- 课程详情模块 -->
      <course-detail
        :moduleList="moduleList"
        @changeModuleList="changeModuleList"
      />
    </div>
    <!-- 老用户中在读续费时显示立即续费，结课重构显示立即购买 -->
    <!-- <div v-show="courseInfo.spu_id" class="footer">
      <van-button
        v-if="(userStatus && !isSoldOut) || (isSoldOut && isOldUser)"
        round
        class="bigBtn"
        @click="handleBuyCourse"
        >{{
          isOldUser
            ? Number(courseInfo.use_buy_type) === 2
              ? '立即购买'
              : '立即续费'
            : '立即购买'
        }}</van-button
      >
      <course-footer v-else />
      <bottom-popup ref="popup" :class-type="2" />
      <finished-all
        :isShow="openFinishedAll"
        @closeFinishedAll="closeFinishedAll"
      />
    </div> -->
  </div>
</template>

<script>
import courseTop from './components/SystemCourseTop';
import TopBar from './components/TopBar';
import CourseDetail from './components/CourseDetail';
import BottomPopup from './components/BottomPopup';
import Skeleton from './components/Skeleton';
import FinishedAll from './components/FinishedAll';
import { mapActions } from 'vuex';
import { sendShareInfoToApp, leaveH5Page } from '@/utils/jsBridge';
import { Image } from 'vant';
import { toLogin } from 'api/login/h5login';
import { getLocalToken, getUserType, getObjValue } from '@/utils/local';
import { wxShare } from '@/utils/wxhelp';
import { getCurrentHref } from '@/utils';
import courseFooter from './components/SystemCourseFooter';
import { POSTER_IMG_URL, SHARE_ICON } from '@/utils/constant';
import { isWeiXin } from '@/utils/platformHelper';
import {
  sensorsSystemClassShow,
  sensorsSystemClassBotBtn
} from '@/trackPoint/trackPoint';
import sensorsClass from './mixins/sensorsClass';
import { storage } from '@/utils/tool';
import _ from 'lodash';
// import mock from './previewMock/previewMock';

export default {
  name: 'systemClass',
  data() {
    return {
      buy_state_exp: false, // 用户是否购买过体验课
      moduleList: [], // 锚点数据
      isTopBarShow: false, // titleBar是否显示
      isClickPoint: false, // 是否点击锚点调过来
      openFinishedAll: false // 是否完成了所有的课程
    };
  },
  components: {
    courseTop,
    BottomPopup,
    VanImage: Image,
    Skeleton,
    courseFooter,
    TopBar,
    CourseDetail,
    FinishedAll
  },
  mixins: [sensorsClass],
  watch: {
    courseInfo: {
      deep: true,
      handler(newVal) {
        if (newVal.spu_id) {
          // 初始化分享方法
          const platform = localStorage.getItem('platform');
          if (platform === 'ios' || platform === 'android') {
            this.sendShareInfoToApp();
          } else {
            const title = '小猴思维系统课';
            const desc =
              '48周培养学前七大能力，每天聪明一点点！限时赠送学而思精选超值原创教具！';
            const link = getCurrentHref();
            const imgUrl = SHARE_ICON;

            wxShare({ title, desc, link, imgUrl });
          }
          // 初始化锚点
          this.initTopBar();
        }
      }
    },
    isTopBarShow(newVal) {
      const topBarHeight = this.$refs.topBar.$el.clientHeight;
      if (newVal) {
        this.moduleList[0].top -= topBarHeight;
      } else {
        this.moduleList[0].top += topBarHeight;
      }
    }
  },
  created() {
    window.localStorage.setItem('platform', 'ios'); // 为了模拟端内环境, 重置custom-app-code:4
    this.getPreview({ id: this.$route.query.goods_id }).then(res => {
      this.initTopBar();
    });
    // this.getSku({ spu_id: this.$route.query.goods_id });
  },
  mounted() {
    /* const sku = [];
    mock.course_bags && mock.course_bags.forEach(item => {
      sku.push({
        course_bag_name: mock.course_bag_name,
        original_price: '1000',
        sale_price: '100',
        sale_tag: item.sale_tag,
        unit: '月',
      });
    });
    this.$store.commit('course/SET_COURSE_INFO', {
      spu_id: mock.spu_id,
      course_type: mock.course_type,
      course_name: mock.course_name,
      show_stock: mock.show_stock,
      banner_type: mock.banner_type,
      is_anchor: mock.is_anchor,
      card_promotion_price: mock.card_promotion_price,
      card_price: mock.card_price,
      sale_point_name: mock.sale_point_name,
      promote_pic: mock.promote_pic,
      activities: mock.activities,

      cover_pic: mock.cover_pic && mock.cover_pic[0].resource_url,
      head_url: [mock.pic_head && mock.pic_head[0].resource_url],
      sku,

      rest_stock: 10,
      subject_id: 1,
      sale_period_info: {
        sale_period: {
          sale_period_id: '81359239448003903',
          sale_period_num: 2,
          is_subscribe: false,
          sale_start_time: '2020-06-17 20:04:53',
          sale_stop_time: '2020-06-28 00:00:00',
          open_course_time: '2020-06-29 00:00:00',
        },
        next_sale_period: {
          sale_period_id: '81359270236696901',
          sale_period_num: 5,
          is_subscribe: false,
          sale_start_time: '2020-07-01 00:00:00',
          sale_stop_time: '2020-07-05 00:00:00',
          open_course_time: '2020-07-06 00:00:00',
        },
      },
    });
    this.initTopBar(); */
  },
  methods: {
    /**
     * @description 关闭已学完所有课程弹窗
     */
    closeFinishedAll() {
      this.openFinishedAll = false;
    },

    /**
     * @description 初始化锚点
     */
    initTopBar () {
      let moduleList = _.cloneDeep(this.courseInfo.course_introduction);
      moduleList = this.formatList(moduleList);
      console.log('moduleList', moduleList);
      if (Array.isArray(moduleList)) {
        moduleList.map((item, index) => {
          item.active = index === 0;
          item.refName = 'courseDetail' + index;
        });
        this.moduleList = moduleList;
      }
    },
    formatList () {
      let infoList = _.cloneDeep(this.courseInfo.course_introduction);
      const nameList = [];
      const list = [];
      infoList.forEach((item, index) => {
        const nameIndex = nameList.indexOf(item.addition_name);
        if (nameIndex === -1) {
          nameList.push(item.addition_name);
          list.push({
            name: item.addition_name,
            url: [item.resource_url],
          });
        } else {
          list[nameIndex].url.push(item.resource_url);
        }
      });
      return list;
    },
    /**
     * @description 点击锚点
     */
    clickPoint(index) {
      const topBarHeight = this.$refs.topBar.$el.clientHeight;
      this.isClickPoint = true;
      const top = this.moduleList[index].top;
      this.clearModuleListTrue();
      this.moduleList[index].active = true;
      this.$refs.content.scrollTo({ top });
    },

    /**
     * @description 清楚moduleList的active=true选项
     */
    clearModuleListTrue() {
      this.moduleList.map(item => {
        item.active = false;
      });
    },

    /**
     * @descrtiption 更改moduleList值
     */
    changeModuleList(moduleList) {
      moduleList.map((item, index) => {
        item.top =
          index === 0
            ? item.top
            : item.top - this.$refs.topBar.$el.clientHeight;
      });
      this.moduleList = moduleList;
    },

    detailScrollFun() {
      if (this.isClickPoint) {
        this.isClickPoint = false;
        return;
      }
      const contentDom = this.$refs.content;
      const st = contentDom.scrollTop;
      const length = this.moduleList.length;
      const topBarShowHeight = this.moduleList[0].top;
      this.isTopBarShow = st >= topBarShowHeight ? true : false;
      for (let i = 0; i < length; i++) {
        const cur = this.moduleList[i];
        const nextIndex = i < length ? i + 1 : length - 1;
        const next = this.moduleList[nextIndex];
        if (
          (st >= cur.top && next && st < next.top) ||
          (st >= cur.top && !next)
        ) {
          this.clearModuleListTrue();
          cur.active = true;
        }
      }
    },

    leaveH5Page() {
      const option = {
        callback: () => {
          this.sensorsSystemClass();
        }
      };
      leaveH5Page(option);
    },

    /**
     * 底部按钮点击事件
     */
    handleBuyCourse() {
      if (Number(this.allSkuInfo.use_buy_type) === 4) {
        this.openFinishedAll = true;
        return;
      }
      this.$refs.popup.ifShow = true;
      // 处理微信环境下可能没有openId的问题
      // let loginStatus;
      // if (
      //   localStorage.getItem('platform') === 'ios' ||
      //   localStorage.getItem('platform') === 'android'
      // ) {
      //   loginStatus = !!localStorage.getItem('token');
      // } else {
      //   loginStatus =
      //     !!localStorage.getItem('token') &&
      //     !!localStorage.getItem('mathOpenId') &&
      //     localStorage.getItem('mathOpenId') !== 'undefined';
      // }

      // if (!loginStatus) {
      //   toLogin();
      // } else {
      //   this.$refs.popup.ifShow = true;
      // }

      // 底部按钮埋点
      sensorsSystemClassBotBtn({
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        course_periods: this.coursePeriods,
        course_startdate: this.courseStartDate,
        button_type: this.buttonType
      });
    },
    ...mapActions('course', [
      'getPreview',
      'getSku',
      'checkOldUser',
      'getH5Status',
      'getBanana'
    ]),
    sendShareInfoToApp() {
      let option = {
        url:
          getCurrentHref() +
          `?utm_source=AppShare&utm_medium=link&utm_campaign=usershare&fromUser=${localStorage.getItem(
            'userId'
          )}`,
        title: '小猴思维系统课（适合3-8岁）',
        desc:
          '48周培养学前七大能力，每天聪明一点点！限时赠送学而思精选超值原创教具！',
        img: POSTER_IMG_URL,
        linkImg: SHARE_ICON,
        // avatar: 海报用户头像，
        inviteDesc: '孩子很喜欢小猴思维，我也邀请你一起学',
        qrcode: getCurrentHref(),
        price: this.courseInfo.card_price,
        originPrice: this.courseInfo.card_promotion_price,
        incentive: '打卡4天，返券49元',
        isShowPoster: '0',
        course_periods: '第' + String(this.courseInfo.title) + '期',
        course_id: this.courseInfo.sku[0].course_package_id + '',
        course_startdate: this.courseInfo.open_course_time,
        course_type: this.courseInfo.course_type + ''
      };
      sendShareInfoToApp(option);
    },

    // 埋点事件
    async sensorsReportFun() {
      sensorsSystemClassShow({
        stu_id: localStorage.getItem('userId') || '',
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        banner_type: Number(this.courseInfo.banner_type),
        course_periods: this.coursePeriods,
        course_startdate: this.courseStartDate,
        course_orginalprice: Number(this.courseInfo.card_promotion_price) - 0,
        course_saleprice: Number(this.courseInfo.card_price) - 0,
        activity_content: this.activityInfo.activity_desc,
        activity_link: this.activityInfo.activity_url,
        button_type: this.buttonType,
        sharer_id: this.$route.query.fromUser || '-1',
        channel_source: isWeiXin() ? '微信' : 'APP'
      });
    },

    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
        localStorage.setItem('is_bottoming_system', true);
      }
      // 锚点相关事件
      this.detailScrollFun();
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  // padding-bottom: constant(safe-area-inset-bottom);
  // padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  height: 100%;
  flex-direction: column;
  .content {
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    background: transparent;
  }
  .footer {
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px -3px 9px 0px rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 100;
    .bigBtn {
      width: 460px;
      height: 90px;
      border: 0;
      background-color: #ff6c48;
      color: #fff;
      font-size: 34px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>
