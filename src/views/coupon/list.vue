<template>
  <div v-if="isLoadOver" class="wrapper">
    <ul v-if="list.length > 0" class="container">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="row"
        @click="checkCoupon(item)"
      >
        <div class="bg img" :class="{ op: item.disabled }">
          <div class="left">
            <div>
              <span>&yen;</span>
              <span>{{ item.amount }}</span>
            </div>
          </div>
          <div class="right">
            <p class="title">{{ item.name }}</p>
            <p class="date">
              <span class="create-at">
                {{ item.created_at | formatDate }}-{{
                  item.expire_at | formatDate
                }}
              </span>
              <span
                v-if="
                  new Date(item.expire_at.replace(/\-/g, '/')).getTime() -
                    new Date().getTime() >=
                    24 * 60 * 60 * 1000
                "
                class="exprite-at"
              >
                仅剩
                <i class="day-num">{{ item.expire_at | relativeDate }}</i
                >天
              </span>
              <span v-else class="exprite-at">不足1天</span>
            </p>
            <p class="remark">{{ item.remark }}</p>
          </div>
        </div>
        <div v-if="type !== 'list'" class="icon">
          <i v-if="couponIds.includes(item.id)" class="checked" />
          <i v-else class="unchecked" />
        </div>
      </li>
    </ul>
    <div v-if="list.length > 0 && type !== 'list'" class="foot">
      <a class="btn" @click="verify()">确定</a>
    </div>
    <div v-if="list.length == 0" class="no-data">
      <div class="img-con">
        <img src="@/assets/images/personal/coupon/no_coupon@2x.png" />
      </div>
      <p>您还没有优惠券~</p>
    </div>
  </div>
</template>
<script>
import { list } from '@/api/personal/coupon';
import { formatNumber, storage, add } from '@/utils/tool';
import getTime from 'date-fns/getTime';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { userCenterCoupon } from '@/trackPoint/trackPoint';
import {
  sensorsExchangeCode,
  sensorsCouponSelect,
  sensorsChooseCouponRedeem,
  sensorsChooseCouponConfirm
} from '@/trackPoint/tpExchangeCode'; // 兑换码埋点
import { Dialog } from 'vant';
import { getUserType } from '@/utils/local';

export default {
  name: 'CouponList',
  filters: {
    formatDate: function(value) {
      // eslint-disable-next-line no-useless-escape
      const date = format(new Date(value.replace(/\-/g, '/')), 'yyyy.MM.dd');
      return value ? date : '';
    },
    relativeDate: function(value) {
      // 获得两个时间的时间段
      return value
        ? differenceInCalendarDays(
            // eslint-disable-next-line no-useless-escape
            new Date(value.replace(/\-/g, '/')).getTime(),
            getTime(new Date())
          )
        : '';
    }
  },
  data() {
    return {
      isLoadOver: false, // 是否渲染页面
      type: this.$route.query.type || 'list',
      uid: localStorage.getItem('userId') || 0,
      useCouponType: this.$route.query.useCouponType || null, // 当前课程类型（体验课|系统课）
      orderAmount: this.$route.query.orderAmount || '', // 订单金额
      purchaseStatus: this.$route.query.purchaseStatus || '', // 当前用户购买状态
      couponIds: [], // 当前选择的优惠券
      couponRows: [], // 已经选中的优惠券数组
      list: [] // 所有的优惠券
    };
  },
  created() {
    let couponIds = this.$route.query.couponIds;
    if (couponIds) {
      this.couponIds.push(...this.convertArrStrToNumber(couponIds.split(',')));
    }
    this.initData();
  },
  mounted() {
    // lert("1")
    this.getUserType();
  },
  beforeRouteLeave(to, from, next) {
    this.setCoupons();
    next();
  },
  methods: {
    // 是否购买过
    async getUserType() {
      /** 优惠券选择页 埋点 */
      sensorsCouponSelect({
        purchase_status: this.purchaseStatus
      });
    },
    convertArrStrToNumber(arr) {
      for (let index = 0; index < arr.length; index++) {
        arr[index] = Number(arr[index]);
      }
      return arr;
    },
    async initData() {
      try {
        const { subject_type, sale_price } = storage.get('skuInfo');
        const params = {
          type: 'use',
          subject_id: subject_type,
          course_type: this.useCouponType,
          sale_price
        };
        let data = await list(params);
        this.list = data.data;
        if (this.orderAmount) {
          this.list = data.data.filter(item => {
            return Number(this.orderAmount) >= Number(item.full_amount);
          });
          this.getUserType();
        }
      } catch (e) {}
      this.isLoadOver = true;
      if (this.type === 'list') {
        this.calcuCoupon();
      } else {
        // 初始化已经选中的优惠券数组
        this.couponRows = this.list.filter(item => {
          return this.couponIds.includes(item.id);
        });
        this.setDisabledCoupon();
      }
    },
    calcuCoupon() {
      const sumAmount = this.list.reduce((prev, cur) => {
        return add(cur.amount, prev);
      }, 0);
      let couponStr = ``;
      if (Array.isArray(this.list)) {
        this.list.forEach(item => {
          couponStr += `${item.coupon_id}-${item.coupon_rule_id}-${item.name}-${item.amount}-${item.created_at}-${item.expire_at}`;
        });
      }
      userCenterCoupon({
        coupon_number: this.list.length,
        coupon_amt: sumAmount,
        coupon_list: couponStr
      });
    },
    checkCoupon(row) {
      if (this.type === 'list' || row.disabled) {
        return;
      }

      const index = this.couponIds.indexOf(row.id);
      if (index > -1) {
        this.couponIds.splice(index, 1);
        this.couponRows.splice(index, 1);
      } else {
        this.couponIds.push(row.id);
        this.couponRows.push(row);
      }
      this.setDisabledCoupon(row);
    },
    setDisabledCoupon(row) {
      // 当前选中的优惠券是否能叠加使用
      // let arr = this.couponRows.filter(item => {
      //   return item.is_overlay === 2;
      // });

      // 是否允许叠加使用
      if (row && row.is_overlay === 2) {
        if (this.couponRows.length > 0) {
          this.list.map(item => {
            if (item.id !== row.id) {
              item.disabled = true;
            }
          });
        } else {
          this.clearCheck();
        }
      } else {
        if (this.couponRows.length > 0) {
          const arrs = this.couponRows.filter(item => {
            return item.is_overlay === 2;
          });

          if (arrs.length === 1) {
            this.list.map(item => {
              if (arrs[0].id !== item.id) {
                item.disabled = true;
              }
            });
          } else {
            this.list.map(item => {
              if (item.is_overlay === 2) {
                item.disabled = true;
              }
            });
          }
        } else {
          this.clearCheck();
        }
      }
    },
    clearCheck() {
      this.list.map(item => {
        item.disabled = false;
      });
    },
    setCoupons() {
      storage.set('couponIds', this.couponIds.join(','));
      storage.set('amount', this.sumAmount());
    },
    verify() {
      // **优惠券选择页_确定 埋点 */
      sensorsChooseCouponConfirm({
        purchase_status: this.purchaseStatus
      });
      this.$router.go(-1);
    },
    sumAmount() {
      if (!this.list || this.couponIds.length === 0) {
        return;
      }
      let amount = 0;
      this.list.forEach(row => {
        if (this.couponIds.includes(row.id)) {
          amount = add(amount, row.amount);
        }
      });

      return amount;
    }
  }
};
</script>

<style lang="less" scoped>
div.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.invite-content {
  // margin: 88px 40px 0 40px;
  //padding-bottom: 70px;
  height: 178px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  .invite-ipt {
    width: 410px;
    height: 90px;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    font-family: PingFangSC-Regular, sans-serif;
    font-size: 30px;
    color: #999;
    padding-left: 34px;
    -webkit-appearance: none;
  }
  .invite-btn {
    width: 240px;
    height: 90px;
    background: url('~images/personal/coupon/invite-btn@2x.png');
    background-size: 100% 100%;
    font-size: 36px;
    color: #fff;
    margin-left: 20px;
  }
  .focus {
    border: 1px solid #ff6c48;
  }
}
.overdue-wrap {
  position: absolute;
  left: 40px;
  bottom: -45px;
  height: 33px;
  line-height: 33px;
  display: flex;
  .overdue-bg {
    width: 24px;
    height: 24px;
    background: url('~images/personal/coupon/overdue@2x.png');
    background-size: 100% 100%;
    margin-right: 10px;
    margin-top: 4px;
  }
  .overdue-content {
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 24px;
    color: #ff6c48;
  }
}
div.no-data {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .img-con {
    width: 412px;
    height: 290px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    padding-top: 60px;
    height: 40px;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 40px;
  }
}

div.foot {
  // margin-bottom:120px;
  height: 160px;
  width: 100%;
  text-align: center;
  // padding-top: 30px;
  .btn {
    margin: 0 auto;
    // background: url("~images/personal/coupon/btn-bg@2x.png");
    // background-size: 100%;
    display: block;
    width: 670px;
    line-height: 100px;
    height: 100px;
    border-radius: 50px;
    font-size: 36px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    background: #ff6478;
  }
}

ul.container {
  margin-top: 42px;
  margin-bottom: 67px;
  flex: 1;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  // min-height: calc(100vh - 80px);
  li.row {
    height: 258px;
    width: 100%;
    padding: 0 10px;
    margin-bottom: 50px;
    position: relative;

    .icon {
      position: absolute;
      top: 77px;
      right: 80px;
      i {
        width: 40px;
        height: 40px;
        display: block;
      }

      i.checked {
        background: url('~images/personal/coupon/checked@2x.png');
        background-size: 100%;
      }

      i.unchecked {
        background: url('~images/personal/coupon/unchecked@2x.png');
        background-size: 100%;
      }
    }

    div.img {
      background: url('~images/personal/coupon/bg@2x.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    // @media only screen and (-webkit-min-device-pixel-ratio: 2) {
    //   div.img {
    //     background: url("~images/personal/coupon/bg@2x.png");
    //     background-size: 100% 100%;
    //     background-repeat: no-repeat;
    //   }
    // }
    // @media only screen and (-webkit-min-device-pixel-ratio: 3) {
    //   div.img {
    //     background: url("~images/personal/coupon/bg@2x.png");
    //     background-size: 100% 100%;
    //     background-repeat: no-repeat;
    //   }
    // }

    div.op {
      opacity: 0.6;
    }

    div.bg {
      display: flex;
      flex-direction: row;
      height: 338px;

      .left {
        height: 100%;
        width: 247px;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        div {
          display: flex;
          justify-content: center;
          width: 187px;
          margin-right: 10px;
          padding-top: 10px;

          span:first-child {
            // width: 15px;
            // height: 35px;
            font-size: 30px;
            font-family: DINCondensed;
            font-weight: bold;
            color: #fff;
            // line-height: 35px;
            // margin-left: 82px;
            position: relative;
            margin-top: 38px;
          }

          span:last-child {
            // width: 154px;
            // margin-left: -15px;
            // height: 93px;
            font-size: 80px;
            font-family: DINCondensed;
            font-weight: bold;
            color: #fff;
            // line-height: 93px;
            // text-align: center;
            // padding-top: 10px;
            margin-left: 5px;
          }
        }
      }

      .right {
        flex: 2;
        padding-left: 52px;
        display: flex;
        flex-direction: column;
        margin-top: 74px;
        .title {
          width: 315px;
          height: 50px;
          font-size: 36px;
          font-family: PingFangSC-Medium, PingFangSC;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 50px;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .date {
          height: 33px;
          line-height: 33px;
          width: 360px;
          margin-bottom: 17px;
          display: flex;
          align-items: center;
          .create-at {
            height: 28px;
            font-size: 28px;
            font-family: DINCondensed;
            font-weight: bold;
            color: rgba(153, 153, 153, 1);
            line-height: 34px;
            margin-right: 10px;
            display: inline-block;
            vertical-align: middle;
            margin-top: 3px;
          }
          .exprite-at {
            height: 28px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff8443;
            line-height: 28px;
            .day-num {
              font-style: normal;
              font-family: DINCondensed;
              color: #ff8443;
              font-size: 28px;
              font-weight: bold;
              margin-left: -8px;
              margin-top: 4px;
            }
          }
        }

        .remark {
          width: 315px;
          height: 66px;
          font-size: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 33px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
@media screen and (min-width: 768px) {
  div.no-data {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: center;
    .img-con {
      width: 412px;
      height: 290px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
