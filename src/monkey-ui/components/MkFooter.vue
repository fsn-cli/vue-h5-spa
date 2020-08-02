<template>
  <div class='mk-footer' ref="mkFoter">
    <div class="mk-footer--bgImg" v-if="type === 'icon'"></div>
    <div v-if="type === 'default'">— 学而思出品 —</div>
  </div>

</template>

<script>
export default {
  name: 'MkFooter',
  props: {
    type: {
      type: String,
      default: 'default',
    },
  },
  created() {
    this.getMkfooterEl();
  },
  methods: {
    getMkfooterEl() {
      // setInterval(() => {
      this.$nextTick(() => {
        const cilentH = document.documentElement.clientHeight; // 可视区域高度

        const bodyH = (document.body.clientHeight) - (this.$refs.mkFoter.clientHeight); // 页面内容高度

        if (cilentH > bodyH) {
          this.$refs.mkFoter.style.position = 'fixed';
          this.$refs.mkFoter.style.bottom = '0px';
        } else {
          this.$refs.mkFoter.style.position = '';
        }
      });
      // }, 500);
    },
  },
};
</script>

<style lang='less' scoped>
  .mk-footer{
    width: 100%;
    font-size: 24px;
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    color: #888888;
    .mk-footer--bgImg{
      width: 370px;
      height: 50px;
      background-size: 100% 100%;
      background-image: url('../assets/footer.png');
    }
  }
</style>
