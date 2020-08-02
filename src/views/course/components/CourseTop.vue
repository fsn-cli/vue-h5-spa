<template>
  <div class="out">
    <div v-show="courseInfo.banner_type === 0" class="player">
      <div v-if="isStart" class="cover-img">
        <img :src="poster" />
        <div class="play-btn" @click="play">
          <div class="play-triangle" />
        </div>
      </div>
      <template v-show="!isStart">
        <!-- ios -->
        <video
          v-if="isIos && !isIp5"
          ref="videoRef"
          class="centeredVideo"
          :src="videoSrc"
          controls
          preload
          x5-video-player-type="h5-page"
          webkit-playsinline
          playsinline
          x5-playsinline
        >
          <source :src="videoSrc" type="video/mp4" />
        </video>
        <!-- andiord -->
        <video
          v-if="!isIos"
          ref="videoRef"
          class="centeredVideo"
          :src="videoSrc"
          controls
          preload
          x5-video-player-type="h5-page"
        >
          <source :src="videoSrc" type="video/mp4" />
        </video>
        <!-- iphone 5 -->
        <d-player
          v-if="isIp5"
          ref="player"
          :options="options"
          class="centeredVideo"
        />
      </template>
    </div>
    <div v-show="courseInfo.banner_type === 1" class="imgBox">
      <div class="product-swiper">
        <van-swipe @change="onChange">
          <van-swipe-item
            v-for="(item, index) in courseInfo.head_url"
            :key="index"
          >
            <van-image :src="item">
              <template v-slot:loading>
                <div class="lazy-img">
                  <img src="~images/loadingImg-logo.png" alt />
                </div>
              </template>
            </van-image>
          </van-swipe-item>

          <div slot="indicator" class="custom-indicator">
            <div class="indicatorWrap">
              <span class="left">{{ current + 1 }}</span>
              <span class="middle">/</span>
              <span class="right">{{ courseInfo.head_url.length }}</span>
            </div>
          </div>
        </van-swipe>
      </div>
    </div>
    <div class="des">
      <div class="desTop">
        <span class="claName">{{ courseInfo.course_name }}</span>
        <span class="claSort"
          ><span class="claSort-str">第</span
          ><span class="claSort-num">{{ title }}</span
          ><span class="claSort-str">期</span></span
        >
        <div class="times">
          限售<span class="times-num">{{ courseInfo.show_stock }}</span
          >份，剩余<span class="times-num">{{ courseInfo.rest_stock }}</span
          >份
        </div>
      </div>
      <div class="desBottom">
        <div class="desContent">
          <p>
            {{
              $formatTime(
                courseInfo.sale_period_info.sale_period.open_course_time,
                'MM月dd日'
              )
            }}开课
          </p>
          <p class="descDetail">{{ courseInfo.sale_point_name }}</p>
        </div>
        <div v-show="courseInfo.card_promotion_price" class="price">
          <span class="oldPrice">
            <i>&yen;</i>
            <em>{{ courseInfo.card_promotion_price - 0 }}</em>
          </span>
          <span class="newPrice">
            <em>券后价</em>
            <i>&yen;</i><span>{{ courseInfo.card_price - 0 }}</span
            ><em>/两周</em>
          </span>
        </div>
      </div>
    </div>
    <div
      class="tips"
      v-for="(item, index) in courseInfo.promote_pic"
      :key="index"
    >
      <van-image class="tipsImage" fit="cover" :src="item" />
    </div>
    <!-- 活动配置 -->
    <discount-activity />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Image, Swipe, SwipeItem } from 'vant';
import { judgeIos, isWeiXin } from '@/utils/platformHelper';
import dPlayer from 'vue-dplayer';
import 'vue-dplayer/dist/vue-dplayer.css';
import DiscountActivity from './DiscountActivity';

export default {
  name: 'CourseTop',
  components: {
    VanImage: Image,
    VanSwipe: Swipe,
    VanSwipeItem: SwipeItem,
    dPlayer,
    DiscountActivity
  },
  data() {
    return {
      // videoSrc: '',
      poster: null,
      player: null,
      isStart: true, // 是否显示封底图
      wifi: true,
      isOnline: true, // 是否连接网络
      current: 0,
      isIos: judgeIos(),
      isIp5: this.judgeIp5(),
      options: {
        video: {
          url: '',
          controls: true
        }
      }
    };
  },
  computed: {
    ...mapState('course', ['courseInfo']),
    videoSrc() {
      return (
        Array.isArray(this.courseInfo.head_url) && this.courseInfo.head_url[0]
      );
    },
    title() {
      return this.courseInfo.sale_period_info.sale_period.sale_period_num;
    }
  },
  watch: {
    courseInfo: {
      deep: true,
      handler(newVal) {
        if (newVal.banner_type === 0) {
          if (this.isIp5) {
            this.player = this.$refs.player.dp;
            this.poster = newVal.cover_pic;
            this.player.switchVideo({
              url: newVal.head_url[0]
            });
            this.player.on('playing', () => {
              this.$store.commit('course/SET_AUDIOPLAY', true);
              this.isStart = false;
            });
            this.player.on('ended', () => {
              this.isStart = true;
            });
          } else {
            this.poster = newVal.cover_pic;
            const videoElement = this.$refs.videoRef;
            this.player = this.$refs.videoRef;
            // 监听视频播放
            videoElement.addEventListener('play', () => {
              this.$store.commit('course/SET_AUDIOPLAY', true);
              this.isStart = false;
            });
            videoElement.addEventListener(
              'ended',
              () => {
                this.isStart = true;
              },
              false
            );
          }
        }
      }
    }
  },
  mounted() {},
  methods: {
    judgeIp5() {
      let events = navigator.userAgent;
      if (events.indexOf('iPhone') > -1) {
        // 根据尺寸进行判断 苹果的型号
        if (screen.height === 568 && screen.width === 320) {
          // iphone5
          return true;
        }
      }
      return false;
    },
    onChange(index) {
      this.current = index;
    },
    async play() {
      try {
        this.isWifi();
        await this.player.play();
      } catch (e) {
        console.error(e);
      }
    },
    getAppNetworkStatus() {
      // eslint-disable-next-line no-undef
      mk.getNetworkStatus(status => {
        switch (status) {
          case '2':
            this.wifi = true;
            this.isOnline = true;
            break;
          case '0':
            this.isOnline = false;
            break;
          default:
            this.wifi = false;
            this.isOnline = true;
            break;
        }
        this.wifiOnlineToast();
      });
    },
    getWxNetworkStatus() {
      let ua = window.navigator.userAgent;
      if (ua.indexOf('WIFI') >= 0) {
        this.wifi = true;
      } else {
        this.wifi = false;
      }
    },
    geth5NetworkStatus() {
      let network = window.navigator.connection.type;
      if (network !== 'wifi' && network !== '2' && network !== 'unknown') {
        this.wifi = false;
        this.isOnline = true;
      }

      if (window.navigator.onLine) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    },
    wifiOnlineToast() {
      if (!this.isOnline) {
        this.$MkToast('当前无网络环境');
      }
      if (!this.wifi) {
        this.$MkToast('您正在非wifi环境播放，请注意流量');
      }
    },
    isWifi() {
      // try {
      let platform = window.localStorage.getItem('platform');
      if (platform === 'android' || platform === 'ios') {
        this.getAppNetworkStatus();
      } else if (isWeiXin()) {
        this.getWxNetworkStatus();
        this.wifiOnlineToast();
      } else if (window.navigator.connection) {
        this.geth5NetworkStatus();
        this.wifiOnlineToast();
      }

      // } catch (e) {
      //   this.wifi = false;
      // }
    }
  }
};
</script>

<style lang="less" scoped>
.out {
  padding-bottom: 60px;
  background-color: #fff;
}
.player,
.imgBox {
  height: 562px;
  margin-bottom: 40px;
  // background: #000;
  position: relative;
  overflow: hidden;
  .product-swiper {
    position: relative;
    width: 100%;
    height: 100%;
    .lazy-img {
      width: 352px;
      height: 94px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    /deep/ .van-swipe,
    .van-swipe__track,
    .van-image {
      width: 100%;
      height: 100%;
    }
    .product-swiper,
    .van-swipe,
    .van-swipe__track,
    .van-swipe-item,
    .van-image {
      border: none;
    }
    .custom-indicator {
      position: absolute;
      right: 40px;
      bottom: 40px;
      width: 80px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      background: rgba(0, 0, 0, 0.29);
      border-radius: 23px;
      overflow: hidden;

      .indicatorWrap {
        position: relative;
        top: 10px;
        font-size: 0;

        .left {
          font-size: 32px;
        }

        .middle,
        .right {
          font-size: 24px;
        }

        .middle {
          margin: 0 2px;
        }
      }

      span {
        font-weight: bold;
        line-height: 38px;
        color: #fff;
      }
    }
  }
}
.centeredVideo {
  display: block;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 562px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
}
/deep/.dplayer-bar-wrap {
  transform: scaleY(2);
  margin-bottom: 14px;
}
/deep/.dplayer-controller {
  margin-bottom: 10px;
}
/deep/.dplayer-icon {
  transform: scale(1.8);
  margin-bottom: 14px !important;
}
/deep/.dplayer-time {
  font-size: 30px !important;
  margin-left: 10px !important;
  padding-top: 16px !important;
}
/deep/.dplayer-setting {
  display: none !important;
}
/deep/.dplayer-full-in-icon {
  display: none !important;
}
/deep/.dplayer-full-icon::after {
  content: ' ';
}
.cover-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 562px;
  z-index: 90;
  img {
    width: 100%;
    height: 100%;
  }
  .play-btn {
    width: 100px;
    height: 100px;
    background: url('~@/assets/images/course/play@2x.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
  }
}

.headImage {
  height: 562px;
}
.imgBox {
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .van-swipe,
  .van-swipe__track,
  .van-image {
    width: 100%;
    height: 100%;
  }
}

.des {
  display: flex;
  flex-direction: column;
  width: 670px;
  margin: 0 auto;
  .desTop {
    display: flex;
    align-items: flex-end;
    .claName {
      max-width: 252px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 36px;
      font-weight: 600;
      color: rgba(12, 16, 15, 1);
      margin-right: 10px;
    }
    .claSort {
      font-size: 24px;
      font-weight: 600;
      color: rgba(12, 16, 15, 1);
      vertical-align: bottom;
      margin-right: 26px;
      .claSort-str {
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
      .claSort-num {
        font-size: 28px;
        font-family: QanelasSoftDEMO-Medium;
      }
    }
    .times {
      min-width: 260px;
      height: 42px;
      font-size: 24px;
      padding: 0 10px;
      border-radius: 23px 23px 23px 0;
      background-color: #000;
      color: #fff;
      position: relative;
      bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular, PingFang SC;
      .times-num {
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 28px;
        // margin-top: 10px;
      }
    }
  }
  .desBottom {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 60px;
    font-size: 24px;
    // font-weight: bold;
    color: rgba(102, 102, 102, 1);
    height: 64px;
    line-height: 32px;
    .desContent {
      //width: 514px;
      vertical-align: bottom;
      .descDetail {
        width: 300px;
        font-weight: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .price {
      align-self: flex-end;
      .oldPrice {
        color: #999;
        margin-right: 10px;
        i {
          font-size: 16px;
          margin-right: -2px;
        }
        em {
          font-size: 28px;
          text-decoration: line-through;
        }
      }
      .newPrice {
        font-family: QanelasSoftDEMO-Medium;
        color: #f76561;
        span {
          font-size: 70px;
          margin: 0 0 0 4px;
        }
        i {
          font-size: 30px;
          margin-left: 6px;
        }
        em {
          font-size: 24px;
        }
      }
    }
  }
}
.tips {
  width: 670px;
  //height: 100px;
  display: flex;
  align-items: center;
  background: rgba(255, 247, 243, 1);
  border-radius: 57px;
  margin: 0 auto;
  img {
    width: 50px;
    height: 48px;
    vertical-align: middle;
    margin-left: 60px;
  }
  span {
    font-size: 24px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 33px;
    margin-left: 30px;
    strong {
      font-size: 30px;
      font-weight: bold;
      color: rgba(255, 91, 21, 1);
      line-height: 35px;
    }
    i {
      font-size: 16px;
      font-weight: bold;
      color: rgba(255, 91, 21, 1);
      line-height: 19px;
    }
  }
  .tipsImage {
    width: 670px;
    //height: 100px;
  }
}
</style>
