import sensors from '@/sdk/sensors';
import { getLocalUserId } from '@/utils/local';
import { getPlatform } from '@/utils/platformHelper';

const common = {
  stu_id: localStorage.getItem('userId') || '',
  event_belong: getPlatform() === 'app' ? '小猴启蒙app' : '', // todo
  gender: '男', // todo
  birthday: '2014-06-01', // todo
  register_time: '2020-06-05 18:19:22 ' // todo
};

/**
 * 神策登录，保存用户userId
 */
export const sensorsLogin = userId => {
  userId = userId || getLocalUserId();

  if (userId) {
    try {
      sensors.login(userId);
    } catch (error) { }
  }
};

/**
 * 付款详情页
 */
export const sensorsPayDetail = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'pay_detail',
    event_displayname: '付款详情页',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',

  };
  sensors.track('pay_detail', { ...common, ...pre, ...params });
};
/**
 * 系统课详情页
 */
export const sensorsSystemClass = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'sysclass_detail',
    event_displayname: '系统课介绍页',
    event_belong: getPlatform() === 'app' ? '小猴启蒙app' : '',
  };
  sensors.track('sysclass_detail', { ...common, ...pre, ...params });
};

/**
 * 系统课详情页_曝光
 */
export const sensorsSystemClassShow = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'sysclass_detail_show',
    event_displayname: '系统课介绍页_曝光',
    event_belong: getPlatform() === 'app' ? '小猴启蒙app' : '',
  };
  console.log('------params : ', { ...common, ...pre, ...params });
  sensors.track('sysclass_detail_show', { ...common, ...pre, ...params });
};

/**
 * 系统课详情页_活动
 */
export const sensorsSystemClassDetailActivity = params => {
  const pre = {
    event_time: new Date(),
    event_name: 'sysclass_detail_activity',
    event_displayname: '系统课详情页_活动',
  };
  sensors.track('sysclass_detail_activity', { ...common, ...pre, ...params });
};

/**
 * 系统课介绍页_底部按钮
 */
export const sensorsSystemClassBotBtn = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'sysclass_detail_button',
    event_displayname: '系统课详情页_底部按钮',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('sysclass_detail_button', { ...common, ...pre, ...params });
};

/**
 * 系统课介绍页_选购页
 */
export const sensorsSystemClassBuyconfitm = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'sysclass_detail_buyconfirm',
    event_displayname: '系统课介绍页_选购页',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('sysclass_detail_buyconfirm', { ...common, ...pre, ...params });
};
/**
 * 系统课介绍页_选购页_去支付
 */
export const sensorsSystemClassBuyconfitmPay = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'sysclass_detail_buyconfirm_pay',
    event_displayname: '系统课介绍页_选购页_去支付',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('sysclass_detail_buyconfirm_pay', {
    ...params,
    ...common,
    ...pre,
  });
};

/**
 * 付款详情页_确认支付
 */
export const sensorsPayDetailConfirm = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'pay_detail_payconfirm',
    event_displayname: '付款详情页_确认支付',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('pay_detail_payconfirm', { ...common, ...pre, ...params });
};

/**
 * 体验课介绍页_曝光
 */
export const sensorsExperienceClassShow = params => {
  const pre = {
    event_time: new Date(),
    event_name: 'expclass_detail_show',
    event_displayname: '体验课介绍页_曝光'
  };
  sensors.track('expclass_detail_show', { ...common, ...pre, ...params });
};

/**
 * 体验课详情页_活动
 */
export const sensorsExperienceClassDetailActivity = params => {
  const pre = {
    event_time: new Date(),
    event_name: 'expclass_detail_activity',
    event_displayname: '体验课详情页_活动',
    purchase_status: '', // todo待定
  };
  console.log(params, 'params');
  sensors.track('expclass_detail_activity', { ...common, ...pre, ...params });
};

/**
 * 体验课程详情页
 */
export const sensorsExperienceClass = params => {
  const pre = {
    event_time: new Date(),
    event_name: 'expclass_detail',
    event_displayname: '体验课详情页',
  };
  sensors.track('expclass_detail', { ...common, ...pre, ...params });
};

/**
 * 体验课介绍页_选购页
 */
export const sensorsBuyConfirm = params => {
  const pre = {
    event_time: new Date(),
    event_name: 'expclass_detail_buyconfirm',
    event_displayname: '体验课介绍页_选购页'
  };
  sensors.track('expclass_detail_buyconfirm', { ...common, ...pre, ...params });
};
/**
 * 体验课介绍页_选购页_去支付
 */
export const sensorsBuyConfirmBtn = params => {
  const pre = {
    event_time: new Date(),
    stu_id: localStorage.getItem('userId') || '',
    event_name: 'expclass_detail_buyconfirm_pay',
    event_displayname: '体验课介绍页_选购页_去支付',
  };
  sensors.track('expclass_detail_buyconfirm_pay', {
    ...params,
    ...common,
    ...pre,
  });
};
/**
 * 体验课介绍页_底部按钮
 */
export const sensorsExperienceBotBtn = params => {
  const pre = {
    event_time: new Date(),
    event_name: 'expclass_detail_button',
    event_displayname: '体验课介绍页_底部按钮',
  };
  sensors.track('expclass_detail_button', {
    ...common,
    ...pre,
    ...params,
  });
};
/**
 * 支付成功页面
 */
export const sensorsPaySuccess = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'pay_success',
    event_displayname: '支付成功页面',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('pay_success', { ...common, ...pre, ...params });
};

/**
 * 点击下载app
 */
export const sensorsDownloadAppClick = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'download_app_click',
    event_displayname: '下载APP_点击',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('download_app_click', { ...common, ...pre, ...params });
};

/**
 * 添加微信卡片_曝光
 */
export const sensorsAddWeiXinShow = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'addweixin_show',
    event_displayname: '添加微信卡片_曝光',
  };
  sensors.track('addweixin_show', { ...common, ...pre, ...params });
};

/**
 * 添加微信
 */
export const sensorsAddWeiXin = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_time: new Date(),
    event_name: 'addweixin',
    event_displayname: '添加微信',
  };
  sensors.track('addweixin', { ...common, ...pre, ...params });
};

/**
 * 日报周报页
 */
export const sensorsReport = (eventName, params) => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_type: '页面',
    event_smalltype: '普通页面',
    event_name: eventName,
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };

  sensors.track(eventName, {
    ...common,
    ...pre,
    ...params,
  });
};

/**
 * 日报周报页 按钮类型
 */
export const sensorsReportBtn = (eventName, params) => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_type: '按钮',
    event_smalltype: '普通按钮',
    event_name: eventName,
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };

  sensors.track(eventName, {
    ...common,
    ...pre,
    ...params,
  });
};

/**
 * 个人中心_优惠券
 */
export const userCenterCoupon = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_type: '页面',
    event_smalltype: '普通页面',
    event_name: 'usercenter_coupon',
    event_displayname: '个人中心_优惠券',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('usercenter_coupon', { ...common, ...pre, ...params });
};

/**
 * 打卡界面_分享
 */
export const clockInShare = params => {
  const pre = {
    stu_id: localStorage.getItem('userId') || '',
    event_type: '按钮',
    event_smalltype: '普通按钮',
    event_name: 'punchcard_share',
    event_displayname: '打卡界面_分享',
    event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  };
  sensors.track('punchcard_share', { ...common, ...pre, ...params });
};
