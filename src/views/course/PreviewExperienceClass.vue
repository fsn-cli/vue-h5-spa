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
    <!-- <div v-show="courseInfo.spu_id" class="footer">
      <course-footer />
    </div> -->
  </div>
</template>

<script>
import courseTop from './components/CourseTop';
import CourseDetail from './components/CourseDetail';
import courseFooter from './components/CourseFooter';
import TopBar from './components/TopBar';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { getLocalToken, getUserType, getObjValue } from '@/utils/local';
import { wxShare } from '@/utils/wxhelp';
import { getCurrentHref } from '@/utils';
import { POSTER_IMG_URL, SHARE_ICON } from '@/utils/constant';
import Skeleton from './components/Skeleton';
import { sensorsExperienceClassShow } from '@/trackPoint/trackPoint';
import { getPlatform } from '@/utils/platformHelper';
import { storage } from '@/utils/tool';
import sensorsClass from './mixins/sensorsClass';
import _ from 'lodash';
// import mock from './previewMock/previewMock';

export default {
  name: 'ExperienceClass',
  data () {
    return {
      moduleList: [], // 锚点数据
      isTopBarShow: false, // titleBar是否显示
      isClickPoint: false, // 是否点击锚点调过来
    };
  },
  components: {
    courseTop,
    courseFooter,
    Skeleton,
    TopBar,
    CourseDetail,
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
      'subCurrentState',
    ]),
    ...mapGetters('course', [
      'subject',
      'activityInfo',
      'coursePeriods',
      'courseStartDate',
    ]),
  },
  watch: {
    isTopBarShow (newVal) {
      const topBarHeight = this.$refs.topBar.$el.clientHeight;
      if (newVal) {
        this.moduleList[0].top -= topBarHeight;
      } else {
        this.moduleList[0].top += topBarHeight;
      }
    },
  },
  created () {
    window.localStorage.setItem('platform', 'ios'); // 为了模拟端内环境, 重置custom-app-code:4
    this.getPreview({ id: this.$route.query.goods_id }).then(res => {
      this.initTopBar();
    });
  },
  mounted () {
    /* this.$store.commit('course/SET_COURSE_INFO', {
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
    ...mapActions('course', ['getPreview', 'getSku']),
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
    clickPoint (index) {
      this.isClickPoint = true;
      const top = this.moduleList[index].top;
      this.clearModuleListTrue();
      this.moduleList[index].active = true;
      this.$refs.content.scrollTo({ top });
    },

    /**
     * @description 清楚moduleList的active=true选项
     */
    clearModuleListTrue () {
      this.moduleList.map(item => {
        item.active = false;
      });
    },

    /**
     * @descrtiption 更改moduleList值
     */
    changeModuleList (moduleList) {
      moduleList.map((item, index) => {
        item.top =
          index === 0
            ? item.top
            : item.top - this.$refs.topBar.$el.clientHeight;
      });
      this.moduleList = moduleList;
    },

    detailScrollFun () {
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
    handleScroll (e) {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
        localStorage.setItem('is_bottoming_experience', true);
      }
      // 锚点相关事件
      this.detailScrollFun();
    },
  },
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
