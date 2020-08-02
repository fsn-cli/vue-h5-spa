<template>
  <div class="mk-teacher_card">
    <div class="mk-teacher_card--left">
      <img :src="img" alt="">
    </div>
    <div class="mk-teacher_card--right">
      <p class="mk-teacher_card--right-name">HI，{{ studentName }}</p>
      <p class="mk-teacher_card--right-desc">{{ desc }}</p>

      <mk-button
        class="mk-teacher_card--right-btn"
        icon="plus"
        @click="addWechat(teacherWechat, periodId, courseType, teacherNickname, teacherName)"
      >
        复制老师微信
      </mk-button>
      <p class="mk-teacher_card--right-tip">
        打开微信首页 - 右上角添加好友
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MkTeacherCard',
  props: {
    img: {
      type: String,
      default: '',
    },
    studentName: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
  methods: {
    addWechat (teacherWechat, periodId, courseType, teacherNickname, teacherName) {
      this.$emit('add-wechat', {
        teacherWechat,
        periodId,
        courseType,
        teacherNickname,
        teacherName,
      });
    },
  },
};
</script>

<style lang="less">
.mk-teacher_card{
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  width: 670px;
  height: 282px;
  padding: 22px 0 22px 30px;
  background: var(--white-color);
  border-radius: 30px;
  box-shadow: 0px 0px 50px rgba(34, 34, 34, 0.1);

  &--left{
    width: 182px;
    height: 238px;
    box-shadow: 0px 2px 30px 0px rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    overflow: hidden;
    margin-right: 30px;
    img{
      width: 100%;
      height: 100%;
    }
  }

  &--right{
    display: flex;
    flex-direction: column;
    text-align: left;
    &-name{
      width: 384px;
      margin-top: 10px;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222;
      line-height: 45px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-desc{
      width: 384px;
      margin: 10px 0 34px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      line-height: 33px;
      color: #999;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-btn {
      .mk-button{
        width: 240px;
        height: 66px;
        margin: 0;
        background: #FFC535;
        font-size: 24px;
        font-family: PingFangSC-Regular,PingFang SC;
      }
    }

    &-tip{
      margin-top: 12px;
      height: 32px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999;
      line-height: 33px;
    }
  }
}
</style>
