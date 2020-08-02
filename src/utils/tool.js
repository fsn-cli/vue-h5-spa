import Vue from 'vue';

// 获取cookie、
export function getCookie (name) {
  let arr;
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) {
    return arr[2];
  } else {
    return null;
  }
}

// 设置cookie
export function setCookie (name, value, expiredays) {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    name +
    '=' +
    escape(value) +
    (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
}

// 封装sessionStorage
export const storage = {
  get (key) {
    if (key == null || typeof key !== 'string') {
      return '';
    }
    try {
      return JSON.parse(sessionStorage.getItem(key)) || '';
    } catch (e) {
      return sessionStorage.getItem(key) || '';
    }
  },
  set (key, value) {
    if (value == null) {
      return sessionStorage.removeItem(key);
    }
    sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  },
  remove (key) {
    console.log(key);
    return sessionStorage.removeItem(key);
  },
};

/**
 * 将数值四舍五入后格式化.
 *
 * @param num 数值(Number或者String)
 * @param cent 要保留的小数位(Number)
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
 * @return 格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatNumber (num, cent, isThousand) {
  if (typeof num === 'string') {
    // eslint-disable-next-line no-useless-escape
    num = num.replace(/\$|\,/g, '');
  }
  // num = num.toString().replace(/\$|\,/g, '');

  // 检查传入数值为数值类型
  if (isNaN(num)) {
    num = '0';
  }

  // 获取符号(正/负数)
  // eslint-disable-next-line eqeqeq
  let sign = num == (num = Math.abs(num));

  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
  let cents = num % Math.pow(10, cent); // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值
  cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度

  // 补足小数位到指定的位数
  while (cents.length < cent) {
    cents = '0' + cents;
  }

  if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num =
        num.substring(0, num.length - (4 * i + 3)) +
        ',' +
        num.substring(num.length - (4 * i + 3));
    }
  }

  if (cent > 0) {
    return (sign ? '' : '-') + num + '.' + cents;
  } else {
    return (sign ? '' : '-') + num;
  }
}

/**
 * 格式化时间
 *
 * @param date 任意格式时间及时间戳
 * @param splitChar 分割符
 */
export function formatDate (date, splitChar) {
  date = date || new Date();
  splitChar = splitChar || '-';

  let typeStr = Object.prototype.toString.call(date);
  let result = typeStr.replace(/\[object\s+(\w+)\]/gim, '$1');
  let type = result.toLowerCase();
  if (type === 'number') date = new Date(date);
  else if (type === 'string') date = new Date(date);
  else if (type !== 'date') date = new Date();

  // var str = date.toString(); // Sun Apr 01 2018 21:57:48 GMT+0800 (CST)
  let year = date.getFullYear();
  let month = addZero(date.getMonth() + 1);
  let day = addZero(date.getDate());
  let res = year + '-' + month + '-' + day;
  if (splitChar && splitChar !== '-') res = res.replace(/-/gim, splitChar);
  return res;

  function addZero (n) {
    return n < 10 ? '0' + n : n;
  }
}

// 解决js运算精度丢失问题  加法
export function add (arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}
// 解决js运算精度丢失问题  减法
export function cut (arg1, arg2) {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  // last modify by deeka
  // 动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

export function checkIsonLine () {
  if (!window.navigator.onLine) {
    new Vue().$MkToast('网络异常，请检查网络');
    return false;
  }
  return true;
}

/**
 * @description 是否最新app版本
 * @author Renliang
 * @date 2019-12-27
 * @param version 当前版本
 * @returns boolean 是否
 */
export function isLastAppVersion (version) {
  return version === process.env.VUE_APP_LAST_VERSION;
}

/**
 * @description 获取路径中的参数
 * @param url 传入的路径
 * @returns Obj
 */
export function getQueryObj (url) {
  let theQueryObj = {};
  if (url) {
    if (url.indexOf('?') !== -1) {
      const str = url.split('?')[1];
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        theQueryObj[strs[i].split('=')[0]] = strs[i].split('=')[1];
      }
    }
  }
  return theQueryObj;
}
