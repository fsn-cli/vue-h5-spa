import { getWxConfig } from '@/api/global';
import { isWeiXin } from '@/utils/platformHelper';

/**
 * @description 微信分享，分享朋友圈、朋友
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-23
 * @param {*} { title = '', desc = '', link = '', imgUrl = '' }
 * @returns
 */
export function wxShare ({ title = '', desc = '', link = '', imgUrl = '' }) {
  return new Promise((resolve, reject) => {
    if (!isWeiXin()) {
      return;
    }

    async function registerWxConfig () {
      const url = encodeURIComponent(window.location.href.split('#')[0]);
      const response = await getWxConfig({ url });
      const { appId, timestamp, signature, nonceStr } = response.data;

      window.wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名
        jsApiList: [
          'onMenuShareTimeline', // 朋友圈
          'onMenuShareAppMessage', // 微信朋友
        ], // 必填，需要使用的JS接口列表
      });

      window.wx.ready(() => {
        // 朋友圏分享
        window.wx.onMenuShareTimeline(
          shareParams({ title, desc, link, imgUrl, resolve })
        );

        // 朋友分享
        window.wx.onMenuShareAppMessage(
          shareParams({ title, desc, link, imgUrl, resolve })
        );
      });

      window.wx.error(error => {
        reject(error);
      });
    }

    registerWxConfig();
  });
}

/**
 * @description 微信分享公共参数
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-23
 * @param {*} {
 *   title = '',
 *   desc = '',
 *   link = '',
 *   imgUrl = '',
 *   resolve,
 * }
 * @returns
 */
function shareParams ({
  title = '',
  desc = '',
  link = '',
  imgUrl = '',
  resolve,
}) {
  return {
    title,
    desc,
    link,
    imgUrl,
    // 分享成功
    success (response) {
      resolve(response);
    },
    // 取消分享
    cancel (response) {
      resolve(response);
    },
  };
}
