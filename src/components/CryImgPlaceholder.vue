<template>
  <transition name="fade">
    <div
      v-if="value"
      class="cry-img-placeholder"
    >
      <div class="container">
        <div class="img-wrap">
          <img
            src="~images/cry-placeholder@2x.png"
            alt
          >
        </div>

        <div
          v-if="text"
          class="text-wrap"
        >
          {{ text }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CryImgPlaceholder',
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
.cry-img-placeholder {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .img-wrap {
    width: 386px;
    height: 290px;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .text-wrap {
    margin-top: 30px;
    text-align: center;
    line-height: 100px;
    font-size: 28px;
    color: #969799;
  }
}

.fade-enter-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
