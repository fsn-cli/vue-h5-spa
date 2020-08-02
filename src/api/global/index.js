// 售课提醒-微信内订阅状态
import { getData } from '@/api/api';

export function getWxConfig ({ url = '' }) {
  return getData({
    method: 'post',
    url: '/ucenter/api/v1/wechat/jssdk',
    data: { url },
    loading: false,
  });
}
