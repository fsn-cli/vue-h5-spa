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
        v-show="courseInfo.is_anchor"
        ref="topBar"
        :moduleList="moduleList"
        :isShow="isTopBarShow"
        @clickPoint="clickPoint"
      />
      <course-top />
      <!-- 课程详情模块 -->
      <course-detail
        :moduleList="moduleList"
        @changeModuleList="changeModuleList"
      />
    </div>
    <div v-show="courseInfo.spu_id" class="footer">
      <course-footer :shareLink="shareLink" />
    </div>
  </div>
</template>

<script>
import courseTop from './components/CourseTop';
import CourseDetail from './components/CourseDetail';
import courseFooter from './components/CourseFooter';
import TopBar from './components/TopBar';
import { mapActions, mapState, mapGetters } from 'vuex';
import { sendShareInfoToApp, leaveH5Page } from '@/utils/jsBridge';
import { Image } from 'vant';
import { getLocalToken, getUserType, getObjValue } from '@/utils/local';
import { wxShare } from '@/utils/wxhelp';
import { getCurrentHref } from '@/utils';
import {
  SHARE_MATH_ICON,
  SHARE_CH_ICON,
  SHARE_EN_ICON
} from '@/utils/constant';
import Skeleton from './components/Skeleton';
import { sensorsExperienceClassShow } from '@/trackPoint/trackPoint';
import { getPlatform } from '@/utils/platformHelper';
import { storage } from '@/utils/tool';
import sensorsClass from './mixins/sensorsClass';
import _ from 'lodash';

export default {
  name: 'ExperienceClass',
  data() {
    return {
      moduleList: [], // 锚点数据
      isTopBarShow: false, // titleBar是否显示
      isClickPoint: false // 是否点击锚点调过来
    };
  },
  components: {
    courseTop,
    courseFooter,
    VanImage: Image,
    Skeleton,
    TopBar,
    CourseDetail
  },
  mixins: [sensorsClass],
  computed: {
    ...mapState('course', [
      'isOldUser',
      'isSelling',
      'subState',
      'courseInfo',
      'pageLoading',
      'saleTime',
      'nextSaleTime',
      'subNextState',
      'subCurrentState'
    ]),
    ...mapGetters('course', [
      'subject',
      'activityInfo',
      'coursePeriods',
      'courseStartDate'
    ])
  },
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
            const title = '小猴思维体验课';
            const desc =
              '14天为宝贝轻松开启思维启蒙！限时赠送价值268元七大能力体验礼盒！';
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
    // 初始化是否滑到底部
    localStorage.setItem('is_bottoming_experience', false);
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
  },
  mounted() {
    // 输出userId方便之后arms监控报警处理
    console.log(localStorage.getItem('userId'), '=======用户userId======');
    // 初始化分享方法
    // this.sendShareInfoToApp();
    this.leaveH5Page();
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
  destroyed() {},
  methods: {
    ...mapActions('course', ['getCourse', 'getSku']),
    /**
     * @description 初始化锚点
     */
    initTopBar() {
      let moduleList = _.cloneDeep(this.courseInfo.pic);
      if (Array.isArray(moduleList)) {
        moduleList.map((item, index) => {
          item.active = index === 0 ? true : false;
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
          this.sensorsExperienceClass();
        }
      };
      leaveH5Page(option);
    },
    async sendShareInfoToApp() {
      const res = await this.getShareLinkHandle();
      if (Number(res.code) === 200) {
        this.shareLink = res.data && res.data.url;
      }
      const subjectTitle = new Map([
        [1, '小猴语文体验课（适合3-8岁）'],
        [2, '小猴思维体验课（适合3-8岁）'],
        [3, '跟我一起开口说英语，10节英语启蒙课限时券后9元']
      ]);
      const descMap = new Map([
        [1, '轻松开心学语文，无缝衔接一年级！限时赠送799元大礼包！'],
        [
          2,
          '48周培养学前七大能力，每天聪明一点点！限时赠送学而思精选超值原创教具！'
        ],
        [3, '包邮赠送学习礼盒']
      ]);
      const iconMap = new Map([
        [1, SHARE_CH_ICON],
        [2, SHARE_MATH_ICON],
        [3, SHARE_EN_ICON]
      ]);
      let option = {
        pageId: 'experienceClass',
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
    sensorsReportFun() {
      sensorsExperienceClassShow({
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
        channel_source: getPlatform() === 'app' ? 'APP' : 'H5',
        sharer_id: this.$route.query.fromUser || '-1'
      });
    },
    handleScroll(e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
        localStorage.setItem('is_bottoming_experience', true);
      }
      // 锚点相关事件
      this.detailScrollFun();
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;
  flex-direction: column;
  .content {
    flex: 1;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .footer {
    height: 160px;
    position: relative;
    z-index: 100;
    box-shadow: 0px -3px 9px 0px rgba(0, 0, 0, 0.06);
  }
}
</style>
