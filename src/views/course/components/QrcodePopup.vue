<template>
  <div class="qrcodeBox">
    <Popup v-model="show" round>
      <div class="qrcodeContent">
        <header>立即预约</header>
        <section>
          <div class="imgBox">
            <div class="imgBox-container">
              <img :src="qrcodeLink" alt />
            </div>
          </div>
          <p>长按识别二维码 关注公众号</p>
          <div>获取抢购链接 准时开始</div>
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
.qrcodeBox {
  .van-popup {
    background: transparent;
  }
  .qrcodeContent {
    width: 540px;
    height: 700px;
    background-image: url("~@/assets/images/course/qrcodeBg.png");
    background-size: contain;
    header {
      height: 132px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40px;
      color: #fff;
    }
    section {
      display: flex;
      height: calc(100%-132px);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .imgBox {
        width: 324px;
        height: 324px;
        background-image: url("~@/assets/images/course/imgbox.png");
        background-size: contain;
        .imgBox-container {
          margin: 34px 29px;
          width: 261px;
          height: 261px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      p {
        font-size: 24px;
        color: rgba(69, 166, 255, 1);
      }
      div {
        font-size: 24px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
}
</style>
