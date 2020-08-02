import Vue from 'vue';

/**
 * @description 集团用户中台api操作
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-16
 */

/**
 * @description 获取用户中心code码
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-16
 */
export function getUserCenterCode () {
  return new Promise((resolve, reject) => {
    window.TAL_UC.checkToken({
      success (response) {
        if (response.errcode === 0) {
          resolve(response);
        } else {
          reject(response);
        }
      },
      fail (error) {
        reject(error);
      },
    });
  });
}

/**
 * @description 获取手机验证码
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-16
 */
export function getSMSCodeLogin ({
  // eslint-disable-next-line camelcase
  verify_type = 1,
  // eslint-disable-next-line camelcase
  phone_code = '86',
  phone = '',
}) {
  return new Promise((resolve, reject) => {
    const methodName = 'sendSMSCodeLogin';
    const option = {
      data: { verify_type, phone_code, phone },
      success (response) {
        commonSuccessHandle({
          methodName,
          option,
          response,
          resolve,
          reject,
        });
      },
      fail (error) {
        reject(error);
      },
    };

    window.TAL_UC.sendSMSCodeLogin(option);
  });
}

/**
 * @description 用户中心短信验证登录
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-16
 */
export function postUserCenterLoginSms ({
  phone = '',
  // eslint-disable-next-line camelcase
  phone_code = 86,
  // eslint-disable-next-line camelcase
  sms_code = '',
}) {
  return new Promise((resolve, reject) => {
    const methodName = 'loginSms';
    const option = {
      data: {
        phone, // 地区不同手机号码规则不同
        phone_code, // 手机地区码
        sms_code, // 短信验证码
      },
      success (response) {
        commonSuccessHandle({
          methodName,
          option,
          response,
          resolve,
          reject,
        });
      },
      fail (error) {
        reject(error);
      },
    };

    window.TAL_UC.loginSms(option);
  });
}

/**
 * @description 验证码登录、发送短信success回调通用处理
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-26
 * @param {*} {
 *   methodName = '',
 *   option = {},
 *   response = {},
 *   resolve,
 *   reject,
 * }
 */
function commonSuccessHandle ({
  methodName = '',
  option = {},
  response = {},
  resolve,
  reject,
}) {
  if (response.errcode === 0) {
    resolve(response);
  } else if (response.errcode === 11021) {
    new Vue().$MkToast('滑块验证通过后，会自动触发');
    // 需要展示滑块
    const param = {
      // 滑动验证通过时执行方法名，（即触发滑块的原方法，例如：登录（loginSms），
      // 获取验证码（sendSmsCodeLogin），校验旧手机（checkPhone））
      slideCallback: methodName,
      // 前端滑动验证通过时执行方法名的参数（例如手机号，验证码,success和fail等等）
      slideParams: option,
      // 方法名出错
      failCallback (error) {
        // errmsg 错误字段
        reject(error);
      },
    };

    // 展示滑块
    window.TAL_UC.showSlide(param);
  } else {
    reject(response);
  }
}
