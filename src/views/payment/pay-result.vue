<template>
  <div class="pay-result">
    <div v-show="!hasKey" class="status">
      <div class="succ" />
      <p>支付成功</p>
    </div>
    <div v-show="hasKey" class="block" />
    <div class="teacher">
      <div class="photo">
        <img class="photo-img" :src="result.headimg_url" alt />
        <div class="phote-label">
          <img src="~images/pay/zhuanshu.png" />
        </div>
      </div>
      <!-- <img class="photo" :src="result.wx_head" alt />  -->
      <div class="right">
        <p class="title">HI，{{ result.user_nickname }}</p>
        <p class="say">我是老师{{ result.teacher_nickname }}，将和你一起学习</p>

        <div v-if="platform !== 'ios' && platform !== 'android'" class="qrcode">
          <div class="qr">
            <img class="img" :src="result.qrcode_url" alt />
          </div>
          <div class="desc">
            <p>
              <img
                class="finger"
                src="@/assets/images/pay/finger@2x.png"
                alt
              />长按二维码
            </p>
            <p class="mt4">复制老师微信</p>
          </div>
        </div>
        <div v-else>
          <div
            class="add"
            :wx="result.wechat_no"
            @click="
              addWechat(
                result.wechat_no,
                result.sale_period_id,
                result.sku_type,
                result.teacher_nickname,
                result.teacher_name
              )
            "
          />
          <p class="friend">打开微信首页 - 右上角添加好友</p>
        </div>
      </div>
    </div>
    <div class="course">
      <div class="c-header">
        {{ title }}
        <!-- 系统课
        <span>S3-</span>第
        <span>18</span>期 -->
      </div>

      <div class="c-title">
        <span class="xline" />
        <span class="text">课程信息</span>
        <span class="xline" />
      </div>
      <div class="info">
        <div class="item" v-if="Number(skuInfo.use_buy_type) === 3">
          <span class="tt">剩余课时</span>
          <span class="cont char">{{ result.residue_course_num }}</span>
        </div>
        <div class="item" v-else>
          <span class="tt">开课时间</span>
          <span class="cont char">{{
            $formatTime(result.open_course_time, 'yy年MM月dd日')
          }}</span>
        </div>
        <div class="item">
          <span class="tt">专属老师</span>
          <span class="cont pingfang">
            <!-- <em class="char">{{result.teacher_name}}</em> -->
            {{ result.teacher_nickname }}
          </span>
        </div>
        <div v-if="platform === 'ios' || platform === 'android'" class="item">
          <span class="tt">上课APP</span>
          <span class="cont pingfang">
            小猴AI课APP
          </span>
        </div>
        <div v-else class="item">
          <span class="tt">上课APP</span>
          <span class="cont pingfang" @click="sensorsDownloadAppClickMethod">
            <a style="color:#209BFC;text-decoration:underline" href=""
              >小猴AI课APP</a
            >
          </span>
        </div>
      </div>
      <div class="c-title">
        <span class="xline" />
        <span class="text">随材寄送</span>
        <span class="xline" />
      </div>
      <div class="gift">
        <img :src="skuInfo['material_url']" alt />
      </div>
      <!-- 赠品寄送 -->
      <div
        v-show="
          skuInfo['activity_good_pic'] &&
            skuInfo['activity_good_pic'].length > 0
        "
      >
        <div class="c-title">
          <span class="xline" />
          <span class="text">赠品寄送</span>
          <span class="xline" />
        </div>
        <div
          class="gift giftPresent"
          v-for="(item, index) in skuInfo['activity_good_pic']"
          :key="index"
        >
          <img :src="item" alt />
        </div>
      </div>

      <div class="c-title">
        <span class="xline" />
        <span class="text">课程须知</span>
        <span class="xline" />
      </div>
      <div class="notice">
        <div class="n-title">上课方式</div>
        <p class="desc">
          在“我的课程”中，每日会收到学习任务卡片，按照任务顺序依次完成，老师会在微信中提供指导。
        </p>
        <div class="n-title">社群辅导服务</div>
        <p class="desc">
          家长添加辅导老师微信，老师将进行全程辅导（24小时内，老师会通过您的好友申请，节假日期间稍有延迟）。
        </p>
        <div class="n-title">问题咨询</div>
        <p class="desc">有任何疑问，可与客服或老师联系。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getPayResult } from 'api/pay/index';
import { webClose, addWechat } from '@/utils/jsBridge';
import {
  sensorsPaySuccess,
  sensorsDownloadAppClick,
  sensorsAddWeiXin,
  sensorsAddWeiXinShow
} from '@/trackPoint/trackPoint';
import { storage } from '@/utils/tool';

export default {
  data() {
    return {
      platform: localStorage.getItem('platform'),
      result: {}, // 教师信息
      skuInfo: [],
      hasKey: false,
      title: '' // 系统课S2-第12期
    };
  },
  async created() {
    // 无key就是0元购买
    let { orderId, uid, key } = this.$route.query;
    if (!key) {
      this.orderId = orderId;
      this.uid = uid;
      this.getData();
    } else {
      this.hasKey = true;
    }
    this.skuInfo = storage.get('skuInfo');
  },
  watch: {
    startRunSensors(val) {
      // 调用神策方法
      if (val) {
        this.sensorsPaySuccessHandler();
        this.sensorsAddWeiXinShowHanlder();
      }
    }
  },
  mounted() {
    this.webClose();
    this.registerH5Close();
  },
  computed: {
    startRunSensors() {
      return this.result.period_id;
    },
    course_type() {
      return Number(this.skuInfo['course_type']) === 2 ? '系统课' : '体验课'; // 课程类型
    },
    subject() {
      const subjectMap = new Map([
        [1, '语文'],
        [2, '思维'],
        [3, '英语']
      ]);
      return subjectMap.get(Number(this.skuInfo['subject_type']));
    }
  },
  methods: {
    sensorsAddWeiXinHandler() {
      try {
        sensorsAddWeiXin({
          subject: this.subject,
          course_type: this.course_type,
          course_number: this.skuInfo['duration'],
          course_periods: this.skuInfo['course_periods'], // 课程期数
          course_level: this.skuInfo['grade'], // 课程级别
          course_startdate: this.skuInfo['open_course_time'], // 开课日期
          teacher_name: this.result.teacher_name,
          teacher_wechat: this.result.teacher_wechat,
          previous_source: '支付页面'
        });
      } catch (error) {}
    },
    sensorsPaySuccessHandler() {
      try {
        sensorsPaySuccess({
          subject: this.subject,
          course_type: this.course_type, // 课程类型
          course_number: this.skuInfo['duration'],
          course_periods: this.skuInfo['course_periods'], // 课程期数
          course_level: this.skuInfo['grade'], // 课程级别
          course_startdate: this.skuInfo['open_course_time'], // 开课日期
          order_id: this.orderId, // 订单编号
          is_redeem: 0,
          teacher_name: this.result.teacher_name, // 教师姓名
          teacher_wechat: this.result.teacher_wechat // 教师微信号
        });
      } catch (error) {}
    },
    // 添加微信曝光
    sensorsAddWeiXinShowHanlder() {
      sensorsAddWeiXinShow({
        subject: this.subject,
        course_type:
          Number(this.skuInfo['course_type']) === 2 ? '系统课' : '体验课', // 课程类型
        course_number: this.skuInfo['duration'],
        course_periods: this.skuInfo['course_periods'], // 课程期数
        course_level: this.skuInfo['grade'], // 课程级别
        course_startdate: this.skuInfo['open_course_time'], // 开课日期
        teacher_name: this.result.teacher_name, // 教师姓名
        teacher_wechat: this.result.teacher_wechat, // 教师微信号
        previous_source: '支付页面'
      });
    },
    registerH5Close() {
      if (window.history && window.history.pushState) {
        window.addEventListener(
          'popstate',
          function(e) {
            // eslint-disable-next-line no-undef
            WeixinJSBridge.call('closeWindow');
          },
          false
        );
      }
    },
    // 添加微信
    // eslint-disable-next-line camelcase
    addWechat(
      teacher_wechat,
      period_id,
      course_type,
      teacher_nickname,
      teacher_name
    ) {
      addWechat(
        teacher_wechat,
        period_id,
        course_type,
        teacher_nickname,
        teacher_name,
        this.skuInfo.subject_type,
        '支付页面'
      );
      this.sensorsAddWeiXinHandler();
    },
    async getData() {
      try {
        let res = await getPayResult({
          orderId: this.orderId
        });
        if (res.code === 200) {
          const resBack = res.data;
          this.result = res.data;
          let courseType = '';
          if (Number(resBack.sku_type) === 1) {
            courseType = '体验课';
          } else if (Number(resBack.sku_type) === 2) {
            courseType = '系统课';
          }
          this.title = `${courseType}L${resBack.grade}-第${resBack.sale_period}期`;
        }
      } catch (e) {}
      window.scrollTo(0, 0);
    },
    webClose() {
      let toPath = '';
      webClose(toPath);
    },

    /**
     * @description 点击下载app的打点
     */
    sensorsDownloadAppClickMethod() {
      try {
        sensorsDownloadAppClick({
          order_id: this.orderId,
          teacher_name: this.result.teacher_name,
          teacher_wechat: this.result.teacher_wechat
        });
      } catch (error) {}
    }
  }
};
</script>

<style lang="less" scoped>
.block {
  height: 60px;
}
.pay-result {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  font-family: PingFangSC-Regular, PingFangSC;

  .status {
    padding: 60px 0px;
    text-align: center;
    font-size: 36px;
    color: #222;
    .succ {
      margin: 0 auto;
      width: 105px;
      height: 105px;
      display: block;
      background: url(~images/pay/success@2x.png) no-repeat;
      background-size: 100% 100%;
      margin-bottom: 28px;
    }

    p {
      width: 100%;
      height: 50px;
      font-size: 36px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(34, 34, 34, 1);
      line-height: 50px;
    }
  }
  .teacher {
    position: relative;
    width: 670px;
    height: 290px;
    background: #fff;
    border-radius: 30px;
    box-shadow: 0px 0px 50px rgba(34, 34, 34, 0.1);
    color: #222;
    font-size: 36px;
    margin: 0 40px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 40px 0;

    .photo {
      width: 170px;
      height: 170px;
      box-shadow: 0px 2px 30px 0px rgba(0, 0, 0, 0.06);
      border-radius: 85px;
      overflow: hidden;
      margin: 15px 40px 0 30px;
      img.photo-img {
        width: 100%;
        height: 100%;
      }
      .phote-label {
        position: absolute;
        left: 77px;
        top: 209px;
        width: 76px;
        height: 26px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .right {
      height: 100%;
      display: flex;
      flex-direction: column;
      .title {
        width: 384px;
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222;
        line-height: 45px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .say {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999;
        margin: 8px 0 20px;
        width: 384px;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 33px;
      }
      .add {
        width: 240px;
        height: 66px;
        background: url(~images/pay/add-wechat@2x.png) no-repeat;
        background-size: 100% 100%;
      }
      .friend {
        margin-top: 10px;
        height: 32px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999;
        line-height: 33px;
      }

      .qrcode {
        display: flex;
        justify-content: flex-start;
        .qr {
          width: 94px;
          height: 94px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url(~images/pay/border-qrcode@2x.png) no-repeat;
          background-size: 100% 100%;
          .img {
            width: 90%;
            height: 90%;
          }
        }
        .desc {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          color: #ff8a66;
          font-size: 24px;
          line-height: 33px;
          margin-left: 26px;
          .finger {
            width: 29px;
            height: 23px;
            margin-right: 2px;
          }
          .mt4 {
            margin-left: 5px;
          }
        }
      }
    }
  }
  .course {
    margin-top: 60px;
    padding: 0 40px 40px 40px;
    text-align: center;
    background: #f9f9f9;
    .c-header {
      display: inline-block;
      padding: 0 26px;
      height: 66px;
      background: #fff3ec;
      border-radius: 0px 0px 30px 30px;
      text-align: center;
      line-height: 66px;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #209bfc;
      span {
        font-family: QanelasSoftDEMO-Medium;
        font-weight: bold;
      }
    }
    .c-title {
      margin: 60px 0 30px;
      .xline {
        display: inline-block;
        width: 16px;
        height: 22px;
        background: url(~images/pay/xline@2x.png) no-repeat;
        background-size: 100% 100%;
        text-align: center;
      }
      .text {
        font-size: 32px;
        margin: 0 12px;
      }
    }
    .info {
      display: flex;
      justify-content: space-around;
      .item {
        width: 208px;
        height: 130px;
        border-radius: 10px;
        border: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .tt {
          font-size: 28px;
          color: #666;
          margin-bottom: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
        }
        .cont {
          font-size: 28px;
          color: #222;
        }
        .char {
          height: 40px;
          line-height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
        }
        .pingfang {
          height: 40px;
          font-size: 28px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: bold;
          color: rgba(34, 34, 34, 1);
          line-height: 40px;
        }
      }
    }
    .gift {
      width: 670px;
      height: 376px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5%;
      }
    }
    .gift.giftPresent {
      margin-bottom: 30px;
    }
    .notice {
      .n-title {
        color: #2e2b2f;
        font-size: 28px;
        text-align: left;
        margin-bottom: 10px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
      .n-title::before {
        content: '';
        display: inline-block;
        position: relative;
        left: -10px;
        top: 3px;
        width: 4px;
        height: 28px;
        background: url(~images/pay/sline@2x.png) no-repeat;
        background-size: 100% 100%;
      }
      .desc {
        color: #7a797b;
        font-size: 28px;
        line-height: 38px;
        margin-bottom: 28px;
        text-align: justify;
      }
    }
  }
}
</style>
