<template>
  <div
    class="loader-wrap"
    @touchstart.prevent
  >
    <div
      v-if="type === 'fading-circle1'"
      class="loader"
    >
      <div class="loader-inner">
        <div class="ball-spin-fade-loader">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
      <p
        v-if="msg"
        class="msg"
      >
        {{ msg }}
      </p>
    </div>
    <div
      v-if="type === 'snake'"
      class="mint-cell-value"
    >
      <span>
        <div class="mint-spinner-snake" />
      </span>
      <p
        v-if="msg"
        class="msg"
      >
        {{ msg }}
      </p>
    </div>
    <div
      v-if="type === 'fading-circle'"
      class="fading-circle"
    >
      <img
        src="@/assets/images/up_gif.gif"
        alt="loadding..."
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      type: '',
      msg: '',
    };
  },
  methods: {},
};
</script>

<style lang='less' scoped>
.loader-wrap {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.loader-dark {
  background-color: rgba(0, 0, 0, 0.4);
}

.loader-inner {
  width: 50 + 12px;
  height: 50 + 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@-webkit-keyframes ball-spin-fade-loader {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
    transform: scale(0.4);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes ball-spin-fade-loader {
  50% {
    opacity: 0.3;
    -webkit-transform: scale(0.4);
    transform: scale(0.4);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.ball-spin-fade-loader {
  position: relative;
  width: 12px;
  height: 12px;
}

.ball-spin-fade-loader > div:nth-child(1) {
  top: 25px;
  left: 0;
  -webkit-animation: ball-spin-fade-loader 1s 0s infinite linear;
  animation: ball-spin-fade-loader 1s 0s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(2) {
  top: 17.04545px;
  left: 17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s 0.12s infinite linear;
  animation: ball-spin-fade-loader 1s 0.12s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(3) {
  top: 0;
  left: 25px;
  -webkit-animation: ball-spin-fade-loader 1s 0.24s infinite linear;
  animation: ball-spin-fade-loader 1s 0.24s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(4) {
  top: -17.04545px;
  left: 17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s 0.36s infinite linear;
  animation: ball-spin-fade-loader 1s 0.36s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(5) {
  top: -25px;
  left: 0;
  -webkit-animation: ball-spin-fade-loader 1s 0.48s infinite linear;
  animation: ball-spin-fade-loader 1s 0.48s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(6) {
  top: -17.04545px;
  left: -17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s 0.6s infinite linear;
  animation: ball-spin-fade-loader 1s 0.6s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(7) {
  top: 0;
  left: -25px;
  -webkit-animation: ball-spin-fade-loader 1s 0.72s infinite linear;
  animation: ball-spin-fade-loader 1s 0.72s infinite linear;
}

.ball-spin-fade-loader > div:nth-child(8) {
  top: 17.04545px;
  left: -17.04545px;
  -webkit-animation: ball-spin-fade-loader 1s 0.84s infinite linear;
  animation: ball-spin-fade-loader 1s 0.84s infinite linear;
}

.ball-spin-fade-loader > div {
  background-color: #fff;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  transform-origin: center;
}

.mint-cell-value,
.loader {
  color: #888;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  background-color: rgba(0, 0, 0, 0.5);
  min-width: 90px;
  min-height: 90px;
  padding: 20px;
  border-radius: 10px;
  .msg {
    color: #fff;
    padding-top: 10px;
    font-size: 14px;
    margin: 0;
  }
}

.loader {
  width: 100%;
  height: 100%;
}

.mint-spinner-snake {
  animation: mint-spinner-rotate 0.8s infinite linear;
  border: 6px solid transparent;
  border-radius: 50%;
  border-top-color: rgba(255, 255, 255, 0.8);
  border-left-color: rgba(255, 255, 255, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.8);
  height: 44px;
  width: 44px;
}
.fading-circle {
  img {
    width: 120px;
  }
}
@keyframes mint-spinner-rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
</style>
