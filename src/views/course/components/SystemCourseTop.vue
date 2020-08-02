<template>
  <div class="out">
    <div v-show="courseInfo.banner_type === 0" class="player">
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

      <div v-if="isStart" class="cover-img">
        <img :src="poster" />
        <div class="play-btn" @click="play">
          <div class="play-triangle" />
        </div>
      </div>
    </div>
    <div v-show="courseInfo.banner_type === 1" class="imgBox">
      <div class="product-swiper">
        <van-swipe @change="onChange">
          <van-swipe-item
            v-for="(item, index) in courseInfo.head_url"
            :key="index + 'head_url'"
          >
            <van-image :src="item" :style="{ width: width + 'px' }">
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
          <p class="descDetail">
            {{ courseInfo.sale_point_name }}
          </p>
        </div>
      </div>
    </div>
    <div class="boxOut" v-show="courseInfo.sku">
      <div
        :class="[
          'courseSkuBox',
          courseInfo.sku.length === 3 ? 'thirdBox' : 'halfBox'
        ]"
        v-for="(item, index) in courseInfo.sku"
        :key="item.sku_id"
      >
        <div class="halfOut" v-if="item.sale_tag">
          <div class="topGitf">
            <span>{{ item.sale_tag }}</span>
          </div>
        </div>

        <div class="topCard">
          <p>{{ item.course_bag_name }}</p>
          <div class="priceBox">
            <div class="bigPrice">
              <i>&yen;</i>
              <em>{{ item.original_price - 0 }}</em>
            </div>
            <div class="smallPrice">
              <i>&yen;</i>
              <em>{{ item.sale_price - 0 }}/{{ item.unit }}</em>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 这里目前方案为配置图片 -->
    <div
      class="tips"
      v-for="(item, index) in courseInfo.promote_pic"
      :key="index + 'promote_pic'"
    >
      <van-image class="tipsImage" fit="cover" :src="item">
        <template v-slot:loading>
          <div class="lazy-img">
            <img src="~images/loadingImg-logo.png" alt />
          </div>
        </template>
      </van-image>
    </div>
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
  name: '',
  components: {
    VanImage: Image,
    VanSwipe: Swipe,
    VanSwipeItem: SwipeItem,
    dPlayer,
    DiscountActivity
  },
  data() {
    return {
      videoSrc: '',
      poster: null,
      player: null,
      isStart: true, // 是否显示封底图
      wifi: true,
      isOnline: true, // 是否连接网络
      appNetworkStatus: '',
      current: 0,
      isIos: judgeIos(),
      isIp5: this.judgeIp5(),
      width: 0,
      // this.judgeIp5(),
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
            this.videoSrc = newVal.head_url[0];
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
  mounted() {
    this.width = document.body.clientWidth;
  },
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
    play() {
      this.isWifi();
      this.player.play();
    },
    getAppNetworkStatus() {
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
  padding-bottom: 80px;
  background-color: #fff;
}
.player,
.imgBox {
  height: 562px;
  margin-bottom: 40px;
  background: #000;
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
  z-index: 0;
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
  z-index: 1;
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
      //width: 252px;
      max-width: 280px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 36px;
      font-weight: 600;
      color: rgba(12, 16, 15, 1);
      // vertical-align: bottom;
      margin-right: 10px;
      position: relative;
      top: 6px;
    }
    .claSort {
      font-size: 24px;
      line-height: 24px;
      color: rgba(12, 16, 15, 1);
      vertical-align: bottom;
      margin-right: 20px;
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
      //width: 234px;
      height: 40px;
      font-size: 20px;
      line-height: 40px;
      text-align: center;
      padding: 0 10px;
      background-image: url('~@/assets/images/course/bg1.png');
      background-size: cover;
      color: #fff;
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
      .descDetail {
        width: 400px;
        font-weight: normal;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.boxOut {
  width: 670px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.courseSkuBox {
  margin-bottom: 60px;
  background: rgba(247, 248, 250, 1);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  .halfOut {
    height: 42px;
    display: flex;
    .topGitf {
      max-width: 100%;
      padding: 6px 10px;
      height: 42px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fff;
      background: #fff;
      align-self: flex-end;
      border: 1px solid #ff8443;
      border-radius: 25px 25px 25px 0;
      position: absolute;
      left: -1px;
      top: -29px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 132, 67, 1);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .topCard {
    width: 100%;
    padding: 0 20px;
    margin-top: -12px;
    p {
      height: 42px;
      font-size: 30px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(12, 16, 15, 1);
      line-height: 42px;
    }
    .priceBox {
      .bigPrice {
        font-size: 0;
        font-family: QanelasSoftDEMO-Medium, QanelasSoftDEMO;
        font-weight: 500;
        color: #ff8443;
        i {
          font-size: 24px;
          line-height: 24px;
          position: relative;
          bottom: 4px;
        }
        em {
          position: relative;
          bottom: 2px;
          padding-top: 4px;
          font-size: 56px;
        }
      }
      .smallPrice {
        font-size: 0;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        i {
          font-size: 16px;
        }
        em {
          font-size: 24px;
        }
      }
    }
  }
}
// 2种课包样式
.halfBox {
  min-width: 322px;
  height: 170px;
  .topCard {
    position: absolute;
    left: 0;
    bottom: 0;
    .priceBox {
      padding-top: 13px;
      display: flex;
      justify-content: space-between;
      .smallPrice {
        position: relative;
        top: 20px;
      }
    }
  }
}
// 3种课包样式
.thirdBox {
  width: 206px;
  height: 240px;
  .topCard {
    .priceBox {
      padding-top: 24px;
      .smallPrice {
        margin-top: 8px;
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
    min-height: 100px;
  }
}
.product-swiper,
.van-swipe,
.van-swipe__track,
.van-swipe-item,
.van-image {
  border: none;
}
</style>
