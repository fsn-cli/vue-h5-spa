<template>
  <div class="main" ref="test">
    <div class="imgBox" :ref="item.refName" v-for="(item, index) in moduleList">
      <van-image
        v-for="(item, key) in item.url"
        :key="key"
        class="bigImg"
        @load="loadImage"
        :src="item"
      >
        <template v-slot:loading>
          <div class="loadingImg-box">
            <div class="loadingImg-wrapper">
              <img src="@/assets/images/loadingImg-logo.png" />
            </div>
          </div>
        </template>
      </van-image>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'course-detail',
  data() {
    return {};
  },
  props: ['moduleList'],
  computed: {
    ...mapState('course', ['activityInfo'])
  },
  watch: {
    moduleList(newVal) {
      this.$nextTick(() => {
        const moduleList = this.addTopToModuleList(newVal);
        this.initModuleListTop(moduleList);
      });
    }
  },
  methods: {
    /**
     * @description 图片加载完触发
     */
    loadImage() {
      const moduleList = this.addTopToModuleList(this.moduleList);
      this.initModuleListTop(moduleList);
    },

    /**
     * @description 给各个部分赋值top
     */
    addTopToModuleList(moduleList) {
      moduleList.map(item => {
        item.top = this.$refs[item.refName][0].offsetTop;
      });
      return moduleList;
    },

    /**
     * @description 初始话moduleList的top值
     * @param {Array} moduleList 要更改的moduleList值
     */
    initModuleListTop(moduleList) {
      this.$emit('changeModuleList', moduleList);
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  padding-top: 20px;
  background: #fafafa;
  .imgBox {
    background: #fff;
    .loadingImg-box {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .loadingImg-wrapper {
      width: 352px;
      height: 94px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bigImg {
    width: 100%;
    height: 100%;
  }
}
</style>
