<template>
  <div class="mk-logistics_card">
    <div class="mk-logistics_card--status">
      <span>{{ productType }}</span>
      <span>{{ status }}</span>
    </div>
    <div class="mk-logistics_card--info">
      <div class="mk-logistics_card--info-img">
        <img :src="img" alt="">
      </div>
      <div class="mk-logistics_card--info-des">
        <div class="mk-logistics_card--info-des-text">
          {{ des }}
        </div>
        <div
          class="mk-logistics_card--info-des-btn"
          @click="handleBtnClick"
        >
          {{ btn }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MkLogisticsCard',
  props: {
    productType: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
    des: {
      type: String,
      default: '',
    },
    btn: {
      type: String,
      default: '',
    },
  },
  methods: {
    // 按钮下载方法
    handleBtnClick (e) {
      this.$emit('click-btn', e);
    },
  },
};
</script>

<style lang="less" scoped>
  .mk-logistics_card{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 750px;
    padding: 30px 40px;
    background: var(--white-color);
    &--status{
      display: flex;
      justify-content: space-between;
      width: 100%;
      line-height: 40px;
      font-size: 28px;
      font-family: PingFangSC-Regular, PingFangSC;
      color: #666;
    }
    &--info{
      display: flex;
      width: 100%;
      margin-top: 20px;
    }
    &--info-img{
      width: 140px;
      height: 140px;
      margin-right: 20px;
      overflow: hidden;
      border-radius: 14%;
      img{
        width: 100%;
        height: 100%;
      }
    }
    &--info-des {
      flex: 1;
      text-align: left;
      &-text{
        display: -webkit-box;
        min-height: 45px;
        max-height: 90px;
        margin: 20px 0 30px 0;
        overflow: hidden;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFangSC;
        line-height: 45px;
        color: #222;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &-btn{
        float: right;
        padding: 2px 21px;
        border-radius: 31px;
        border: 1px solid #FF6C48;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFangSC;
        color: #FF6C48;
        text-align: center;
      }
    }
  }
</style>
