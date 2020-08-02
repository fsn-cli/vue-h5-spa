<template>
  <div class="outBox">
    <Popup v-model="show">
      <div>
        <section>
          <div class="imgBox">
            <img
              src="@/assets/images/course/posterShareImg.png"
              alt
            >
          </div>
          <p class="bottom">
            <i>
              <img
                src="@/assets/images/course/download.png"
                alt
              >
            </i>
            <span>长按保存图片</span>
          </p>
        </section>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Popup } from 'vant';
import { mapState } from 'vuex';

export default {
  components: {
    Popup,
  },
  data () {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState('course', ['qrcodeLink']),
  },
};
</script>

<style lang="less" scoped>
.outBox {
  .van-popup {
    background: transparent;
  }
  section {
    & > p.bottom {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      i {
        width: 40px;
        height: 40px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      span {
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 45px;
      }
    }
  }
  .imgBox {
    width: 559px;
    height: 1212px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
