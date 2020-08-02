import { axios, toast } from './interceptors';
import { toLogin } from 'api/login/h5login';
import { loading as utilsLoading } from '@/utils/loading';

function checkCode(response, isToastErr) {
  utilsLoading.hide();

  if (response.data.code === 200) {
    return response.data;
  } else if (response.data.code === 10100) {
    toast(response.data.msg);
    toLogin();
  } else {
    if (isToastErr) {
      toast(response.data.msg);
    }
    return response.data;
  }
}

/**
 * @param {String} url ajax请求地址
 * @param {Object} data data
 * @param {String} method method
 * @param {Boolean} loading 是否展示loading 默认不展示
 * @param {Boolean} isToastErr 是否展示非200toast 默认展示
 * @param {Object} headers headers
 * @return Promise 返回Promise 可以链式调用
 */
export function getData({
  url,
  data = {},
  method = 'post',
  loading = false,
  isToastErr = true,
  headers,
}) {
  loading && utilsLoading.show();
  let options = {
    method: method,
    url: url,
    dataType: 'json',
    headers,
  };
  // POST参数s
  if (method.toLowerCase() === 'post') {
    options['data'] = {
      ...data,
    };
  } else if (method.toLowerCase() === 'get') {
    // GET参数
    options['params'] = {
      ...data,
    };
  }

  return axios(options).then(v => {
    return checkCode(v, isToastErr);
  });
}
