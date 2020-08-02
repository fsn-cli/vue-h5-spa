// 兑换码埋点
import sensors from '@/sdk/sensors';
import { getPlatform } from '@/utils/platformHelper';
// 预置属性
let preParams = {
  distinct_id: window.localStorage.getItem('userId'),
  stu_id: window.localStorage.getItem('userId'),
  event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  event_time: new Date(),
  subject_belong: '思维'
};
/** 个人中心_优惠券_兑换优惠券 */
export const sensorsExchangeCode = params => {
  sensors.track('usercenter_coupon_redeem', {
    event_type: '按钮',
    event_smalltype: '普通按钮',
    event_name: 'usercenter_coupon_redeem',
    event_displayname: '个人中心_优惠券_兑换优惠券',
    ...preParams,
    ...params,
  });
};
/** 优惠券选择页 */
export const sensorsCouponSelect = params => {
  sensors.track('pay_choose_coupon', {
    event_time: new Date(),
    event_name: 'pay_choose_coupon',
    event_displayname: '优惠券选择页',
    ...preParams,
    ...params,
  });
};
/** 优惠券选择页_兑换优惠券 */
export const sensorsChooseCouponRedeem = params => {
  sensors.track('pay_choose_coupon_redeem', {
    event_type: '按钮',
    event_smalltype: '普通按钮',
    event_name: 'pay_choose_coupon_redeem',
    event_displayname: '优惠券选择页_兑换优惠券',
    ...preParams,
    ...params,
  });
};
/** 优惠券选择页_确定 */
export const sensorsChooseCouponConfirm = params => {
  sensors.track('pay_choose_coupon_confirm', {
    event_time: new Date(),
    event_name: 'pay_choose_coupon_confirm',
    event_displayname: '优惠券选择页_确定',
    ...preParams,
    ...params,
  });
};
