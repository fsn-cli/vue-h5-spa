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
    <div v-show="courseInfo.spu_id" class="footer">
      <!-- 老用户中在读续费时显示立即续费，结课重构显示立即购买 -->
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
    </div>
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
import { getCurrentHref } from '@/utils';
import courseFooter from './components/SystemCourseFooter';
import {
  SHARE_MATH_ICON,
  SHARE_CH_ICON,
  SHARE_EN_ICON
} from '@/utils/constant';
import { isWeiXin } from '@/utils/platformHelper';
import {
  sensorsSystemClassShow,
  sensorsSystemClassBotBtn
} from '@/trackPoint/trackPoint';
import sensorsClass from './mixins/sensorsClass';
import { storage } from '@/utils/tool';
import _ from 'lodash';

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
    // 初始化是否滑到底部
    localStorage.setItem('is_bottoming_system', false);
    // 获取当前的平台
    const platform = localStorage.getItem('platform');
    const form_type = platform !== 'h5' ? 1 : 2;
    const spu_id = this.$route.query.spu_id;
    if (getLocalToken()) {
      this.getCourse({ spu_id, form_type });
      this.getSku({ spu_id });
      this.$store.commit('course/SET_LOGIN_STATUS', true);
    } else {
      this.getCourse({ spu_id, form_type });
      this.$store.commit('course/SET_USER_STATUS', true);
    }
    // 用于埋点
    storage.set('fromWhere', this.$router.currentRoute.path);
  },
  mounted() {
    // 输出userId方便之后arms监控报警处理
    console.log(localStorage.getItem('userId'), '=======用户userId======');
    // 初始化分享方法
    // this.sendShareInfoToApp();
    // 初始化调用
    this.leaveH5Page();
    let orignalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, newValue) {
      let setItemEvent = new Event('setItemEvent');
      setItemEvent.key = key;
      window.dispatchEvent(setItemEvent);
      orignalSetItem.apply(this, arguments);
    };
    window.addEventListener('setItemEvent', e => {
      if (e.key === 'token') {
        this.$store.commit('course/SET_LOGIN_STATUS', true);
      }
    });
    // ios 禁止顶部橡皮筋效果
    const ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否为ios
    if (ios) {
      // 去除 iOS 顶部橡皮筋效果
      let startY, endY;
      this.$refs.content.addEventListener('touchstart', function(e) {
        startY = e.touches[0].pageY;
      });
      this.$refs.content.addEventListener(
        'touchmove',
        e => {
          endY = e.touches[0].pageY;
          // 手指下滑，页面到达顶端不能继续下滑
          if (endY > startY && this.$refs.content.scrollTop <= 0) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }
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
    initTopBar() {
      let moduleList = _.cloneDeep(this.courseInfo.pic);
      if (Array.isArray(moduleList)) {
        moduleList.map((item, index) => {
          item.active = index === 0;
          item.refName = 'courseDetail' + index;
        });
        this.moduleList = moduleList;
      }
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
      this.isTopBarShow = st >= topBarShowHeight;
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
      // this.$refs.popup.ifShow = true;
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

      if (!loginStatus) {
        toLogin();
      } else {
        // 全部购买完课程
        if (this.courseInfo.buy_finish_type) {
          this.openFinishedAll = true;
          return;
        }
        // 是否购买过英语课程
        if (this.courseInfo.is_buy_old_version_en) {
          this.$MkToast(
            '您已购买过小猴英语系统课，请前往“小猴英语”App中继续完成学习'
          );
          return;
        }
        // 当前学科存在退费中的申请
        if (this.courseInfo.return_sale) {
          this.$MkToast('该学科课程正在申请退费，暂不可购课');
          return;
        }
        this.$refs.popup.ifShow = true;
      }

      // 底部按钮埋点
      sensorsSystemClassBotBtn({
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        course_periods: this.coursePeriods,
        course_startdate: this.courseStartDate,
        button_type: this.buttonType
      });
    },
    ...mapActions('course', ['getCourse', 'getSku', 'checkOldUser']),
    async sendShareInfoToApp() {
      const res = await this.getShareLinkHandle();
      if (Number(res.code) === 200) {
        this.shareLink = res.data && res.data.url;
      }
      const subjectTitle = new Map([
        [1, '小猴语文系统课（适合3-8岁）'],
        [2, '小猴思维系统课（适合3-8岁）'],
        [3, '专为2~8岁孩子定制的常青藤外教英语启蒙课']
      ]);
      const descMap = new Map([
        [1, '轻松开心学语文，无缝衔接一年级！限时赠送799元大礼包！'],
        [
          2,
          '48周培养学前七大能力，每天聪明一点点！限时赠送学而思精选超值原创教具！'
        ],
        [3, '限时加赠799元点读笔大礼盒']
      ]);
      const iconMap = new Map([
        [1, SHARE_CH_ICON],
        [2, SHARE_MATH_ICON],
        [3, SHARE_EN_ICON]
      ]);
      let option = {
        pageId: 'systemClass',
        subject: this.courseInfo.subject_id,
        isShowPoster: '0',
        url: this.shareLink,
        title: subjectTitle.get(Number(this.courseInfo.subject_id)),
        desc: descMap.get(Number(this.courseInfo.subject_id)),
        linkImg: iconMap.get(Number(this.courseInfo.subject_id)),
        course_periods: this.coursePeriods,
        course_startdate: this.courseStartDate,
        isAddCredits: 0,
        credits: 0,
        course_type: this.courseInfo.course_type,
        course_id: this.courseInfo.spu_id
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
      width: 670px;
      height: 100px;
      border: 0;
      background-color: #ff8a66;
      color: #fff;
      font-size: 36px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>
