/**
 * @description 重定向到微信端，获取微信平台回调参数auth
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-16
 * @param {string} redirectPath 重定向的路径，router中配置的路径
 */
export function getWxAuth(redirectPath) {
  const origin = window.location.origin;
  const routerBasePath = process.env.VUE_APP_ROUTER_BASE_URL;

  redirectPath = `${origin}${routerBasePath.substr(
    0,
    routerBasePath.length - 1
  )}${redirectPath || '/login'}`;

  const newHref = `${origin}/ucenter/thought/wechat_auth?target_url=${redirectPath}`;

  try {
    window.location.replace(newHref);
  } catch (error) {
    window.location.href = newHref;
  }
}

/**
 * @description 重定向到微信端，获取微信平台回调参数auth 静默授权
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-16
 * @param {string} redirectPath 重定向的路径，router中配置的路径
 */
export function getWxAuthBySessionScope(redirectPath) {
  const origin = window.location.origin;
  const routerBasePath = process.env.VUE_APP_ROUTER_BASE_URL;

  redirectPath = `${origin}${routerBasePath.substr(
    0,
    routerBasePath.length - 1
  )}${redirectPath || '/login'}`;

  const newHref = `${origin}/ucenter/thought/wechat_base_auth?target_url=${redirectPath}`;

  try {
    window.location.replace(newHref);
  } catch (error) {
    window.location.href = newHref;
  }
}

/**
 * @description 获取当前 年月日时
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-20
 * @returns {string} 2019102012
 */
export function getCurrentDateHour() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();

  return `${year}${month}${day}${hours}`;
}

/**
 * @description 获取当前页面的地址，不含query内容
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-30
 * @returns {string} eg: https://test.imonkey.xueersi.com/static/monkey-chinese/bonusMall
 */
export function getCurrentHref() {
  const queryIndex = window.location.href.indexOf('?');
  const substrIndex = queryIndex > 0 ? queryIndex : window.location.href.length;
  return window.location.href.substr(0, substrIndex);
}

/**
 * @description 休息多少毫秒
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-11-04
 * @param {number}} mills eg: 900 -> 休息900毫秒
 * @returns
 */
export function sleep(mills) {
  return new Promise(resolve => setTimeout(resolve, mills));
}

/**
 * @description 获取url的参数
 * @author Xi CuiCui <xicuicui@100tal.com>
 * @date 2020-2-4
 * @returns {string} eg
 */
export function getCurrentHrefParams() {
  const paramsStr = window.location.href.split('?')[1];
  const paramsArr = paramsStr.split('&');
  let obj = {};
  for(let i = 0; i < paramsArr.length; i++) {
    obj[paramsArr[i].split('=')[0]] = paramsArr[i].split('=')[1];
  }

  return obj;
}