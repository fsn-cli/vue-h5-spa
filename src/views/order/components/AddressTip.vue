<template>
  <p class="address-tip" v-if="isDefaultAddress">
    您的课程随材、兑换的商品，将寄送至下方您填写的地址，请保证地址填写正确，保持电话畅通。
  </p>
</template>

<script>
export default {
  name: 'address-tip',
  props: {
    // 是否是默认地址页
    isDefaultAddress: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less" scoped>
.address-tip {
  background: rgba(250, 250, 250, 1);
  padding: 30px 40px;
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFangSC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 36px;
  text-align: justify;
}
</style>
