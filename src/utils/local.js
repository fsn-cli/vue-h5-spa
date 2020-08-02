import { getCookie } from '@/utils/tool';

const TOKEN = 'token';
const USER_ID = 'userId';
const PLATFORM = 'platform';
const OPEN_ID = 'mathOpenId';
const LOGIN_CODE = 'imonkey_code';
const APP_VERSION = 'appVersion';
const COOKIE_TOKEN = 'CUSTOM-TAL-TOKEN';
const COOKIE_APP_CODE = 'CUSTOM-APP-CODE';
const COOKIE_CLIENTID = 'CUSTOM-CLIENTID';
const COOKIE_DEVICEID = 'CUSTOM-DEVICEID';
const COOKIE_PACKAGENAME = 'CUSTOM-PACKAGENAME';
const COOKIE_TALVERSION = 'CUSTOM-TALVERSION';
const USER_TYPE = 'USER-TYPE';

/**
 * @description 获取存储在local中token信息
 * @returns {string | Object} token | null
 */
export function getLocalToken() {
  return localStorage.getItem(TOKEN);
}

/**
 * @description 获取用户id信息
 * @returns
 */
export function getLocalUserId() {
  return localStorage.getItem(USER_ID);
}

/**
 * @description 获取平台信息
 * @returns {string | Object} h5、android、ios
 */
export function getLocalPlatform() {
  return localStorage.getItem(PLATFORM);
}

/**
 * @description 获取微信openId信息
 */
export function getLocalOpenId() {
  return localStorage.getItem(OPEN_ID);
}

/**
 * @description 设置集团中台免登code码
 * @param {string} [code='']
 */
export function setLocalMonkeyCode(code = '') {
  sessionStorage.setItem(LOGIN_CODE, code);
}

export function getLocalMonkeyCode() {
  return sessionStorage.getItem(LOGIN_CODE);
}

export function removeLocalMonkeyCode() {
  sessionStorage.removeItem(LOGIN_CODE);
}

export function getCookieToken() {
  return getCookie(COOKIE_TOKEN);
}

/**
 * @description 获取app通用参数
 */
export function getAppCommonParams() {
  return {
    'CUSTOM-APP-CODE': 4,
    'CUSTOM-CLIENTID': getCookie(COOKIE_CLIENTID),
    'CUSTOM-DEVICEID': getCookie(COOKIE_DEVICEID),
    'CUSTOM-PACKAGENAME': getCookie(COOKIE_PACKAGENAME),
    'CUSTOM-TALVERSION': getCookie(COOKIE_TALVERSION),
    'CUSTOM-GPSINFO': ''
  };
}

/**
 * @description 获取h5通用参数
 */
export function getH5CommonParams() {
  return {
    'CUSTOM-APP-CODE': 2,
    'CUSTOM-CLIENTID': process.env.VUE_APP_PASSPORT_CLIENT_ID,
    'CUSTOM-DEVICEID': getCookie(COOKIE_DEVICEID),
    'CUSTOM-TALVERSION': '1.0.0',
  };
}

export function getAppVersion() {
  return localStorage.getItem(APP_VERSION);
}

/**
 * @description 获取当前用户的用户类型（未登录，新用户，老用户）
 */
export function getUserType() {
  const userTypeMap = new Map([
    [0, "未登录"],
    [1, "新用户"],
    [2, "老用户"]
  ]);
  return userTypeMap.get(Number(getCookie(USER_TYPE)));
}

/**
 * @description 获取对象的数值，增加容错处理
 * @param {Object} obj 当前对象
 * @param {String} expr 获取的key
 * @param {any} defaultValue 默认值
 * @return {any} 返回值
 */
export function getObjValue(obj, expr, defaultValue = '') {
  const keys = expr.split('.');
  let data = obj;
  for (let index = 0; index < keys.length; index++) {
    data = data[keys[index]];
    if (data === undefined || data === null) {
      return defaultValue
    }
  }
  return data;
}
