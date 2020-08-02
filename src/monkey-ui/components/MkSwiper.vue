<template>
  <div class='mk-swiper'>
    <swiper ref="mySwiper" :options="swiperOptions" :class="type">
    <swiper-slide class="swiper-item" v-for='item of swiperList' :key='item.id'>
      <img class='swiper-img' :src='item.imgUrl'/>
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  name: 'MkSwiper',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    swiperList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOptions: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 9,
        pagination: {
          el: '.swiper-pagination',
          bulletActiveClass: this.type === 'notable' ? 'my-bullet-active--a' : 'my-bullet-active',
          clickable: true,
        },
        // 自动轮播
        autoplay: {
          delay: 2000,
          // 当用户滑动图片后继续自动轮播
          disableOnInteraction: false,
        },
        // 开启循环模式
        loop: true,
      },
    };
  },
};
</script>

<style lang='less' scoped>
  .mk-swiper{
    width: 100%;
    .swiper-container{
      width: 672px;
      height: 362px;
      margin-top: 38px;
      border-radius: 30px;
      overflow: hidden;
      .swiper-item{
        width: 100%;
        height: 302px;
        border-radius: 30px;
        overflow: hidden;
        .swiper-img{
          width: 100%;
          height: 100%;
        }
      }
      .swiper-pagination{
        // bottom: 0;
        /deep/ .swiper-pagination-bullet{
          width: 14px;
          height: 14px;
          background: #EBEBEB;
          border-radius: 50%;
          margin: 0 6px;
          opacity: 1;
        }
        /deep/ .my-bullet-active{
          background: #FF8443;
        }
        /deep/ .my-bullet-active--a{
          background: #FFC52D;
          width: 25px;
          border-radius: 30%;
        }
      }
    }
    .notable {
      overflow: visible!important;
      .swiper-wrapper{
        .swiper-slide{
          width: 672px;
          border-radius:20px;
          img{
            border-radius: 20px;
          }
        }
        .swiper-slide-prev{
          margin-top: 18px;
          height: 264px!important;
          img{
            height: 264px!important;
          }
        }
        .swiper-slide-next{
          margin-top: 18px;
          height: 264px!important;
          img{
            height: 264px!important;
          }
        }
        .swiper-slide-active{
          width: 672px;
        }
      }
    }
  }
</style>
