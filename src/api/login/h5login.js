import { getData } from 'api/api';
import { toAppLogin } from '@/utils/jsBridge';
import { getWxAuth } from '@/utils';
import { getUserCenterCode } from '@/utils/passport';
import { setLocalMonkeyCode, removeLocalMonkeyCode } from '@/utils/local';
import { sensorsLogin } from '@/trackPoint/trackPoint';
import router from '@/router';

// 获取token
export function getH5Token(params) {
  const url = `/ucenter/api/v1/account/code_login`;
  return getData({ url, data: params });
}

// 获取token
// eslint-disable-next-line camelcase
export function getToken({ code = '', auth = '', from_user_id = '', from_channel = '' }) {
  const url = `/ucenter/api/v1/account/code_login`;
  return getData({ url, data: { code, auth, from_user_id, from_channel } });
}

export async function codeLogin({
  auth = '',
  code = '',
  path = '',
  query = {},
}) {
  // 清除code码
  removeLocalMonkeyCode();

  // 获取token
  try {
    const response = await getToken({
      code,
      auth,
    });

    if (response.code === 200) {
      const { data } = response;
      localStorage.setItem('token', data.tal_token);
      localStorage.setItem('userId', data.user_id);
      localStorage.setItem('platform', 'h5');
      localStorage.setItem('mathOpenId', data.openid);

      sensorsLogin(data.user_id);

      const newQuery = { ...query };
      // 删除微信登录回调参数
      delete newQuery.auth;
      delete newQuery.app_code;
      router.replace({
        path,
        query: newQuery,
      });
    } else {
      getWxAuth();
    }
  } catch (error) {
    getWxAuth();
  }
}

export async function toLogin(redirectPath) {
  const platform = localStorage.getItem('platform');
  if (platform === 'ios' || platform === 'android') {
    let from = '';
    if (redirectPath) {
      from = redirectPath.split('?')[0] || redirectPath;
    } else {
      from = router.currentRoute.path.slice(1);
    }
    toAppLogin(from);
  } else {
    // 不考虑端外登录
    // const { fullPath } = router.currentRoute;
    // const fromWherePath = redirectPath || fullPath;

    // 保存当前路径，登录页会进行使用
    // sessionStorage.setItem('fromWhere', fromWherePath);

    // 获取集团中台用户中心code码
    // try {
    //   const response = await getUserCenterCode();
    //   const { code } = response.data;

    //   // 将code写入sessionStorage中
    //   setLocalMonkeyCode(code);

    //   // 重定向到当前页面，取得auth参数
    //   getWxAuth(fromWherePath);
    // } catch (error) {
    //   console.log(error, 'error');
    //   // 需要重定向到登录页进行登录
    //   getWxAuth();
    // }
  }
}
