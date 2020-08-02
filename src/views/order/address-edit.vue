<template>
  <div class="wrapper">
    <div class="head">
      <!-- tip -->
      <address-tip :is-default-address="true" />
      <!-- 表单 -->
      <div class="list">
        <div class="row">
          <input
            placeholder="收货人"
            ref="address"
            maxlength="10"
            v-model="addressData.name"
            @input="e => handlePerson(e.target.value)"
          />
        </div>

        <div class="row">
          <input
            placeholder="手机号码"
            ref="phone"
            type="tel"
            v-model="addressData.phone"
            @input="e => handlePhone(e.target.value)"
            maxlength="11"
            class="conb"
          />
        </div>

        <div class="row" @click="showPop">
          <input
            class="area-input"
            ref="area"
            placeholder="所在地区"
            readonly
            @click="e => handleInput(e.target.value)"
            unselectable="on"
          />
          <input type="hidden" ref="area_code" />
          <i />
        </div>

        <div class="last-row">
          <textarea
            ref="textArea"
            v-model="addressData.detail"
            maxlength="60"
            placeholder="详细地址：如道路、门牌号、小区等"
            @blur="handleScroll"
            @input="e => handleDetail(e.target.value)"
            @focus="handleKeyBord"
          />
        </div>
      </div>
    </div>
    <div class="foot">
      <a class="btn" @click="saveAddress" v-if="userAdress">保存地址</a>
      <div class="btn_unable" @click="saveNoComplete" v-else>保存地址</div>
    </div>
    <van-popup v-model="show" position="bottom">
      <van-area
        :value="addressData.county"
        :area-list="areaList"
        confirm-button-text
        cancel-button-text
        title="所在地区"
        @confirm="confirmClick"
        @cancel="cancelClick"
      />
    </van-popup>
  </div>
</template>

<script>
import { Area, Popup, Dialog } from 'vant';
import { createAddress } from '@/api/personal/order';
import { area } from '@/sdk/area';
import { checkIsonLine } from '@/utils/tool';
import { sleep } from '@/utils';
import { closeWebView } from '@/utils/jsBridge';
import {
  sensorsFillinaddressShow,
  sensorsFillinaddressSave
} from '@/trackPoint/trackPointAdress';
import AddressTip from './components/AddressTip';
import _ from 'lodash';

export default {
  name: 'address-edit',
  data() {
    return {
      show: false,
      addressData: this.$route.query.data || '',
      tempAdressData: this.$route.query.data || '',
      channel: this.$route.query.channel || '',
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      newProvince: null,
      isSaved: false,
      timer: null,
      isDefaultAddress: true, // 判断是否是默认地址
      previous_source: this.$route.query.previous_source || '' // 上一步来源
    };
  },
  filters: {},
  components: {
    'van-area': Area,
    'van-popup': Popup,
    AddressTip
  },
  computed: {
    userName: function() {
      return this.addressData.name;
    },
    userPhone: function() {
      return this.addressData.phone;
    },
    userDetail: function() {
      return this.addressData.detail;
    },
    userArea: function() {
      if (this.addressData.county) {
        return true;
      }
      if (!this.addressData.county && this.newProvince) {
        return true;
      }
      return false;
    },
    userAdress: function() {
      return Boolean(
        this.userName && this.userPhone && this.userDetail && this.userArea
      );
    }
  },

  created() {
    this.listArea();
  },

  mounted() {
    console.log(this.addressData, '===+++++');
    this.initData();
    // 判断页面类型
    this.handlePageType();
    this.sensorsFillinaddressShowHandle();
  },

  methods: {
    /**
     * @description 判断页面是否是默认地址页
     */
    handlePageType() {
      if (this.addressData && this.addressData.addr_id) {
        // 修改运单地址
        this.isDefaultAddress = false;
      } else {
        // 默认地址的填写和修改
        this.isDefaultAddress = true;
      }
    },
    /**
     * @description 页面的曝光埋点
     */
    sensorsFillinaddressShowHandle() {
      try {
        sensorsFillinaddressShow({
          previous_source: this.previous_source,
          order_id: String(this.$route.query.order_id) || '',
          goods_id: String(this.$route.query.goods_id) || '',
          goods_name: this.$route.query.goods_name || ''
        });
      } catch (e) {}
    },

    inputBlur() {
      this.$refs.address.blur();
      this.$refs.phone.blur();
      this.$refs.area.blur();
      this.$refs.textArea.blur();
    },
    isModifyAddress() {
      return (
        JSON.stringify(this.addressData) === JSON.stringify(this.tempAdressData)
      );
    },

    showPop() {
      this.show = true;
    },
    confirmClick(value) {
      this.show = false;
      this.setArea(value);
    },
    cancelClick() {
      this.show = false;
    },
    handleInput() {
      document.activeElement.blur();
    },
    handleScroll() {
      clearInterval(this.timer);
      window.scroll(0, 0);
    },
    handleKeyBord() {
      this.timer = setTimeout(function() {
        document.body.scrollTop = document.body.clientHeight * 0.25;
      }, 300);
      // this.$refs.textArea.scrollIntoViewIfNeeded();
    },
    handlePerson(val) {
      this.addressData = Object.assign({}, this.addressData, {
        name: this.handleEmjio(val)
      });
    },
    handleDetail(val) {
      this.addressData = Object.assign({}, this.addressData, {
        detail: this.handleEmjioOnly(val)
      });
    },
    // 过滤表情包
    handleEmjio(val) {
      return val.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/gi, '');
    },
    // 过滤表情包和空格
    handleEmjioOnly(val) {
      return val.replace(
        /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|[\s]/g,
        ''
      );
    },
    handlePhone(phone) {
      this.addressData.phone = phone.replace(/[^\d]/g, '');
    },
    // 过滤特殊字符
    checkSpeStr(str) {
      let regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/g;
      let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/g;
      if (regEn.test(str) || regCn.test(str)) {
        return false;
      }
      return true;
    },
    initData() {
      this.addressData = this.addressData ? JSON.parse(this.addressData) : null;
      this.tempAdressData = this.tempAdressData
        ? JSON.parse(this.tempAdressData)
        : null;
      // 后者是订单物流
      if (this.addressData && this.addressData.addr_id) {
        const area = [
          {
            name: this.addressData.province_name,
            code: this.addressData.province
          },
          {
            name: this.addressData.city_name,
            code: this.addressData.city
          },
          {
            name: this.addressData.county_name,
            code: this.addressData.county
          }
        ];
        this.setArea(area);
      } else {
        this.addressData = {};
        this.tempAdressData = {};
      }
    },
    setArea(value) {
      this.newProvince = value;
      this.$refs.area.value =
        value[0].name + ',' + value[1].name + ',' + value[2].name;

      this.$refs.area_code.value =
        value[0].code + ',' + value[1].code + ',' + value[2].code;
    },
    listArea() {
      // console.log(area);
      area.map(provice => {
        this.areaList.province_list[provice.code] = provice.name;
        provice.children.map(city => {
          this.areaList.city_list[city.code] = city.name;
          city.children.map(county => {
            this.areaList.county_list[county.code] = county.name;
          });
        });
      });
    },
    checkMobile(str) {
      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      return reg.test(str);
    },
    saveNoComplete() {
      this.$MkToast({
        duration: 2000,
        message: '请完善地址信息'
      });
    },
    async saveAddress() {
      // 保存按钮埋点
      try {
        sensorsFillinaddressSave({
          order_id: String(this.$route.query.order_id) || '',
          goods_id: String(this.$route.query.goods_id) || '',
          goods_name: this.$route.query.goods_name || ''
        });
      } catch (e) {}

      if (this.successToast) {
        return;
      }

      const isonLine = checkIsonLine();
      if (!isonLine) return;

      let isSpeStr = this.checkSpeStr(this.addressData.name);
      if (!isSpeStr) {
        this.$MkToast({
          duration: 2000,
          message: '收货人不能包含特殊字符'
        });
        return;
      }
      let isPhone = this.checkMobile(this.addressData.phone);
      if (!isPhone) {
        this.$MkToast({
          duration: 2000,
          message: '请输入正确的手机号'
        });
        return;
      }

      const area = this.$refs.area.value.split(',');
      // eslint-disable-next-line camelcase
      const area_code = this.$refs.area_code.value.split(',');

      this.addressData.province_name = area[0];
      this.addressData.city_name = area[1];
      this.addressData.county_name = area[2];

      this.addressData.province = area_code[0];
      this.addressData.city = area_code[1];
      this.addressData.county = area_code[2];
      this.$MkLoading.show({
        message: '正在保存',
        forbidClick: true
      });

      let allSkuInfo = _.cloneDeep(this.$store.state.course.allSkuInfo);
      if (!this.isDefaultAddress) {
        console.log(this.addressData, 'addressData=======');
        allSkuInfo.order_user_address = {
          province_name: this.addressData && this.addressData.province_name,
          province: this.addressData && this.addressData.province,
          city_name: this.addressData && this.addressData.city_name,
          city: this.addressData && this.addressData.city,
          county_name: this.addressData && this.addressData.county_name,
          county: this.addressData && this.addressData.county,
          detail: this.addressData && this.addressData.detail,
          name: this.addressData && this.addressData.name,
          phone: this.addressData && this.addressData.phone
        };
        this.$store.commit('course/SET_SKU_INFO', allSkuInfo);
      } else {
        this.addressData.is_default = 1;
        let data = _.cloneDeep(this.addressData);
        data.country = data.county;
        data.country_name = data.county_name;
        delete data.county;
        delete data.county_name;
        const address = await createAddress(data);
        if (!address.data) {
          this.$MkLoading.hide();
          this.$MkToast('保存失败');
          return;
        }
        // 更新仓库值
        allSkuInfo.user_address = {
          province: this.addressData && this.addressData.province,
          province_name: this.addressData && this.addressData.province_name,
          city: this.addressData && this.addressData.city,
          city_name: this.addressData && this.addressData.city_name,
          county: this.addressData && this.addressData.county,
          county_name: this.addressData && this.addressData.county_name,
          detail: this.addressData && this.addressData.detail,
          name: this.addressData && this.addressData.name,
          phone: this.addressData && this.addressData.phone,
          addr_id: address.data
        };
        this.$store.commit('course/SET_SKU_INFO', allSkuInfo);
      }
      this.$MkLoading.hide();
      this.successToast = this.$MkToast({
        type: 'success',
        duration: 900,
        message: '保存成功'
      });

      sleep(900).then(() => {
        this.isSaved = true;
        if (this.channel) {
          closeWebView();
        } else {
          this.$router.go(-1);
        }
        this.successToast = null;
      });
    }
  },

  beforeRouteLeave(to, from, next) {
    this.inputBlur();

    if (this.isSaved) {
      next();
      return;
    }

    const mainFunction = async () => {
      if (!this.isModifyAddress()) {
        try {
          await Dialog.confirm({
            title: '提示',
            message: '编辑的信息将不会被保存，是否确认离开？',
            confirmButtonColor: '#FF8A66',
            cancelButtonColor: '#222222',
            width: '66.66%'
          });
          next();
        } catch (error) {
          next(false);
        }
      } else {
        next();
      }
    };

    mainFunction();
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(250, 250, 250, 1);

  .head:before {
    height: 75px;
    background: #fff;
    width: 100%;
    content: '';
    display: block;
  }
  .head {
    flex: 1;

    .list {
      width: 100%;
      background: #fff;
      flex-direction: column;

      .row {
        margin: 0px 40px;
        height: 121px;
        position: relative;
        &::after {
          content: '';
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          border-bottom: 1px solid #e5e5e5;
          transform: scale(0.5);
          transform-origin: 0 0;
          padding: 1px;
          box-sizing: border-box;
          pointer-events: none;
        }

        .conb {
          height: 62px;
          font-size: 30px;
          font-weight: bold;
          color: #222;
          line-height: 80px;
          font-family: QanelasSoftDEMO-Medium;
        }
        .area-input {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        input {
          width: 100%;
          height: 62px;
          font-size: 30px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 42px;
          margin: 32px 0px 29px 0px;
        }
        input::-webkit-input-placeholder {
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
        }

        i {
          top: 41px;
          right: 0px;
          position: absolute;
          background: url('~images/personal/order/arrow@2x.png') no-repeat;
          background-size: 18px 32px;
          width: 34px;
          height: 34px;
          display: block;
        }
      }

      .last-row {
        margin: 0px 40px;
        height: 242px;

        textarea {
          height: 160px;
          margin-top: 40px;
          width: 100%;
          row: 3;
          font-size: 30px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 42px;
        }
      }
    }
  }

  .foot {
    height: 160px;
    width: 100%;
    text-align: center;
    .btn,
    .btn_unable {
      margin: 0 auto;
      background: url('~images/personal/coupon/btn-bg@2x.png');
      background-size: 100%;
      display: block;
      width: 590px;
      line-height: 90px;
      height: 90px;
      font-size: 34px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 500;
      color: #fff;
    }
    .btn_unable {
      background: url('~images/personal/coupon/btn-disable@2x.png');
      background-size: 100%;
      color: #999;
    }
  }
}

button.van-picker__cancel,
.van-picker__confirm {
  color: #fff;
}
</style>
