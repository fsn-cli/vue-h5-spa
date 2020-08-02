<template>
  <div>
    <popup v-model="ifShow" position="bottom">
      <div v-if="pageLoading && userStatus" class="emptyBox" />
      <!-- 体验课弹层 -->
      <div v-else-if="classType === 1" class="box">
        <p class="title">开课时间</p>
        <p class="claTime">
          {{
            '第' +
              title +
              '期' +
              ' ' +
              $formatTime(courseStartDate, 'yyyy年MM月dd日')
          }}
        </p>
        <p class="title">选择课程</p>
        <div class="cardContainer">
          <div
            v-for="(item, key) in courses"
            :key="key"
            :class="[
              'card',
              key === gradeActiveKey && item[0].sold_out
                ? 'soldout'
                : key === gradeActiveKey && 'active'
            ]"
            @click="handleChooseGrade(key, item)"
          >
            <p>{{ item[0].grade_name }}</p>
          </div>
        </div>
        <div class="cardDescription" v-show="isSelectCardSoldOut">
          已售罄
          <span v-show="nextSaleStartTime">{{
            getDay(nextSaleStartTime)
          }}</span>
        </div>
        <div class="boxBottom" v-if="!isSelectCardSoldOut">
          <div class="priceLeft">
            <!-- 93需求去掉划线价格 -->
            <!-- <span class="oldPrice">
              <i v-show="activeCard.sale_price">&yen;</i>
              {{ activeCard.card_promotion_price }}
            </span> -->
            <span class="newPrice">
              <i v-show="activeCard.sale_price">&yen;</i>
              <span>{{ activeCard.sale_price }}</span>
            </span>
            <span class="breaksPrice" v-show="activeCard.discount_num">
              已减免{{
                activeCard.sale_price > activeCard.discount_num
                  ? activeCard.discount_num
                  : activeCard.sale_price
              }}元
            </span>
          </div>
          <van-button
            class="myBtn"
            color="#FF8A66"
            round
            size="normal"
            @click="handlePay"
            >去支付</van-button
          >
        </div>
        <div class="boxBottom" v-else-if="!subNextState && nextSaleStartTime">
          <van-button
            class="mySubscribeBtn"
            color="#FF8A66"
            round
            size="normal"
            @click="handleSubscribe"
            >订阅开售提醒</van-button
          >
        </div>
        <div class="boxBottom" v-else>
          <van-button
            class="mySubscribeBtn"
            color="#EAEAEA"
            round
            size="normal"
            @click=""
            >{{ nextSaleStartTime ? '已订阅开售提醒' : '已售罄' }}</van-button
          >
        </div>
      </div>
      <!-- 系统课弹层 -->
      <div
        v-else-if="classType === 2 && Number(allSkuInfo.use_buy_type) !== 3"
        class="box"
      >
        <p class="title">课程信息</p>
        <p class="claTime">
          {{
            $formatTime(
              courseInfo.sale_period_info.sale_period.open_course_time,
              'MM月dd日'
            ) + '开课-系统课'
          }}
        </p>
        <p v-show="userStatus && ifShowGrade" class="title">
          选择级别
        </p>
        <div v-show="userStatus && ifShowGrade" class="cardContainer">
          <div
            v-for="(item, key) in courses"
            :key="key"
            :class="[
              'card',
              key === gradeActiveKey &&
              (isSelectGradeSoldOut || isSelectCourseSoldOut)
                ? 'soldout'
                : key === gradeActiveKey && 'active'
            ]"
            @click="handleChooseGrade(key, item)"
          >
            <p>{{ item[0].grade_name }}</p>
          </div>
        </div>
        <div class="cardDescription" v-show="isSelectGradeSoldOut">
          已售罄
          <span v-show="nextSaleStartTime">{{
            getDay(nextSaleStartTime)
          }}</span>
        </div>
        <p
          v-show="activeGrade.length > 0 && !isSelectGradeSoldOut"
          class="title"
        >
          选择课程包
        </p>
        <p
          v-show="
            activeGrade.length > 0 &&
              !isSelectGradeSoldOut &&
              isShowCourseDescription
          "
          class="courseDescription"
        >
          {{ courseDescription }}
        </p>
        <div
          class="courseCardContainer"
          v-show="activeGrade.length > 0 && !isSelectGradeSoldOut"
        >
          <div
            v-for="(item, key) in activeGrade"
            :key="key"
            :class="[
              'courseCard',
              activeGrade.length === 3 ? 'courseCardThird' : 'courseCardTwo',
              key === activeKey && isSelectCourseSoldOut
                ? 'soldout'
                : key === activeKey && 'active'
            ]"
            @click="handleChooseCourse(key, item)"
          >
            <div class="gift" :class="{ hidden: !item.activity_name }">
              <div>{{ item.activity_name }}</div>
            </div>
            <p>{{ item.course_bag_name }}</p>
            <div class="priceBox">
              <div class="priceBox-first">
                <i>&yen;</i>
                <span class="total">{{ item.sale_price - 0 }}</span>
              </div>
              <div class="priceBox-second">
                <i>&yen;</i>
                <span class="per"
                  >{{ item.average_price }}/{{ item.unit }}</span
                >
              </div>
            </div>
          </div>
          <div class="cardDescription" v-show="isSelectCourseSoldOut">
            已售罄
            <span v-show="nextSaleStartTime">{{
              getDay(nextSaleStartTime)
            }}</span>
          </div>
        </div>
        <!-- 1.系统课年级没有售罄并且当前选择的课包没有售罄 -->
        <div
          class="boxBottom"
          v-if="!isSelectGradeSoldOut && !isSelectCourseSoldOut"
        >
          <div class="priceLeft2">
            <span v-show="activeCard.sale_price" class="price">
              <span>
                <i>&yen;</i>
                <em>
                  {{
                    formatNumber(activeCard.sale_price, activeCard.discount_num)
                  }}
                </em>
              </span>
            </span>
            <div
              v-show="Number(activeCard.discount_num) > 0"
              class="couponBgBox"
            >
              <span class="couponBg">
                已减免
                <i>{{ activeCard.discount_num }}</i
                >元
              </span>
            </div>
          </div>
          <van-button
            class="myBtn"
            color="#FF8A66"
            round
            size="normal"
            @click="handlePay"
            >去支付</van-button
          >
        </div>
        <!-- 1.系统课年级售罄并且没有订阅下次开售提醒并且有下次开售时间 -->
        <!-- 2.系统课年级没有售罄但是当前选择的课包售罄并且没有订阅下次开售提醒并且有下次开售时间 -->
        <div
          class="boxBottom"
          v-else-if="
            (isSelectGradeSoldOut ||
              (!isSelectGradeSoldOut && isSelectCourseSoldOut)) &&
              !subNextState &&
              nextSaleStartTime
          "
        >
          <van-button
            class="mySubscribeBtn"
            color="#FF8A66"
            round
            size="normal"
            @click="handleSubscribe"
            >订阅开售提醒</van-button
          >
        </div>
        <!-- 1.系统课年级售罄-->
        <!-- 2.当前选择的课包售罄-->
        <div
          class="boxBottom"
          v-else-if="isSelectGradeSoldOut || isSelectCourseSoldOut"
        >
          <van-button
            class="mySubscribeBtn"
            color="#EAEAEA"
            round
            size="normal"
            @click=""
            >{{ nextSaleStartTime ? '已订阅开售提醒' : '已售罄' }}</van-button
          >
        </div>
      </div>
      <!-- 系统课在读续费 -->
      <div v-else-if="Number(allSkuInfo.use_buy_type) === 3" class="box">
        <p v-show="!isSelectGradeSoldOut" class="title">
          选择课程包
        </p>
        <p class="courseDescription">系统将为您在当前课程后自动续课时</p>
        <div class="courseCardContainer">
          <div
            v-for="(item, key) in courses[
              allSkuInfo.sku[0] && allSkuInfo.sku[0].grade
            ]"
            :key="key"
            :class="[
              'courseCard',
              courses[allSkuInfo.sku[0] && allSkuInfo.sku[0].grade].length === 3
                ? 'courseCardThird'
                : 'courseCardTwo',
              key === activeRenewKey && isSelectCourseSoldOut
                ? 'soldout'
                : key === activeRenewKey && 'active'
            ]"
            @click="handleChooseCourse(key, item)"
          >
            <div class="gift" :class="{ hidden: !item.activity_name }">
              <div>
                {{ item.activity_name }}
              </div>
            </div>
            <p>{{ item.course_bag_name }}</p>
            <div class="priceBox">
              <div class="priceBox-first">
                <i>&yen;</i>
                <span class="total">{{ item.sale_price - 0 }}</span>
              </div>
              <div class="priceBox-second">
                <i>&yen;</i>
                <span class="per"
                  >{{ item.average_price }}/{{ item.unit }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="cardDescription" v-show="isSelectCourseSoldOut">
          已售罄
          <span v-show="nextSaleStartTime">{{
            getDay(nextSaleStartTime)
          }}</span>
        </div>
        <div class="boxBottom" v-if="!isSelectCourseSoldOut">
          <div class="priceLeft2">
            <span v-show="activeCard.sale_price" class="price">
              <span>
                <i>&yen;</i>
                <em>
                  {{ activeCard.sale_price - activeCard.discount_num }}
                </em>
              </span>
            </span>
            <div
              v-show="Number(activeCard.discount_num) > 0"
              class="couponBgBox"
            >
              <span class="couponBg">
                已减免
                <i>{{ activeCard.discount_num }}</i
                >元
              </span>
            </div>
          </div>
          <van-button
            class="myBtn"
            color="#FF8A66"
            round
            size="normal"
            @click="handlePay"
            >去支付</van-button
          >
        </div>
        <div class="boxBottom" v-else-if="!subNextState && nextSaleStartTime">
          <van-button
            class="mySubscribeBtn"
            color="#FF8A66"
            round
            size="normal"
            @click="handleSubscribe"
            >订阅开售提醒</van-button
          >
        </div>
        <div class="boxBottom" v-else>
          <van-button
            class="mySubscribeBtn"
            color="#EAEAEA"
            round
            size="normal"
            @click=""
            >{{ nextSaleStartTime ? '已订阅开售提醒' : '已售罄' }}</van-button
          >
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { storage, cut } from '@/utils/tool';
import { Popup } from 'vant';
import { getLocalToken, getUserType, getObjValue } from '@/utils/local';
import _ from 'lodash';
import {
  sensorsExperienceClass,
  sensorsBuyConfirm,
  sensorsSystemClass,
  sensorsSystemClassBuyconfitm,
  sensorsBuyConfirmBtn,
  sensorsSystemClassBuyconfitmPay
} from '@/trackPoint/trackPoint';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import { subscriber } from '@/api/course';
import { isWeiXin } from '@/utils/platformHelper';

export default {
  name: '',
  components: {
    Popup
  },
  props: {
    // 课程类型
    classType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ifShow: false,
      activeKey: 0, // 选中的卡片key
      activeRenewKey: -1, // 在读续费选中的卡片key
      gradeActiveKey: 0, // 选中的年级key
      activeGrade: [], // 选中的年级
      ifShowGrade: true, // 是否展示选择年级
      buy_state_exp: false, // 用户是否购买过体验课
      startTime: '',
      endTime: '',
      isSelectCardSoldOut: false, // 当前选择的卡片是否已经售罄
      isSelectGradeSoldOut: false, // 当前选择的级别是否已经售罄
      isSelectCourseSoldOut: false // 当前选择的课包是否已经售罄
    };
  },
  computed: {
    ...mapState('course', [
      'saleTime',
      'courseInfo',
      'allSkuInfo',
      'activeCard',
      'userGrade',
      'isLogin',
      'isOldUser',
      'subState',
      'hasBuyInfo',
      'userStatus',
      'pageLoading',
      'isSelling',
      'audioPlay',
      'nextSaleTime',
      'buttonType',
      'subNextState'
    ]),
    ...mapGetters('course', [
      'courses',
      'subject',
      'coursePeriods',
      'nextCoursePeriods',
      'courseStartDate',
      'activityInfo'
    ]),
    title() {
      return this.courseInfo.sale_period_info.sale_period.sale_period_num;
    },
    nextSaleStartTime() {
      return this.nextSaleTime;
    },
    courseDescription() {
      // 1 新用户 2 结课重购 3在读续费 4 已购完
      const courseDesMap = new Map([
        [2, '系统根据您的学习进度为您推荐以下课程包'],
        [3, '系统将为您在当前课程后自动续课时']
      ]);
      return courseDesMap.get(Number(this.allSkuInfo.use_buy_type));
    },
    isShowCourseDescription() {
      return (
        (Number(this.allSkuInfo.use_buy_type) === 2 &&
          this.courses[this.gradeActiveKey][0].is_learned) ||
        Number(this.allSkuInfo.use_buy_type) === 3
      );
    }
  },
  watch: {
    // userGrade(newVal) {
    //   const tmp = _.get(this.courses, newVal);
    //   if (tmp) {
    //     this.activeGrade = tmp;
    //     this.ifShowGrade = false;
    //     this.$store.commit('course/SET_ACTIVE_CARD', tmp[0]);
    //     // 判断默认的第一个是否售罄
    //     this.isSelectCourseSoldOut = tmp[0].sold_out;
    //     this.activeKey = 0;
    //   } else {
    //     console.log(
    //       '来自bottom的watch：是否购买过接口可能未找到该学员对应年级'
    //     );
    //     // this.$toast('未找到该学员对应年级');
    //   }
    // },
    ifShow(val) {
      if (val) {
        if (this.classType === 1) {
          sensorsBuyConfirm({
            purchase_status: this.courseInfo.purchase_status,
            subject: this.subject,
            course_periods: this.coursePeriods,
            course_startdate: this.courseStartDate
          });
        } else if (this.classType === 2) {
          sensorsSystemClassBuyconfitm({
            purchase_status: this.courseInfo.purchase_status,
            subject: this.subject,
            course_periods: this.coursePeriods,
            course_startdate: this.courseStartDate
          });
        }
      }
    }
  },
  created() {
    this.startTime = new Date().getTime();
    this.$store.commit('course/SET_ACTIVE_CARD', '');
    // 从上一页面返回，此时store中有信息
    // if (this.userGrade) {
    //   const tmp = _.get(this.courses, this.userGrade);
    //   console.log(tmp);
    //   if (tmp) {
    //     this.activeGrade = tmp;
    //     this.gradeActiveKey = this.userGrade;
    //     this.$store.commit('course/SET_ACTIVE_CARD', tmp[0]);
    //     this.activeKey = 0;
    //   } else {
    //     console.log(
    //       '来自bottom的created：是否购买过接口可能未找到该学员对应年级'
    //     );
    //     // this.$toast('未找到该学员对应年级');
    //   }
    // }
    // if (getLocalToken() && this.userStatus && this.isOldUser) {
    //   console.log('进入设置不显示年级');
    //   debugger;
    //   this.ifShowGrade = false;
    // }
  },
  methods: {
    // 解决剑法丢精度问题
    formatNumber(salePrice, couponValue) {
      return cut(salePrice, couponValue) < 0 ? 0 : cut(salePrice, couponValue);
    },
    getDay(time) {
      if (!time) {
        return '，下次开售提醒您';
      }
      time = time.replace(/-/g, '/');
      const date = new Date(time);
      let sTip = '，下次开售：';
      const hours =
        date.getHours() > 10 ? date.getHours() : '0' + date.getHours();
      const minutes =
        date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes();
      if (isToday(date)) {
        return sTip + '今日' + hours + ':' + minutes;
      } else if (isTomorrow(date)) {
        return sTip + '明日' + hours + ':' + minutes;
      } else {
        const month =
          date.getMonth() + 1 > 10
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1);
        const day = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
        return `${sTip}${month}月${day}日${hours}:${minutes}`;
      }
    },
    // 课选择年级
    handleChooseGrade(key, item) {
      console.log(key, item, 'key====');
      this.$store.commit('course/SET_CURRENT_GRADE', key);
      this.gradeActiveKey = key; // 选中的年级key
      if (this.classType === 1) {
        this.$store.commit('course/SET_ACTIVE_CARD', item[0]);
        // 判断是否售罄
        this.isSelectCardSoldOut = item[0].sold_out;
      } else if (this.classType === 2) {
        // 判断是否级别是否售罄，有一个课包没有售罄则级别没有售罄
        if (Array.isArray(item)) {
          const flag = item.some(item => {
            return !item.sold_out;
          });
          this.isSelectGradeSoldOut = !flag;
        }
        console.log('选择年级' + item);
        this.activeGrade = item;
        this.activeKey = 0;
        // 判断第一个是否售罄(ps:结课重构用户，判断当前选中是否学过，如果学过不判断是否售罄)
        this.isSelectCourseSoldOut = item[0].sold_out;
        if (this.allSkuInfo.use_buy_type === 2 && item.is_learned) {
          this.isSelectCourseSoldOut = false;
        }
        this.$store.commit('course/SET_ACTIVE_CARD', item[0]);
      }
    },
    // 选择课程
    handleChooseCourse(key, item) {
      console.log('选择课程' + item);
      // 区分在读续费
      if (Number(this.allSkuInfo.use_buy_type) === 3) {
        this.activeRenewKey = key;
      } else {
        this.activeKey = key;
      }
      this.isSelectCourseSoldOut = item.sold_out;
      if (this.allSkuInfo.use_buy_type === 2 && item.is_learned) {
        this.isSelectCourseSoldOut = false;
      }
      this.$store.commit('course/SET_ACTIVE_CARD', item);
    },
    // 点击订阅
    handleSubscribe() {
      if (!this.isLogin) {
        this.hadleGoToLogin();
      } else {
        const platform = localStorage.getItem('platform');
        // 点击订阅发送埋点数据
        if (Number(this.courseInfo.course_type) === 1) {
          this.sensorsBuyConfirmBtnHandle('订阅开售提醒');
        } else {
          this.sensorsSystemClassBuyconfitmPayHandle('订阅开售提醒');
        }
        if (platform === 'ios' || platform === 'android') {
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
          // this.getH5Qrcode({ sale_time: this.saleTime });
          // this.$refs.qrcodePopup.show = true;
        }
      }
    },
    // 体验课详情页选购页按钮埋点事件
    sensorsBuyConfirmBtnHandle(btnType) {
      sensorsBuyConfirmBtn({
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        course_periods: this.coursePeriods,
        course_level: this.activeCard.grade,
        course_startdate: this.courseStartDate,
        button_type: btnType
      });
    },
    // 系统课详情页选购页按钮埋点事件
    sensorsSystemClassBuyconfitmPayHandle(btnType) {
      sensorsSystemClassBuyconfitmPay({
        purchase_status: this.courseInfo.purchase_status,
        subject: this.subject,
        course_periods: this.coursePeriods,
        course_level: this.activeCard.grade,
        course_startdate: this.courseStartDate,
        button_type: btnType
      });
    },
    // 点击去支付
    handlePay() {
      this.endTime = new Date().getTime();
      if (this.classType === 1) {
        this.sensorsBuyConfirmBtnHandle('去支付');
      } else if (this.classType === 2) {
        this.sensorsSystemClassBuyconfitmPayHandle('去支付');
      }

      if (!this.activeCard) {
        this.$MkToast('请选择课程信息');
        return;
      }
      // const stock = _.get(
      //   _.find(this.courseInfo.stock, item => {
      //     return this.activeCard.grade === item.grade;
      //   }),
      //   'stock'
      // );
      // if (stock === 0 || !stock) {
      //   if (this.isOldUser && this.courseInfo.course_type === 2) {
      //     console.log('老用户续费');
      //   } else {
      //     this.$toast('剩余库存不足');
      //     return;
      //   }
      // }
      // 销售期Id
      const salePeriodId = getObjValue(
        this.courseInfo,
        'sale_period_info.sale_period.sale_period_id'
      );
      // if (this.isOldUser) {
      //   salePeriodId = this.hasBuyInfo.sale_period_id;
      // }
      storage.set('skuInfo', {
        ...this.activeCard,
        open_course_time_pay: this.activeCard.open_course_time,
        purchase_status: this.courseInfo.purchase_status,
        spu_id: this.courseInfo.spu_id,
        course_bag_name: this.courseInfo.course_name,
        course_type: this.courseInfo.course_type,
        subject_type: this.$route.query.subject_id,
        course_periods: this.coursePeriods,
        open_course_time: this.courseStartDate,
        id: salePeriodId,
        sale_period_type: this.courseInfo.sale_period_type,
        use_buy_type: this.courseInfo.use_buy_type
      });
      // eslint-disable-next-line camelcase
      const course_periods = this.coursePeriods;
      // eslint-disable-next-line camelcase
      const course_startdate = this.courseStartDate;
      // eslint-disable-next-line camelcase
      const banner_type = Number(this.courseInfo.banner_type);
      // eslint-disable-next-line camelcase
      const video_paly = this.audioPlay;
      // eslint-disable-next-line camelcase
      const channel_source = isWeiXin() ? '微信' : 'APP';
      // eslint-disable-next-line camelcase
      const course_orginalprice = Number(this.courseInfo.card_promotion_price);
      // eslint-disable-next-line camelcase
      const course_saleprice = Number(this.courseInfo.card_price);
      // eslint-disable-next-line camelcase
      const is_bottoming =
        localStorage.getItem('is_bottoming_experience') || false;
      // eslint-disable-next-line camelcase
      const is_activity_click = this.courseInfo.isActivityClick ? 1 : 0;

      if (this.classType === 1) {
        sensorsExperienceClass({
          stay_time: (this.endTime - this.startTime) / 1000,
          purchase_status: this.courseInfo.purchase_status,
          subject: this.subject,
          banner_type,
          course_periods,
          course_startdate,
          course_orginalprice,
          course_saleprice,
          activity_content: this.activityInfo.activity_desc,
          activity_link: this.activityInfo.activity_url,
          button_type: this.buttonType,
          video_paly,
          is_activity_click, // 是否点击活动位
          is_bottoming,
          channel_source
        });
      } else if (this.classType === 2) {
        sensorsSystemClass({
          stay_time: (this.endTime - this.startTime) / 1000,
          purchase_status: this.courseInfo.purchase_status,
          subject: this.subject,
          banner_type,
          course_periods,
          course_startdate,
          course_orginalprice,
          course_saleprice,
          activity_content: this.activityInfo.activity_desc,
          activity_link: this.activityInfo.activity_url,
          button_type: this.buttonType,
          video_paly,
          is_activity_click, // 是否点击活动位
          is_bottoming,
          channel_source
        });
      }
      this.$router.push({
        name: 'payment',
        query: {
          sourceId: this.$route.query.source_id,
          sourceType: this.$route.query.source_type
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  position: relative;
  padding: 60px 40px 30px;
  .title {
    font-size: 36px;
    font-weight: 600;
    color: #222;
    line-height: 40px;
  }
  .claTime {
    font-size: 32px;
    color: #666;
    line-height: 40px;
    margin-top: 20px;
    margin-bottom: 60px;
  }
  .courseDescription {
    margin-top: 20px;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .courseCardContainer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 30px;
    margin-top: 30px;
    .courseCard {
      width: 322px;
      height: 170px;
      background: rgba(247, 248, 250, 1);
      margin-top: 30px;
      border-radius: 10px;
      border: 1px solid transparent;
      font-size: 0;
      .hidden {
        visibility: hidden;
      }
      .gift {
        max-width: 100%;
        height: 44px;
        display: inline-block;
        padding: 6px 10px;
        border: 1px solid #ff8443;
        border-radius: 25px 25px 25px 0;
        background-color: #fff;
        div {
          max-width: 100%;
          height: 100%;
          font-size: 24px;
          font-weight: 400;
          color: #ff8443;
          font-family: PingFangSC-Regular, PingFang SC;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        position: relative;
        bottom: 22px;
        right: 1px;
      }
      p {
        margin-top: -14px;
        font-size: 30px;
        font-weight: 400;
        color: #222;
        line-height: 42px;
        padding-left: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .priceBox {
        padding-left: 20px;
        padding-right: 20px;
        .priceBox-first {
          i {
            font-family: QanelasSoftDEMO-Medium, QanelasSoftDEMO;
            color: #ff8443;
            font-size: 24px;
            font-weight: 500;
          }
        }
        .priceBox-second {
          font-size: 0;
          i {
            font-family: PingFangSC-Regular, PingFang SC;
            font-size: 24px;
            color: #666;
          }
        }
        .total {
          font-size: 56px;
          font-weight: bold;
          color: #ff8443;
          line-height: 68px;
          position: relative;
          font-family: QanelasSoftDEMO-Medium, QanelasSoftDEMO;
        }
        .per {
          font-size: 24px;
          color: rgba(102, 102, 102, 1);
          font-family: PingFangSC-Regular, PingFang SC;
        }
      }
    }
    // 课程包是两个
    .courseCard.courseCardTwo {
      width: 322px;
      height: 170px;
      .priceBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 14px;
      }
    }
    // 课程包是三个
    .courseCard.courseCardThird {
      width: 206px;
      height: 240px;
      .priceBox {
        margin-top: 24px;
        .priceBox-second {
          margin-top: 8px;
        }
      }
    }
    .courseCard.active {
      background: #fff5f2;
      border: 1px solid #ff6c48;
    }
    .courseCard.soldout {
      background: white;
      border: 1px dotted #ff8443;
    }
  }
  .cardContainer {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 50px;
    padding-top: 4px;
    .card {
      width: 320px;
      height: 100px;
      box-sizing: border-box;
      background: rgba(247, 248, 250, 1);
      border-radius: 10px;
      border: 1px solid transparent;
      margin-top: 26px;
      margin-right: 24px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.card:nth-child(even) {
        margin-right: 0;
      }

      p {
        color: rgba(34, 34, 34, 1);
        font-size: 28px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .card.active {
      background: rgba(255, 243, 236, 1);
      border: 1px solid rgba(255, 132, 67, 1);
      p {
        color: #ff6c48;
      }
    }
    .card.soldout {
      background: white;
      border: 1px dotted #ff8443;
      p {
        color: #ff8443;
      }
    }
  }
  .cardDescription {
    position: absolute;
    left: 0;
    bottom: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    background: rgba(255, 108, 72, 0.06);
    font-size: 26px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 108, 72, 1);
  }
  .boxBottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 70px;
    .priceLeft {
      height: 90px;
      display: flex;
      align-items: center;
      position: relative;
      top: 4px;
      // 93需求砍掉
      // .oldPrice {
      //   text-decoration: line-through;
      //   height: 28px;
      //   font-size: 28px;
      //   font-family: DINCondensed-Bold, DINCondensed;
      //   font-weight: bold;
      //   color: #999;
      //   position: relative;
      //   top: 14px;
      //   i {
      //     font-family: DINCondensed-Bold, DINCondensed;
      //     font-size: 16px;
      //     position: relative;
      //     left: 6px;
      //   }
      // }
      .newPrice {
        font-family: QanelasSoftDEMO-Medium, QanelasSoftDEMO;
        color: #f76561;
        font-size: 0;
        font-weight: 500;
        i {
          font-size: 30px;
          font-family: QanelasSoftDEMO-Medium, QanelasSoftDEMO;
        }
        span {
          font-size: 60px;
        }
      }
      .breaksPrice {
        font-family: PingFangSC-Regular, PingFang SC;
        color: white;
        font-size: 24px;
        padding: 4px 20px;
        border-radius: 20px 20px 20px 0;
        background-color: #f76561;
        margin-left: 6px;
      }
    }
    .priceLeft2 {
      display: flex;
      min-width: 320px;
      height: 100px;
      .price {
        display: flex;
        align-items: flex-end;
        font-size: 70px;
        font-family: DINCondensed-Bold, DINCondensed;
        font-weight: bold;
        color: #ff6c48;
        span {
          i {
            font-size: 30px;
            padding-top: 8px;
            margin-right: 6px;
          }
          display: flex;
          align-items: center;
        }
      }
      .couponBgBox {
        // min-width: 172px;
        display: flex;
        height: 42px;
        background-color: #ff6c48;
        border-radius: 20px 20px 20px 0;
        padding-right: 15px;
        padding-left: 15px;
        align-self: center;
        margin-left: 15px;
      }
      .couponBg {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        align-self: center;
        font-family: 'PingFangSC-Regular,PingFang SC';
        i {
          font-family: 'DIN Condensed Bold';
          // padding-top: 5px;
          position: relative;
          top: 2px;
        }
      }
    }
    .myBtn,
    .mySubscribeBtn {
      height: 100px;
      font-size: 36px;
      font-weight: 500;

      &.mySubscribeBtn {
        width: 100%;
      }
      .van-button__text {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    .myBtn {
      width: 240px;
    }
    .mySubscribeBtn {
      width: 300px;
    }
  }
}
@media screen and (min-width: 768px) {
  .box {
    max-height: 860px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .claTime {
      margin-top: 10px;
      margin-bottom: 40px;
    }
    .cardContainer {
      .card {
        margin-top: 10px;
        .grade {
          font-size: 22px;
        }
      }
    }
    .courseCardContainer {
      margin-bottom: 0;
      .courseCard {
        margin-top: 10px;
      }
    }
    .boxBottom {
      margin-top: 50px;
    }
  }
}
</style>
