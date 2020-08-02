<template>
  <div class="payment">
    <div class="main">
      <div class="address" @click="chooseAddress">
        <p class="title">
          课程教材将寄送至此地址
        </p>
        <p v-if="addIsLoadOver" class="addrs">
          <template>
            <div v-if="address" class="add-container">
              <div class="left">
                <p>
                  <label>{{ user_name }}</label>
                  <label>{{ user_phone | formatPhone }}</label>
                </p>
                <p class="adress-detail">
                  {{ displayAddress }}
                </p>
              </div>
              <div class="right">
                <i />
              </div>
            </div>

            <span v-else class="add-con"> <i class="add" />添加收货地址 </span>
          </template>
        </p>
      </div>
      <div class="block" />
      <div class="order">
        <p class="title">
          订单信息
        </p>
        <div class="course">
          <span class="name">{{ skuInfo.course_bag_name }}</span>
          <span class="price">
            <em>¥</em>
            {{ skuInfo.sale_price }}
          </span>
        </div>
        <p class="time">
          <span>{{ courseBgTm[0] }}</span
          >月 <span>{{ courseBgTm[1] }}</span
          >日开课
        </p>
        <!-- 随材包 -->
        <div class="gift" @click="showFollowPicClick(skuInfo['material_url'])">
          <div class="left">
            <span class="icon" />
            <span class="name"
              >小猴{{ subject_ch }}{{ course_name }}随材包</span
            >
          </div>
          <div class="arrow">
            <img src="@/assets/images/pay/g-arrow@2x.png" alt />
          </div>
        </div>
        <!-- 赠品 -->
        <div
          class="gift"
          v-show="
            skuInfo['activity_good_pic'] &&
              skuInfo['activity_good_pic'].length > 0
          "
          v-for="(item, index) in skuInfo['activity_good_pic']"
          :key="index"
          @click="showFollowPicClick(item)"
        >
          <div class="left">
            <span class="icon" />
            <span class="name">
              {{
                skuInfo['activity_good_pic'].length > 1
                  ? skuInfo['activity_name'] + (index + 1)
                  : skuInfo['activity_name']
              }}
            </span>
          </div>
          <div class="arrow">
            <img src="@/assets/images/pay/g-arrow@2x.png" alt />
          </div>
        </div>
      </div>
      <div class="block" />
      <div v-if="hasCoupon" class="discount" @click="chooseGift">
        <p class="title">优惠信息</p>
        <div class="info">
          <div v-if="giftAmount > 0" class="left">
            优惠券已抵扣
            <span class="num">
              <em class="num-price">{{ giftAmount }}</em>
              <em class="yuan">元</em>
            </span>
          </div>
          <div v-else class="left">
            请选择优惠券
          </div>
          <div class="arrow">
            <img src="@/assets/images/pay/g-arrow@2x.png" alt />
          </div>
        </div>
      </div>

      <div v-else class="discount" @click="chooseGift">
        <p class="title">
          优惠信息
        </p>
        <div class="info">
          <div class="left">
            暂无优惠券
          </div>
          <div class="arrow">
            <img src="@/assets/images/pay/g-arrow@2x.png" alt />
          </div>
        </div>
      </div>
      <div class="block" />
      <div class="pay-type">
        <p class="title">
          支付方式
        </p>
        <div v-if="wxinstall == 1 || platform == 'h5'" class="item">
          <div class="left">
            <span class="icon wechat" />
            <span>微信钱包</span>
          </div>
          <div
            class="ckbox"
            :class="{ checked: pType == 1 }"
            @click="pType = 1"
          />
        </div>
        <div v-if="!isWeiXin()" class="item pt46">
          <div class="left">
            <span class="icon alipay" />
            <span>支付宝</span>
          </div>
          <div
            class="ckbox"
            :class="{ checked: pType == 2 }"
            @click="pType = 2"
          />
        </div>
      </div>
    </div>

    <div class="pay-bar">
      <div class="prices">
        <!-- <span v-if="giftAmount > 0" class="origin">
          <em class="small">¥</em>
          {{ skuInfo.sale_price }}
        </span> -->
        <span class="current">
          <em class="small">¥</em>
          <span class="current-price">{{ actualPrice }}</span>
        </span>
        <span class="breaksPrice" v-show="activeCard.discount_num">
          已减免{{ giftAmount }}元
        </span>
      </div>
      <div class="btn" @click="createOrderHandler">
        确认支付
      </div>
    </div>
  </div>
</template>

<script>
import { getPayStatus, createOrder, getBrandWCPayRequest } from 'api/pay/index';
import { ImagePreview, Dialog } from 'vant';
import { storage, cut, getQueryObj } from '@/utils/tool';
import { mapState } from 'vuex';
import {
  toAppPay,
  sendPurchaseResult,
  getAppPayWay,
  closeWebView,
  stopBack,
  cancelStopBack
} from '@/utils/jsBridge';
import {
  sensorsPayDetail,
  sensorsPayDetailConfirm
} from '@/trackPoint/trackPoint';
import { getPlatform, isWeiXin } from '@/utils/platformHelper';
import { getUserType } from '@/utils/local';
import _ from 'lodash';

export default {
  data() {
    return {
      user_name: '', // 用户名
      user_phone: '', // 电话
      pType: 1, // 1 微信，2 支付宝
      address: null,
      skuInfo: {},
      courseBgTm: [],
      giftAmount: 0, // 优惠金额
      actualPrice: 0,
      platform: localStorage.getItem('platform'),
      wxinstall: 0,
      hasCoupon: false,
      course_name: '', // 课程类型名称
      subject_ch: '',
      addIsLoadOver: false,
      imagePreviewObj: null,
      displayAddress: '',
      previousSource: '初始化' // 来源
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 判断当前页面来源
      if ('/personal/order/address-edit'.includes(from.path)) {
        vm.previousSource = '地址修改页';
      } else if ('/personal/coupon/list'.includes(from.path)) {
        vm.previousSource = '优惠券选择页';
      } else {
        vm.previousSource = '课程介绍页';
      }
      // 是否有优惠券
      vm.hasCoupon = vm.skuInfo['coupon'].length > 0;
      if (['/order/address-edit', '/coupon/list'].includes(from.path)) {
        vm.skuInfo['coupon'] = storage.get('couponIds');
        vm.giftAmount =
          parseFloat(storage.get('amount')) >
          parseFloat(vm.skuInfo['sale_price'])
            ? vm.skuInfo['sale_price']
            : storage.get('amount');
        vm.calcAmount();
      } else if (['/systemClass', '/experienceClass'].includes(from.path)) {
        vm.giftAmount =
          vm.skuInfo['sale_price'] > vm.skuInfo['discount_num']
            ? vm.skuInfo['discount_num']
            : vm.skuInfo['sale_price'];
        vm.calcAmount();
      } else {
        storage.remove('couponIds'); // 清除优惠券
        storage.remove('amount'); // 清除优惠券计算金额
      }
    });
  },
  computed: {
    ...mapState('course', ['allSkuInfo', 'activeCard'])
  },
  created() {
    this.$MkLoading.show({ forbidClick: true });

    this.getAddress();
    this.initInfo();

    // 获取用户是否安装微信和支付宝
    getAppPayWay(v => {
      console.log(v, '回调返回v');
      this.wxinstall = v.wxinstall;
    });

    // 如果是微信 则默认微信支付
    if (isWeiXin()) {
      this.pType = 1;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.sensorsPayDetailHandler();
    });
    // titleBar点击返回触发事件
    stopBack(async () => {
      try {
        await Dialog.confirm({
          title: '提示',
          message: '支付未完成，确认离开？'
        });
        // 清空订单地址
        let allSkuInfo = this.allSkuInfo;
        delete allSkuInfo.order_user_address;
        this.$store.commit('course/SET_SKU_INFO', allSkuInfo);
        // 取消禁止返回
        cancelStopBack();
        window.history.go(-1);
      } catch (error) {}
    });
  },

  methods: {
    isWeiXin() {
      return isWeiXin();
    },
    sensorsPayDetailHandler() {
      const envType = process.env.NODE_ENV;
      let platform;
      if (envType === 'test') {
        // 测试环境才数值格式
        platform = isWeiXin() ? 2 : 1;
      } else {
        // 正式环境才字符串格式
        platform = isWeiXin() ? '微信' : 'APP';
      }
      sensorsPayDetail({
        purchase_status: this.skuInfo.purchase_status,
        subject: this.subject_ch,
        course_type: this.course_name, // 课程类型
        course_number: this.skuInfo['duration'],
        course_periods: this.skuInfo['course_periods'], // 课程期数
        course_level: this.skuInfo['grade'], // 课程级别
        course_startdate: this.skuInfo['open_course_time'], // 开课日期
        coupon_amt: Number(this.giftAmount > 0 ? this.giftAmount : 0), // 优惠券累计优惠金
        pay_amt: this.actualPrice, // 支付金额
        pay_platform: platform, // 支付平台
        previous_source: this.previousSource // 上一步来源
      });
    },
    sensorsPayDetailConfirmHandler(orderId) {
      const payMethod = { 1: '微信', 2: '支付宝' };
      const envType = process.env.NODE_ENV;
      let platform;
      if (envType === 'test') {
        // 测试环境才数值格式
        platform = isWeiXin() ? 2 : 1;
      } else {
        // 正式环境才字符串格式
        platform = isWeiXin() ? '微信' : 'APP';
      }
      sensorsPayDetailConfirm({
        purchase_status: this.skuInfo.purchase_status,
        subject: this.subject_ch,
        course_type: this.course_name,
        course_number: this.skuInfo['duration'],
        course_periods: this.skuInfo['course_periods'], // 课程期数
        course_level: this.skuInfo['grade'], // 课程级别
        course_startdate: this.skuInfo['open_course_time'], // 开课日期
        order_id: orderId, // 订单编号
        coupon_amt: Number(this.giftAmount > 0 ? this.giftAmount : 0), // 优惠券累计优惠金
        pay_amt: this.actualPrice, // 支付金额
        pay_platform: platform, // 支付平台
        pay_method: payMethod[this.pType] // 支付方式
      });
    },
    showFollowPicClick(images) {
      this.imagePreviewObj = ImagePreview({
        images: [images],
        showIndex: false,
        className: 'myPreview'
      });
      this.$nextTick(() => {
        document
          .getElementsByClassName('myPreview')[0]
          .addEventListener('click', () => {
            if (this.imagePreviewObj) {
              this.imagePreviewObj.close();
            }
          });
      });
    },
    // toAppClass() {
    //   toAppClass("100400");
    // },
    // 获取商品信息
    initInfo() {
      const subjectMap = new Map([
        [1, '语文'],
        [2, '思维'],
        [3, '英语']
      ]);
      this.skuInfo = storage.get('skuInfo');
      // this.skuInfo["open_course_time"] = "2019-09-23 15:30:22";
      this.course_name =
        Number(this.skuInfo['course_type']) === 2 ? '系统课' : '体验课';
      this.subject_ch = subjectMap.get(Number(this.skuInfo['subject_type']));
      this.giftAmount =
        this.skuInfo['sale_price'] > this.skuInfo['discount_num']
          ? this.skuInfo['discount_num']
          : this.skuInfo['sale_price']; // 优惠金额
      this.skuInfo['coupon'] = this.skuInfo['coupon']
        ? this.skuInfo['coupon'].join(',')
        : '';
      this.formatMD();
      this.calcAmount();
    },
    createOrderHandler: _.debounce(
      function() {
        this.createOrder();
      },
      1500,
      {
        leading: true,
        trailing: false
      }
    ),
    // 下单
    async createOrder() {
      if (!this.address) {
        this.$MkToast({ type: 'warn', message: '请先添加收货地址' });
        return false;
      }

      this.$MkLoading.show({
        message: '正在生成订单',
        forbidClick: true
      });

      const from_user_id = storage.get('fromWhere')
        ? getQueryObj(storage.get('fromWhere')).fromUser
        : '';
      const platform = localStorage.getItem('platform') === 'ios' ? 2 : 1;
      const allSkuInfoUserAdress = this.allSkuInfo.order_user_address
        ? this.allSkuInfo.order_user_address
        : this.allSkuInfo.user_address;
      let data = {
        uid: '234234',
        order_type: this.skuInfo['course_type'], // 订单类型
        order_attribute: this.skuInfo['order_attribute'], // 订单属性
        order_from: platform, // 订单来源
        sku_id: this.skuInfo['sku_id'], // 商品id
        spu_id: this.skuInfo['spu_id'], // spuid
        coupon_ids: this.skuInfo['coupon'],
        order_amount: this.skuInfo['sale_price'], // 订单金额
        discount_amount: this.giftAmount, // 	折扣金额
        pay_channel: this.pType, // 支付渠道：1:微信 2:支付宝
        pay_method: getPlatform() === 'app' ? 2 : 3, // 支付方式
        sale_period_id: this.skuInfo['id'], // 	销售期id
        activity_id: this.skuInfo['activity_id'], // 商品的活动ID
        order_channel: getPlatform() === 'app' ? 3 : 2, // 订单渠道 ???
        user_buy_state: this.allSkuInfo['use_buy_type'],
        duration: this.skuInfo['duration'], // 购课时长
        course_type: this.skuInfo['course_type'], // 课程类型
        sku_num: this.skuInfo['sku_num'], // 课包得数量
        province_name: allSkuInfoUserAdress.province_name,
        city_name: allSkuInfoUserAdress.city_name,
        district_name: allSkuInfoUserAdress.county_name,
        detailed_address: allSkuInfoUserAdress.detail,
        addressee_name: this.user_name,
        mobile: this.user_phone,
        full_address: this.displayAddress,
        full_code:
          allSkuInfoUserAdress.province +
          ' ' +
          allSkuInfoUserAdress.city +
          ' ' +
          allSkuInfoUserAdress.county,
        grade: this.skuInfo['grade'],
        course_id: this.skuInfo.course_id,
        exchange_code: '',
        integral: '',
        hot_url: '',
        source_id: this.$route.query.sourceId,
        source_type: this.$route.query.sourceType,
        open_course_time: this.skuInfo['open_course_time_pay'],
        from_course: this.skuInfo['from_course']
      };
      let res = await createOrder(data);
      const code = res.code;
      const payRoute = res.data.pay_route; // 需要跳转第三方支付
      const orderId = res.data.order_id;
      if (code === 200) {
        this.$MkLoading.hide();
        // 数据埋点
        // this.sensorsPayDetailConfirmHandler(orderId);
        // 微信或者支付宝支付
        if (payRoute === 1) {
          storage.set('resData', res.data);
          this.callPay(res.data);
        } else if (payRoute === 2) {
          // 0元支付
          this.sendPurchaseFun(1);
          this.forwordPaySuccess(orderId);
        }
      }
    },
    // 成功页面跳转
    forwordPaySuccess(orderId) {
      // 取消禁止返回
      cancelStopBack();
      this.$router.push({
        path: '/payRes',
        query: {
          orderId: orderId,
          uid: localStorage.getItem('userId'),
          courseType: this.skuInfo.course_type
        }
      });
    },
    getOrderFrom(platform) {
      let orderFrom;
      switch (platform) {
        case 'ios':
          orderFrom = 2;
          break;
        case 'android':
          orderFrom = 1;
          break;
        case 'h5':
          orderFrom = 3;
          break;
        default:
          orderFrom = 3;
          break;
      }
      return orderFrom;
    },
    getPayMethod(platform) {
      let payMethod = 1;
      switch (platform) {
        case 'ios':
          payMethod = 2;
          break;
        case 'android':
          payMethod = 2;
          break;
        case 'h5':
          payMethod = 3;
          break;
        default:
          payMethod = 1;
          break;
      }
      return payMethod;
    },

    toastQueryPayResult() {
      this.$MkLoading.show({
        forbidClick: true,
        message: '正在查询支付状态'
      });
    },

    // 调用支付
    callPay(data) {
      let option = {};
      let that = this;
      // 支付成功回调
      option['callback'] = status => {
        this.toastQueryPayResult();
        setTimeout(function() {
          that.getPayStatus({
            orderId: data.order_id
          });
        }, 1000);
      };
      if (this.platform === 'h5') {
        const payData = data.pay_data;
        for (let key in payData) {
          option[key] = payData[key];
        }
        getBrandWCPayRequest(option);
      } else if (this.platform === 'android' || this.platform === 'ios') {
        let payData = data.pay_data;
        let channels = { 1: 'wxpay', 2: 'alipay' };
        option['channel'] = channels[this.pType];
        option['order'] = data.pay_data + '';

        option['partnerId'] = payData.partnerid; // 商户id
        option['prepayId'] = payData.prepayid; // 预支付会话id
        option['nonceStr'] = payData.noncestr; // 随机串
        option['timeStamp'] = payData.timestamp; // 时间戳
        option['sign'] = payData.sign; // 签名
        toAppPay(option);
      }
    },
    // 计算优惠后金额
    calcAmount() {
      this.actualPrice = cut(this.skuInfo.sale_price, this.giftAmount);
      this.actualPrice = this.actualPrice < 0 ? 0 : this.actualPrice;
    },
    // 格式化开课日期
    formatMD() {
      let date = new Date(this.skuInfo['open_course_time'].replace(/-/g, '/'));
      this.courseBgTm = [date.getMonth() + 1, date.getDate()];
    },
    // 获取支付状态
    async getPayStatus(param) {
      try {
        let res = await getPayStatus(param);
        this.$MkLoading.hide();
        if (Number(res.code) === 200 && Number(res.data.pay_status) === 200) {
          this.sendPurchaseFun(1);
          this.forwordPaySuccess(param.orderId);
        } else if (
          Number(res.code) === 200 &&
          Number(res.data.pay_status === 300)
        ) {
          this.$MkToast({ type: 'warn', message: res.msg });
          this.sendPurchaseFun(0);
        } else {
          // this.sendPurchaseFun(0);
          this.payNotComfirmDialog(param);
          // Toast.fail("支付结果未确认");
        }
      } catch (e) {
        this.$MkLoading.hide();
        this.payNotComfirmDialog(param);
      }
    },
    // 支付未确认情况
    payNotComfirmDialog(param) {
      Dialog.confirm({
        title: '未获取到支付结果',
        message:
          '暂未获取到支付结果，若已经扣款成功，请勿重复支付；您可重新获取结果或到课程页查看购买结果',
        confirmButtonText: '重新获取',
        cancelButtonText: '关闭',
        confirmButtonColor: '#FF8A66',
        cancelButtonColor: '#222222'
      })
        .then(() => {
          Dialog.close();
          this.toastQueryPayResult();
          this.getPayStatus(param);
        })
        .catch(() => {
          Dialog.close();
          const platform = getPlatform();
          if (platform === 'app') {
            closeWebView();
          } else if (platform === 'h5_weixin') {
            // eslint-disable-next-line no-undef
            WeixinJSBridge.call('closeWindow');
          } else {
          }
        });
    },
    sendPurchaseFun(res) {
      const payload = {
        courseType: this.skuInfo.course_type,
        result: res
      };
      sendPurchaseResult(payload);
    },
    // 选择支付类型
    changePayType(type) {
      this.pType = type;
    },
    // 选择地址
    chooseAddress() {
      // 取消禁止返回
      cancelStopBack();
      storage.set('couponIds', this.skuInfo['coupon']);
      storage.set('amount', this.giftAmount);

      if (this.address) {
        const allSkuInfoUserAdress =
          this.allSkuInfo.order_user_address &&
          Object.keys(this.allSkuInfo.order_user_address).length > 0
            ? this.allSkuInfo.order_user_address
            : this.allSkuInfo.user_address;
        const data = JSON.stringify(allSkuInfoUserAdress);
        this.$router.push({
          path: '/order/address-edit',
          query: {
            data
            // goodsId: this.skuInfo.product_code,
            // goodsName: this.skuInfo.product_name
          }
        });
      } else {
        this.$router.push({
          path: '/order/address-edit'
          // query: {
          //   goodsId: this.skuInfo.product_code,
          //   goodsName: this.skuInfo.product_name
          // }
        });
      }
    },
    // 获取收货地址和用户信息
    async getAddress() {
      try {
        const allSkuInfoUserAdress = this.allSkuInfo.order_user_address
          ? this.allSkuInfo.order_user_address
          : this.allSkuInfo.user_address;
        this.address =
          allSkuInfoUserAdress && Object.keys(allSkuInfoUserAdress).length > 0;
        if (
          allSkuInfoUserAdress &&
          Object.keys(allSkuInfoUserAdress).length > 0
        ) {
          this.user_name = allSkuInfoUserAdress.name;
          this.user_phone = allSkuInfoUserAdress.phone;
          this.displayAddress =
            allSkuInfoUserAdress.province_name +
            ' ' +
            allSkuInfoUserAdress.city_name +
            ' ' +
            allSkuInfoUserAdress.county_name +
            ' ' +
            allSkuInfoUserAdress.detail;
        }
        this.$MkLoading.hide();
      } catch (e) {}
      this.addIsLoadOver = true;
    },
    // 去选择优惠券
    chooseGift() {
      // 取消禁止返回
      cancelStopBack();
      this.$router.push({
        path: `/coupon/list`,
        query: {
          couponIds: this.skuInfo.coupon,
          useCouponType: this.skuInfo['course_type'],
          type: 'edit',
          orderAmount: this.skuInfo['sale_price'],
          purchaseStatus: this.skuInfo.purchase_status
        }
      });
    },
    // 获取优惠券信息
    getCouponInfo() {
      const couponId =
        this.skuInfo['coupon_info'][0] && this.skuInfo['coupon_info'][0].id
          ? this.skuInfo['coupon_info'][0].id
          : '';
      const couponRuleId =
        this.skuInfo['coupon_info'][0] &&
        this.skuInfo['coupon_info'][0].coupon_rule_id
          ? this.skuInfo['coupon_info'][0].coupon_rule_id
          : '';
      const couponName =
        this.skuInfo['coupon_info'][0] && this.skuInfo['coupon_info'][0].name
          ? this.skuInfo['coupon_info'][0].name
          : '';
      const couponAmount =
        this.skuInfo['coupon_info'][0] && this.skuInfo['coupon_info'][0].amount
          ? this.skuInfo['coupon_info'][0].amount
          : '';
      const couponExpireAt =
        this.skuInfo['coupon_info'][0] &&
        this.skuInfo['coupon_info'][0].expire_at
          ? this.skuInfo['coupon_info'][0].expire_at
          : '';
      const couponInfo = couponRuleId
        ? `${couponId}-${couponRuleId}-${couponName}-${couponAmount}-${couponExpireAt}`
        : '无优惠券可用'; // 优惠券使用信息 优惠券规则ID-优惠券项目名称-优惠券金额-优惠券有效期
      return couponInfo;
    }
  }
};
</script>

<style lang="less" scoped>
.payment {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  // padding: 40px 0;
  background-color: #fff;
  font-family: PingFangSC-Regular, PingFangSC;
  .main {
    height: calc(100vh-180px);
    padding-top: 40px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .block {
      width: 100%;
      height: 20px;
      background: #fafafa;
    }
    .title {
      color: #999;
      font-size: 28px;
    }
    .address {
      padding: 0 40px;
      padding-bottom: 40px;
      .addrs {
        color: #ff8443;
        font-size: 30px;
        margin-top: 30px;

        .add-container {
          display: flex;
          .left {
            flex: 1;
            p:first-child {
              height: 42px;
              line-height: 42px;

              label:first-child {
                float: left;
                height: 42px;
                font-size: 30px;
                font-weight: 400;
                color: rgba(34, 34, 34, 1);
                line-height: 42px;
                padding-right: 20px;
              }

              label:last-child {
                float: left;
                font-size: 34px;
                font-family: QanelasSoftDEMO-Medium;
                font-weight: bold;
                color: rgba(34, 34, 34, 1);
                padding-top: 6px;
              }
            }

            p:last-child {
              line-height: 42px;
              font-size: 30px;
              font-weight: 400;
              color: rgba(34, 34, 34, 1);
              width: 480px;
            }
            .adress-detail {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }

          .right {
            line-height: 94px;
            color: rgba(102, 102, 102, 1);
            display: flex;
            align-items: center;

            label {
              // width:60px;
              height: 42px;
              font-size: 30px;
              font-family: PingFangSC-Regular, PingFangSC;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              line-height: 42px;
            }
            i {
              margin-left: 10px;
              width: 18px;
              height: 32px;
              background: url('~images/pay/g-arrow@2x.png') no-repeat;
              background-size: 17px 32px;
              display: block;
              vertical-align: middle;
              margin-top: 2px;
            }
          }
        }

        .add-con {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .add {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: url(~images/pay/ad-address@2x.png) no-repeat;
            background-size: 100% 100%;
            margin-right: 6px;
          }
        }
      }
    }
    .order {
      padding: 40px;
      .course {
        margin: 28px 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 36px;
        .name {
          display: inline-block;
          width: 500px;
          color: #0c100f;
          font-size: 36px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: PingFangSC-Semibold, PingFangSC;
          font-weight: bold;
        }
        .price {
          font-family: QanelasSoftDEMO-Medium;
          font-weight: bold;
          padding-top: 10px;
          em {
            font-size: 24px;
          }
        }
      }
      .time {
        font-size: 30px;
        color: #666;
        span {
          font-size: 34px;
          font-family: QanelasSoftDEMO-Medium;
          font-weight: bold;
        }

        span:last-child {
          margin-left: -7px;
        }
      }
      .gift {
        padding: 30px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
          .icon {
            display: inline-block;
            width: 42px;
            height: 42px;
            background: url(~images/pay/gift@2x.png) no-repeat;
            background-size: 100% 100%;
          }
          .name {
            margin-left: 19px;
            display: inline-block;
            width: 420px;
            color: #666;
            font-size: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 42px;
          }
        }
        .arrow {
          display: inline-block;
          width: 18px;
          height: 32px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .discount {
      padding: 40px;
      .info {
        padding-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          color: #222;
          font-size: 30px;
          .num {
            color: #ff8443;
            font-family: QanelasSoftDEMO-Medium;
            em.num-price {
              font-size: 36px;
              font-weight: bold;
              vertical-align: middle;
              display: inline-block;
              margin-top: 3px;
            }

            em.yuan {
              font-size: 30px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
            }
          }
        }
        .arrow {
          display: inline-block;
          width: 18px;
          height: 32px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .pay-type {
      padding: 40px 40px 60px;
      .item {
        padding-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
          color: #222;
          font-size: 30px;
          .icon {
            width: 58px;
            height: 58px;
            margin-right: 30px;
          }
          .wechat {
            background: url(~images/pay/wechat@2x.png) no-repeat;
            background-size: 100% 100%;
          }
          .alipay {
            background: url(~images/pay/alipay@2x.png) no-repeat;
            background-size: 100% 100%;
          }
        }
        .ckbox {
          width: 40px;
          height: 40px;
          background: url(~images/pay/uncheck@2x.png) no-repeat;
          background-size: 100% 100%;
        }
        .checked {
          background: url(~images/pay/checked@2x.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      .pt46 {
        padding-top: 46px;
      }
    }
  }

  .pay-bar {
    display: flex;
    // flex: 1;
    height: 180px;
    // margin-top: 40px;
    justify-content: space-between;
    align-items: center;
    padding-left: 40px;
    padding-right: 40px;
    .prices {
      color: #999;
      transform: translateY(4px);
      display: flex;
      align-items: center;
      .origin {
        font-size: 28px;
        text-decoration: line-through;
      }
      .current {
        color: #f76561;
        font-size: 0;
        font-weight: 500;
        font-family: QanelasSoftDEMO-Medium, QanelasSoftDEMO;
        .small {
          font-size: 30px;
        }
        .current-price {
          font-size: 60px;
          display: inline-block;
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

    .btn {
      width: 240px;
      height: 100px;
      line-height: 100px;
      background: #ff8a66;
      text-align: center;
      border-radius: 50px;
      font-size: 36px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fff;
    }
  }
}
</style>
