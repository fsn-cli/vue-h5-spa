<template>
  <popup v-model="isShowPop" :close-on-click-overlay="false">
    <div class="finished-container">
      <div class="monkey-wrapper">
        <img src="~assets/images/course/pop.png" />
      </div>
      <div class="bg-top">
        <img src="~assets/images/course/pop-top.png" />
      </div>
      <h1 class="title">恭喜您</h1>
      <p class="description">
        恭喜您已学完当前学科全部课程，去看看其他课程吧！
      </p>
      <van-button
        class="toChooseBtn"
        color="#FF6C48"
        round
        size="normal"
        @click="toHomeHandle"
        >去选课</van-button
      >
      <div class="close-wrapper" @click="closePop">
        <img src="~assets/images/course/close.png" />
      </div>
    </div>
  </popup>
</template>

<script>
import { Popup } from 'vant';
import { toHomePage } from '@/utils/jsBridge';

export default {
  name: 'finished-all',
  data() {
    return {
      isShowPop: this.isShow
    };
  },
  props: ['isShow'],
  watch: {
    isShow(val) {
      this.isShowPop = val;
      return val;
    }
  },
  components: {
    Popup
  },
  methods: {
    closePop() {
      this.$emit('closeFinishedAll');
    },
    toHomeHandle() {
      toHomePage();
    }
  }
};
</script>

<style lang="less" scoped>
.van-popup {
  overflow-y: inherit;
  border-radius: 30px;
}
.finished-container {
  position: relative;
  width: 570px;
  height: 590px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .monkey-wrapper {
    width: 370px;
    height: auto;
    position: absolute;
    left: 53px;
    top: -85px;
    z-index: 1;

    img {
      width: 100%;
      height: auto;
    }
  }
  .bg-top {
    width: 100%;
    height: 190px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    margin-top: 50px;
    font-size: 34px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(34, 34, 34, 1);
  }

  .description {
    margin-top: 30px;
    width: 470px;
    font-size: 26px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 40px;
  }

  .toChooseBtn {
    margin-top: 50px;
    width: 470px;
    height: 74px;
    font-size: 34px;
    font-weight: 500;

    .van-button__text {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
  .close-wrapper {
    position: absolute;
    left: 50%;
    margin-left: -38px;
    bottom: -126px;
    width: 76px;
    height: 76px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
