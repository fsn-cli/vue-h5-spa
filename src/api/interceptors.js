import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import { toLogin } from 'api/login/h5login';
import { getAppCommonParams, getH5CommonParams } from '@/utils/local';
import { getPlatform } from '@/utils/platformHelper';

axios.defaults.baseURL = `${document.location.protocol}//${process.env.BASE_URL}`;
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8;';

// 请求发起前的拦截器  对数据加密
axios.interceptors.request.use(
  config => {
    let params = null;
    // 老版本走的是h5公共参数
    if (getPlatform() === 'app') {
      params = getAppCommonParams();
    } else {
      params = getH5CommonParams();
    }

    // 将通用参数赋给headers
    for (let key in params) {
      params[key] && (config.headers[key] = params[key]);
    }

    // 赋值token
    const token = localStorage.getItem('token');
    token && (config.headers['CUSTOM-TAL-TOKEN'] = token);

    // 序列化参数
    if (config.headers['Content-Type'] !== 'application/json;charset=UTF-8') {
      // 兼容增长落地页获取请求链接
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// 请求返回的拦截器  解密返回的数据
axios.interceptors.response.use(
  response =>
    response.status === 200
      ? Promise.resolve(response)
      : Promise.reject(response),
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
    } else {
      toast('网络繁忙，请稍后再试！');
    }

    return Promise.reject(error);
  }
);

const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      login();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      toast('登录过期，请重新登录');
      localStorage.removeItem('token');
      setTimeout(() => {
        login();
      }, 1000);
      break;
    // 404请求不存在
    case 404:
      toast('404');
      break;
    default:
      toast(other);
  }
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const login = () => {
  toLogin();
};

const toast = msg => {
  new Vue().$MkToast({ type: 'warn', message: msg });
};

export { axios, toast, login };
