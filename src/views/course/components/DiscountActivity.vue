<template>
  <div class="discount_activity_container">
    <div
      class="activity_item"
      v-for="(item, key) in activityInfo"
      @click="goDetail(item.activity_url, item.activity_desc)"
    >
      <div class="item_left">
        <div class="activity_title" :class="['title_bg' + (key % 3)]">
          {{ item.activity_tag }}
        </div>
        <div class="activity_description">{{ item.activity_desc }}</div>
      </div>
      <div class="activity_icon">
        <img
          src="@/assets/images/course/jiantou.png"
          alt
          v-show="item.activity_url"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import {
  sensorsExperienceClassDetailActivity,
  sensorsSystemClassDetailActivity
} from '@/trackPoint/trackPoint';

export default {
  name: 'DiscountActivity',
  data() {
    return {};
  },
  computed: {
    ...mapState('course', ['activityInfo', 'courseInfo']),
    ...mapGetters('course', ['subject'])
  },
  methods: {
    /**
     * @description 跳转活动详情页
     * @param {string} 跳转的链接
     */
    goDetail(url, desc) {
      if (!url) return;
      // 判断是否点击了活动，用于埋点
      this.$store.commit('course/SET_IS_ACTIVITY_CLICK', true);
      const purchase_status = this.courseInfo.purchase_status;
      if (Number(this.courseInfo.course_type) === 1) {
        // 体验课
        sensorsExperienceClassDetailActivity({
          purchase_status,
          subject: this.subject,
          activity_content: desc,
          activity_link: url
        });
      } else {
        sensorsSystemClassDetailActivity({
          purchase_status,
          subject: this.subject,
          activity_content: desc,
          activity_link: url
        });
      }
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.discount_activity_container {
  margin: 40px auto 0;
  overflow: hidden;
  padding-bottom: 36px;
  width: 670px;
  background: rgba(255, 251, 238, 1);
  border-radius: 10px;

  .activity_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 36px;

    .item_left {
      display: flex;
      justify-content: start;

      .activity_title {
        padding: 0 23px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }

      .title_bg0 {
        background: url('~assets/images/course/flag1.png') no-repeat;
        background-size: 100% 100%;
      }
      .title_bg1 {
        background: url('~assets/images/course/flag2.png') no-repeat;
        background-size: 100% 100%;
      }
      .title_bg2 {
        background: url('~assets/images/course/flag3.png') no-repeat;
        background-size: 100% 100%;
      }

      .activity_description {
        margin-left: 15px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
      }
    }

    .activity_icon {
      width: 12px;
      height: 19px;
      margin-right: 30px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
