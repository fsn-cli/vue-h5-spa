<template>
  <span :class="['mk-icon', 'mk-icon--' + icon + '--' + isActive]"></span>
</template>

<script>
import { oneOf } from '../utils/assist';

export default {
  name: 'MkIcon',
  props: {
    icon: {
      type: String,
      validator(value) {
        return oneOf(value, ['clock', 'time-table', 'star', 'coin', 'checked', 'lock', 'fail', 'success', 'identifyCode', 'loading', 'plus', 'warn']);
      },
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style lang="less">
.mk-icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  &--clock--true {
    background-image: url('../assets/icon/clock-active.png');
  }
  &--clock--false {
    background-image: url('../assets/icon/clock-grey.png');
  }
  &--time-table--true {
    background-image: url('../assets/icon/time-table-active.png');
  }
  &--time-table--false {
    background-image: url('../assets/icon/time-table-grey.png');
  }
  &--star--true {
    background-image: url('../assets/icon/star-active.png');
  }
  &--star--false {
    background-image: url('../assets/icon/star-grey.png');
  }
  &--coin--true {
    background-image: url('../assets/icon/coin-active.png');
  }
  &--coin--false {
    background-image: url('../assets/icon/coin-grey.png');
  }
  &--checked--true {
    background-image: url('../assets/icon/checked-active.png');
  }
  &--checked--false {
    background-image: url('../assets/icon/checked-grey.png');
  }
  &--lock--true {
    background-image: url('../assets/icon/lock-active.png');
  }
  &--lock--false {
    background-image: url('../assets/icon/lock-grey.png');
  }
  &--fail--false,
  &--fail--true {
    background-image: url('../assets/icon/warning.png');
  }
  &--warn--false,
  &--warn--true {
    background-image: url('../assets/icon/warn-red.png');
  }
  &--success--false,
  &--success--true {
    background-image: url('../assets/icon/success.png');
  }
  &--identifyCode--false,
  &--identifyCode--true{
    background-image: url('../assets/icon/sandglass.png');
  }
  &--loading--false,
  &--loading--true{
    background-image: url('../assets/icon/loading.png');
  }
   &--plus--false,
  &--plus--true{
    background-image: url('../assets/icon/plus.png');
  }
}

</style>
