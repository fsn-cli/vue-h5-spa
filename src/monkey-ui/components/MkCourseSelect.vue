<template>
  <div class="mk-course-select-container">
    <div class="mk-course-title">{{title}}</div>
    <div class="mk-course-item" v-for="(item, index) in courseList" :key="index" :class="{'course-item-active': currentIndex === index}" @click="courseClick(index, item.id, item)">
      <span class="mk-course-item-tag mk-border-1px">{{ item.tag }}</span>
      <div class="mk-course-item-box mk-border-1px">
        <div class="mk-course-item-name">{{ item.name }}</div>
        <div class="mk-course-item-price-box">
          <div class="mk-course-item-sale-price-box">
            <span class="mk-course-item-sale-price-unit">{{ item.unit || '￥' }}</span>
            <span class="mk-course-item-sale-price">{{ item.salePrice }}</span>
          </div>
          <div class="mk-course-item-cycle-price-box">
            <span class="mk-course-item-cycle-price-unit">{{ item.unit || '￥' }}</span>
            <span class="mk-course-item-cycle-price">{{ item.cyclePrice }}</span>
            <span class="mk-course-item-cycle">{{ item.cycle }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MkCourseSelect',
  props: {
    title: {
      type: String,
      default: '',
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
    courseList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  watch: {
    defaultIndex: {
      handler(val) {
        this.currentIndex = val;
      },
      immediate: true,
    },
  },
  methods: {
    courseClick(index, id, item) {
      this.$emit('courseClick', {
        index,
        id,
        obj: item,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mk-course-select-container {
  padding: 35px 40px;
  .mk-course-title {
    font-size: 36px;
    font-family: PingFangSC-Semibold,PingFang SC;
    font-weight: 600;
    color: rgba(34,34,34,1);
    line-height: 40px;
  }
  .mk-course-item {
    width: 322px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    line-height:33px;
    .mk-course-item-tag {
      font-size:24px;
      padding: 5px 21px;
      box-sizing: content-box;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:var(--num-color);
      line-height:33px;
      &::after {
        border-radius: 40px;
        border-color: var(--num-color);
      }
    }
    .mk-course-item-box {
      .mk-course-item-name {}
      .mk-course-item-price-box {}
      .mk-course-item-sale-price-box {}
      .mk-course-item-sale-price-unit {}
      .mk-course-item-sale-price {}
      .mk-course-item-cycle-price-box {}
      .mk-course-item-cycle-price-unit {}
      .mk-course-item-cycle-price {}
      .mk-course-item-cycle {}
    }
  }
}
</style>
