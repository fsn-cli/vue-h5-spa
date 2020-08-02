import sensors from '@/sdk/sensors';
import { getPlatform } from '@/utils/platformHelper';
const userId = localStorage.getItem('userId');

const common = {
  stu_id: userId || '',
  event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  event_time: new Date(),
  subject_belong: '思维',
};

/**
 * 登录页_曝光
 */
export const loginPageShow = data => {
  const pre = {
    event_type: '页面',
    event_smalltype: '普通页面',
    event_name: 'loginpage_show',
    event_displayname: '登录页_曝光',
  };

  sensors.track('loginpage_show', {
    ...common,
    ...pre,
    ...data,
  });
};

/**
 * 登录页_获取验证码
 */
export const loginPageVerifyCode = () => {
  const pre = {
    event_type: '按钮',
    event_smalltype: '普通按钮',
    event_name: 'loginpage_verifycode',
    event_displayname: '登录页_获取验证码',
  };

  sensors.track('loginpage_verifycode', {
    ...common,
    ...pre,
  });
};

/**
 * 登录页_登录成功
 */
export const loginPageSuccess = data => {
  const pre = {
    event_type: '页面',
    event_smalltype: '普通页面',
    event_name: 'loginpage_success',
    event_displayname: '登录页_登录成功',
  };

  sensors.track('loginpage_success', {
    ...common,
    ...pre,
    ...data,
  });
};
