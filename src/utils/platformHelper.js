export function judgeIos() {
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  return isiOS;
}
export function judgeAdr() {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  return isAndroid;
}

// 微信浏览器
export function isWeiXin() {
  let ua = navigator.userAgent.toLowerCase();
  // eslint-disable-next-line eqeqeq
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

/**
 * @description 获取平台信息
 * @returns platform 平台信息
 */
export function getPlatform() {
  if (['ios', 'android'].includes(window.localStorage.getItem('platform'))) {
    return 'app';
  } else if (isWeiXin()) {
    return 'h5_weixin';
  } else {
    return 'h5_other';
  }
}
