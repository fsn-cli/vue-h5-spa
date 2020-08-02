<template>
  <div :class="['mk-img-placeholder', 'mk-img-placeholder--' + type]"></div>
</template>
<script>
export default {
  name: 'MkImgPlaceholder',
  props: {
    type: { // max,large,normal
      type: String,
      default: 'default',
    },
  },
};
</script>
<style lang="less">
.mk-img-placeholder {
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  &--max {
    width: 670px;
    height: 300px;
    background-size: 100% 100%;
    background-image: url('../assets/placeholder/placeholder-max.png');
  }
  &--large {
    width: 320px;
    height: 236px;
    background-image: url('../assets/placeholder/placeholder-large.png');
  }
  &--normal {
    width: 256px;
    height: 180px;
    background-image: url('../assets/placeholder/placeholder-normal.png');
  }
  &--small {
    width: 170px;
    height: 230px;
    background-image: url('../assets/placeholder/placeholder-small.png');
  }
  &--mini {
    width: 140px;
    height: 140px;
    background-image: url('../assets/placeholder/placeholder-mini.png');
  }
  &--minimum {
    width: 82px;
    height: 82px;
    background-image: url('../assets/placeholder/placeholder-minimum.png');
  }
}

</style>
