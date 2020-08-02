import {
  getCourseList,
  getSkuList,
  getPreviewData,
} from '@/api/course';
// import mock from '@/views/course/previewMock/previewMock.js';
import {
  SET_COURSE_INFO,
  SET_ACTIVE_CARD,
  SET_SELLING_STATUS,
  SET_SOLDOUT_STATUS,
  SET_LOGIN_STATUS,
  SET_IS_OLDUSER,
  SET_CURRENT_GRADE,
  SET_USER_STATUS,
  SET_CURRENT_SUBSTATE,
  SET_NEXT_SUBSTATE,
  SET_IFSHOWBANANA,
  SET_COUNTDOWNTYPE,
  SET_AUDIOPLAY,
  SET_AUDIOEND,
  SET_IS_ACTIVITY_CLICK,
  SET_SALETIME,
  SET_NEXTSALETIME,
  SET_COUNTTIME,
  SET_CHECK_STATUS,
  SET_SKU_INFO,
  SET_BUTTON_TYPE,
} from './../mutationTypes';
import _ from 'lodash';
import { getObjValue } from '@/utils/local';

/**
      @isSoldOut boolean 是否售罄
      @isSelling boolean 是否开售
      @isOldUser boolean 是否买过该课程
      @courseInfo boolean 课程的信息
      @activeCard object 选中的sku
      @userGrade number 当前学员的年级
      @isInSell boolean 是否在销售期，倒计时用
      @qrcodeLink string h5端订阅开售提醒时弹出的二维码地址
      @ifShowBanana boolean 是否展示分享得到香蕉币的图片
      @subCurrentState boolean 是否已经订阅当前期开售提醒
      @subNextState boolean 是否已经订阅下一销售期开售提醒
      @userStatus boolean 校验老用户的请求是否已经完成
      @countType string 定时器种类 nextStart 下一期开售 start 开售 end 停售 endFromCount 从倒计时进入end状态
      @audioPlay boolean 视频是否播放
      @audioEnd boolean 视频是否放完
      @isActivityClick boolean 是否点击活动位
      @saleTime string 下次开售时间
      @nextSaleTime string 售罄时的下次开售时间
      @counttime string 倒计时时间
      @allSkuInfo array 通过接口获取弹窗需要的sku信息
      @activityInfo array 优惠活动配置信息
      @buttonType string 当前按钮的类型
**/
const state = {
  saleTime: '',
  nextSaleTime: '',
  audioPlay: false,
  audioEnd: false,
  isActivityClick: false,
  countType: 'start',
  subCurrentState: false,
  subNextState: false,
  qrcodeLink: '',
  ifShowBanana: true,
  isInSell: false,
  userStatus: false,
  pageLoading: true,
  isSoldOut: false,
  isSelling: false,
  isOldUser: false,
  isLogin: false,
  isCheckOldUser: false,
  userGrade: 0,
  courseInfo: {
    subject_id: 1,
    course_type: 0,
    activities: [],
    gallery: [],
    head_url: [],
    sku: [
      {
        sale_price: 0,
      },
    ],
    sale_period_info: {
      sale_period: {
        sale_period_id: '',
        sale_period_num: '',
        is_subscribe: false,
        sale_start_time: '',
        sale_stop_time: '',
        open_course_time: '',
      },
      next_sale_period: {
        sale_period_id: '',
        sale_period_num: '',
        is_subscribe: false,
        sale_start_time: '',
        sale_stop_time: '',
        open_course_time: '',
      },
    },
    counttime: '',
    purchase_status: '', // 用于埋点
  },
  hasBuyInfo: {},
  activeCard: '',
  allSkuInfo: {
    order_user_address: {},
  },
  activityInfo: [],
  buttonType: '',
};
const actions = {
  // 获取课程信息
  getCourse({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      getCourseList(payload).then(res => {
        if (!res) return;
        const { code, data } = res;
        if (Array.isArray(data)) {
          this.$MkToast('未查询到课程信息');
        }
        if (code === 200) {
          commit(SET_COURSE_INFO, data);
          // state.courseInfo.sale_period_info.next_sale_period.sale_start_time = '';
          const flag = checkIsSelling(data, state);
          console.log(flag, 'flag');
          flag && commit(SET_SELLING_STATUS, true);
          flag && (state.countType = 'end');
          commit(SET_SOLDOUT_STATUS, data.rest_stock <= 0);
          state.saleTime = getObjValue(
            data,
            'sale_period_info.sale_period.sale_start_time',
            0
          );
          // 售罄时的下次开售时间
          state.nextSaleTime = getObjValue(data, 'sale_period_info.next_sale_period.sale_start_time');
          // state.nextSaleTime = '';
          state.isSoldOut && state.nextSaleTime && (state.countType = 'nextStart');
          state.pageLoading = false;
          // 核对是否是老用户
          state.userStatus = true;
          const pathName = window.location.pathname;
          let isOldUser;
          // 体验课情况
          if (pathName.includes('experienceClass')) {
            // 第三种情况为后端自定义课程权益情况
            isOldUser = Number(data.user_buy_state) === 1 || Number(data.user_buy_state) === 3 || (Number(data.user_buy_state) === 0 && Number(data.use_buy_type) !== 1);
          } else {
            isOldUser = Number(data.user_buy_state) === 2 || Number(data.user_buy_state) === 3;
          }
          commit(SET_IS_OLDUSER, isOldUser);
          console.log(Number(data.user_buy_state) === 2, state.isOldUser, 'isOldUser');
          commit(SET_CHECK_STATUS, true);
          // 核对是否分享过海报
          state.ifShowBanana = data.poster_coins;
          console.log(state.ifShowBanana, 'ifShowBanana====');
          // 核对当前的订阅状态
          state.subCurrentState = data.sale_period_info.sale_period.is_subscribe;
          state.subNextState = data.sale_period_info.next_sale_period.is_subscribe;
          // 配置优惠活动信息
          state.activityInfo = data.activities;
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  },
  // 获取预览页面信息
  getPreview({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      getPreviewData(payload).then(res => {
        if (!res) return;
        const { code, data } = res;
        if (code === 200) {
          const sku = [];
          const activities = [];
          data.course_bags && data.course_bags.forEach(item => {
            sku.push({
              course_bag_name: data.course_bag_name,
              original_price: '1000',
              sale_price: '100',
              sale_tag: item.sale_tag,
              unit: '月',
            });
          });
          data.activities && data.activities.forEach(item => {
            activities.push({
              activity_tag: item.activity_tag,
              activity_desc: item.activity_intro,
              activity_url: item.skip_url,
            });
          });
          state.activityInfo = activities;
          commit(SET_COURSE_INFO, {
            spu_id: data.spu_id,
            course_type: data.course_type,
            course_name: data.course_name,
            show_stock: data.show_stock,
            banner_type: data.banner_type,
            is_anchor: data.is_anchor,
            sku,
            card_promotion_price: data.card_promotion_price,
            course_introduction: data.course_introduction,
            card_price: data.card_price,
            sale_point_name: data.sale_point_name,
            promote_pic: data.promote_pic,
            activities,
            cover_pic: data.cover_pic && data.cover_pic.length && data.cover_pic[0].resource_url,
            head_url: data.pic_head && data.pic_head.length && [data.pic_head[0].resource_url],
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
          // commit(SET_COURSE_INFO, data);
          state.pageLoading = false;
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  },
  // 获取sku信息
  getSku({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      getSkuList(payload).then(res => {
        if (!res) return;
        const { code, data } = res;
        if (Array.isArray(data)) {
          this.$MkToast('未查询到课程信息');
        }
        if (code === 200) {
          state.allSkuInfo = data;
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }
};
const mutations = {
  [SET_COURSE_INFO](state, payload) {
    state.courseInfo = _.cloneDeep(payload);
  },
  [SET_SKU_INFO](state, payload) {
    state.allSkuInfo = _.cloneDeep(payload);
  },
  [SET_ACTIVE_CARD](state, payload) {
    state.activeCard = payload;
  },
  [SET_SELLING_STATUS](state, payload) {
    state.isSelling = payload;
  },
  [SET_SOLDOUT_STATUS](state, payload) {
    state.isSoldOut = payload;
  },
  [SET_LOGIN_STATUS](state, payload) {
    state.isLogin = payload;
  },
  [SET_IS_OLDUSER](state, payload) {
    console.log(payload, 'payload');
    state.isOldUser = payload;
  },
  [SET_CURRENT_GRADE](state, payload) {
    state.userGrade = payload;
  },
  [SET_CHECK_STATUS](state, payload) {
    state.isCheckOldUser = payload;
  },
  [SET_USER_STATUS](state, payload) {
    state.userStatus = payload;
  },
  [SET_CURRENT_SUBSTATE](state, payload) {
    state.subCurrentState = payload;
  },
  [SET_NEXT_SUBSTATE](state, payload) {
    state.subNextState = payload;
  },
  [SET_IFSHOWBANANA](state, payload) {
    state.ifShowBanana = payload;
  },
  [SET_COUNTDOWNTYPE](state, payload) {
    state.countType = payload;
  },
  [SET_AUDIOPLAY](state, payload) {
    state.audioPlay = payload;
  },
  [SET_AUDIOEND](state, payload) {
    state.audioEnd = payload;
  },
  [SET_IS_ACTIVITY_CLICK](state, payload) {
    state.isActivityClick = payload;
  },
  [SET_SALETIME](state, payload) {
    state.saleTime = payload;
  },
  [SET_NEXTSALETIME](state, payload) {
    state.nextSaleTime = payload;
  },
  [SET_COUNTTIME](state, payload) {
    state.counttime = payload;
  },
  [SET_BUTTON_TYPE](state, payload) {
    state.buttonType = payload;
  },
};
const getters = {
  courses: state => {
    // console.log('触发了getter');
    // 将商品按照年级分组
    const grades = _.groupBy(state.allSkuInfo.sku, 'grade');
    return grades;
  },
  subject: state => {
    const subjectMap = new Map([
      [1, '语文'],
      [2, '思维'],
      [3, '英语'],
    ]);
    return subjectMap.get(Number(state.courseInfo.subject_id));
  },
  courseType: state => {
    const courseTypeMap = new Map([
      [1, '体验课'],
      [2, '系统课'],
    ]);
    return courseTypeMap.get(Number(state.courseInfo.course_type));
  },
  // 返回当前期数
  coursePeriods: state => {
    return Number(
      getObjValue(
        state.courseInfo,
        'sale_period_info.sale_period.sale_period_num',
        0
      )
    );
  },
  // 返回下一期数
  nextCoursePeriods: state => {
    return Number(
      getObjValue(
        state.courseInfo,
        'sale_period_info.next_sale_period.sale_period_num',
        0
      )
    );
  },
  // 返回当前开课时间
  courseStartDate: state => {
    return getObjValue(
      state.courseInfo,
      'sale_period_info.sale_period.open_course_time'
    );
  },
  // 返回活动名称和活动链接取值
  activityInfo: state => {
    const activitiesArr = state.courseInfo.activities;
    let activityInfo = {
      activity_desc: '',
      activity_url: '',
    };
    if (Array.isArray(activitiesArr)) {
      activityInfo = activitiesArr.reduce(
        (pre, next) => {
          return {
            activity_desc: pre.activity_desc + ',' + next.activity_desc,
            activity_url: pre.activity_url + ',' + next.activity_url,
          };
        },
        { activity_desc: '', activity_url: '' }
      );
    }
    activityInfo.activity_desc = activityInfo.activity_desc.slice(1);
    activityInfo.activity_url = activityInfo.activity_url.slice(1);
    return activityInfo;
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

function checkIsSelling(data, state) {
  // 销售期开始时间、结束时间
  const { sale_start_time, sale_stop_time } = data.sale_period_info.sale_period;
  // 服务端时间
  const serviceTime = new Date(data.service_time.replace(/-/g, '/')).getTime();
  // 销售期开始时间
  const startTime = new Date(sale_start_time.replace(/-/g, '/')).getTime();
  // 销售期结束时间
  const endTime = new Date(sale_stop_time.replace(/-/g, '/')).getTime();
  // 判断是否在销售期
  if (serviceTime > startTime && serviceTime < endTime) {
    // 在销售期内的话
    state.isInSell = true;
    return true;
  }
  return false;
}
