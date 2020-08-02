<template>
  <div class="countdownBox">
    <div v-if="day >= 1" class="dayBox">{{ day }}天</div>
    <div v-else>
      <span>
        <i v-for="(value, key) in hour" :key="key">{{ value }}</i> </span
      >:
      <span>
        <i>{{ minute.substr(0, 1) }}</i>
        <i>{{ minute.substr(1) }}</i> </span
      >:
      <span>
        <i>{{ second.substr(0, 1) }}</i>
        <i>{{ second.substr(1) }}</i>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

export default {
  /**
        @remainTime number 截止时间与当前时间的差值
        @type string start代表开始售卖，end代表结束售卖
  **/
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      remainTime: 0,
      day: 0,
      hour: '00',
      minute: '00',
      second: '00'
    };
  },
  computed: {
    ...mapState('course', ['courseInfo', 'isSelling', 'isInSell', 'counttime']),
    currentSaleStartTime: function() {
      return this.courseInfo.sale_period_info.sale_period.sale_start_time;
    },
    currentSaleStopTime: function() {
      return this.courseInfo.sale_period_info.sale_period.sale_stop_time;
    },
    nextSaleStartTime: function() {
      return this.courseInfo.sale_period_info.next_sale_period.sale_start_time;
    },
    nextSaleStopTime: function() {
      return this.courseInfo.sale_period_info.next_sale_period.sale_stop_time;
    }
  },
  created() {
    this.getRemainTime();
    if (this.remainTime > 0) {
      this.countdown();
    }
  },
  mounted() {
    // 页面可见性处理
    this.handleVisibilitychange();
  },
  methods: {
    countdown() {
      let remainTime = this.remainTime;
      this.calcTime(remainTime);
      this.timer = setInterval(() => {
        if (remainTime > 0) {
          remainTime -= 1000;
          this.remainTime -= 1000;
          this.calcTime(remainTime);
        } else {
          clearInterval(this.timer);
          // 倒计时结束时触发的方法，进入已开售状态
          if (this.type === 'start' || this.type === 'nextStart') {
            this.$store.commit('course/SET_COUNTDOWNTYPE', 'endFromCount');
            this.$store.commit('course/SET_SELLING_STATUS', true);
          }
          if (this.type === 'nextStart') {
            this.$store.commit('course/SET_COUNTDOWNTYPE', 'endFromCount');
            this.$store.commit('course/SET_SELLING_STATUS', true);
            this.$store.commit('course/SET_SOLDOUT_STATUS', false);
          }
          this.type === 'end' &&
            this.$store.commit('course/SET_SOLDOUT_STATUS', true);
        }
      }, 1000);
    },
    calcTime(remainTime) {
      let day = Math.floor(remainTime / 1000 / 3600 / 24);
      let hour = Math.floor((remainTime / 1000 / 3600) % 24);
      let minute = Math.floor((remainTime / 1000 / 60) % 60);
      let second = Math.floor((remainTime / 1000) % 60);
      if (day >= 1) {
        // this.day = day;
        hour += day * 24;
      }
      this.hour = hour < 10 ? '0' + hour : hour + '';
      this.minute = minute < 10 ? '0' + minute : minute + '';
      this.second = second < 10 ? '0' + second : second + '';
    },
    getRemainTime() {
      let currentTime = new Date(
        this.courseInfo.service_time.replace(/-/g, '/')
      ).getTime(); // 服务器时间戳
      const currentDay = new Date(
        format(
          new Date(this.courseInfo.service_time.replace(/-/g, '/')),
          'yyyy/MM/dd'
        )
      ).getTime(); // 服务器的当天时间戳
      const stopDay = new Date(
        format(
          new Date(
            this.courseInfo.sale_period_info.sale_period.sale_stop_time.replace(
              /-/g,
              '/'
            )
          ),
          'yyyy/MM/dd'
        )
      ).getTime(); // 销售期结束时间当前时间戳
      let stopTime;
      if (this.type === 'end' || this.type === 'endFromCount') {
        if (this.type === 'endFromCount') {
          currentTime = currentTime + this.counttime;
        }
        if (currentDay === stopDay) {
          stopTime = new Date(
            this.currentSaleStopTime.replace(/-/g, '/')
          ).getTime();
        } else {
          stopTime = currentDay + 24 * 60 * 60 * 1000;
        }
        this.remainTime = stopTime - currentTime;
      }

      if (this.type === 'start') {
        let startTime;
        if (!this.isInSell) {
          startTime = new Date(
            this.currentSaleStartTime.replace(/-/g, '/')
          ).getTime();
          this.remainTime = startTime - currentTime;
          this.$store.commit('course/SET_COUNTTIME', this.remainTime);
        }
        this.$store.commit(
          'course/SET_SALETIME',
          format(new Date(startTime), 'yyyy/MM/dd HH:mm:ss')
        );
      }

      if (this.type === 'nextStart') {
        let startTime;
        startTime = new Date(
          this.nextSaleStartTime.replace(/-/g, '/')
        ).getTime();
        this.remainTime = startTime - currentTime;
        this.$store.commit('course/SET_COUNTTIME', this.remainTime);
        // this.$store.commit(
        //   'course/SET_SALETIME',
        //   format(new Date(startTime), 'yyyy/MM/dd HH:mm:ss')
        // );
      }
    },
    handleVisibilitychange() {
      const prefixes = ['webkit', 'moz', 'ms', 'o'];
      let hidden, visibilityChange;
      if ('hidden' in document) {
        hidden = 'hidden';
      }
      if ('visibilitychange' in document) {
        visibilityChange = 'visibilitychange';
      }
      for (let i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + 'Hidden' in document) {
          hidden = prefixes[i] + 'Hidden';
        }
      }
      for (let i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + 'visibilityChange' in document) {
          hidden = prefixes[i] + 'visibilityChange';
        }
      }
      window.addEventListener(visibilityChange, e => {
        let start;
        let end;
        if (document[hidden]) {
          clearInterval(this.timer);
          start = new Date().getTime();
        } else {
          end = new Date().getTime();
          const tmp = end - start;
          this.remainTime -= tmp;
          if (this.remainTime > 0) {
            this.countdown();
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.countdownBox {
  font-size: 32px;
  .dayBox {
    font-size: 28px;
    font-weight: 600;
    color: rgba(34, 34, 34, 1);
    line-height: 40px;
  }
  span {
    i {
      display: inline-block;
      width: 30px;
      text-align: center;
      background: rgba(244, 243, 243, 0.64);
      border-radius: 4px;
      font-size: 32px;
      font-weight: bold;
      // font-family: 'PingFangSC-Regular';
      color: rgba(26, 27, 26, 1);
      height: 37px;
      line-height: 37px;
      padding-top: 5px;
      margin-right: 6px;
      //vertical-align: middle;
      //display: flex;
    }
  }
}
</style>
