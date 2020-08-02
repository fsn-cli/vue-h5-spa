<template>
  <div class="topbar_container" :class="{ topbar_container_show: isShow }">
    <ul>
      <li
        :class="{ active: item.active }"
        v-for="(item, index) in moduleList"
        :key="index + 'top'"
        @click="anchorPoint(index)"
      >
        <div class="topbar_title">{{ item.name }}</div>
        <div class="topbar_line"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'top-bar',
  data() {
    return {};
  },
  props: ['moduleList', 'isShow'],
  computed: {
    ...mapState('course', ['activityInfo'])
  },
  methods: {
    /**
     * @description 用户点击锚点
     */
    anchorPoint(index) {
      this.$emit('clickPoint', index);
    }
  }
};
</script>

<style lang="less" scoped>
.topbar_container {
  width: 750px;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  background-color: white;
  padding: 0 40px;

  &.topbar_container_show {
    visibility: visible;
    opacity: 1;
  }

  ul {
    display: flex;
    justify-content: space-between;

    li {
      position: relative;
      height: 100px;
      display: flex;
      align-items: center;

      .topbar_title {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
      }
    }

    .active {
      .topbar_title {
        color: rgba(255, 138, 102, 1);
      }
      .topbar_line {
        position: absolute;
        left: 50%;
        bottom: 0;
        margin-left: -14px;
        width: 28px;
        height: 6px;
        background: rgba(255, 138, 102, 1);
        border-radius: 3px;
      }
    }
  }
}
</style>
