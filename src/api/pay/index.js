import { getData } from 'api/api';

// 下订单
export function createOrder(data) {
  const url = `/shop/order/create`;

  return getData({
    url,
    data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}
// 获取支付状态
export function getPayStatus({ orderId = 5 }) {
  const url = `/shop/order/pay_status?order_id=${orderId}`;
  return getData({ url, method: 'get', loading: false });
}

// 支付完成页数据
export function getPayResult({ orderId = 5 }) {
  const url = `/shop/order/pay_succ_info?order_id=${orderId}`;
  return getData({ url, method: 'get' });
}

// 微信内调用支付
// option：
// {
//     "appId": "wx2421b1c4370ec43b",     //公众号名称，由商户传入
//     "timeStamp": "1395712654",         //时间戳，自1970年以来的秒数
//     "nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串
//     "package": "prepay_id=u802345jgfjsdfgsdg888",
//     "signType": "MD5",         //微信签名方式：
//     "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
// }
export function getBrandWCPayRequest(option) {
  let options = {
    'appId': option.appId, // 公众号名称，由商户传入
    'timeStamp': option.timeStamp, // 时间戳，自1970年以来的秒数
    'nonceStr': option.nonceStr, // 随机串
    'package': option.package,
    'signType': option.signType, // 微信签名方式：
    'paySign': option.paySign, // 微信签名
    // appId: 'wx9e34231a45741257', //公众号名称，由商户传入
    // timeStamp: '1570786945', //时间戳，自1970年以来的秒数
    // nonceStr: 'Tlqo57gcT7FZ5CQg', //随机串
    // package: 'prepay_id=wx111742254574742f7a06d2ed1883271000',
    // signType: 'MD5', //微信签名方式：
    // paySign: 'A7637437459C4E0E876F774AB6582F15' //微信签名
  };
  function onBridgeReady() {
    // eslint-disable-next-line no-undef
    WeixinJSBridge.invoke('getBrandWCPayRequest', options, function (res) {
      // eslint-disable-next-line eqeqeq
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        option.callback && option.callback('0');
        // 使用以上方式判断前端返回,微信团队郑重提示：
        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      }
      // alert(res.err_msg);
    });
  }
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
}
