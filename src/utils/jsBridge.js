import Vue from 'vue';
import { sensorsLogin } from '@/trackPoint/trackPoint';
import router from './../router';

function safeCallback(cb) {
  console.log('bridgeReadyState: ', window.mk.isBridgeReady, '---cb:', cb);
  if (window.mk.isBridgeReady) {
    typeof cb === 'function' && cb();
  } else {
    window.mk.cbs.push(cb);
  }
}

// 调用app分享
// option =
//  url: 分享的页面链接,
//  title: 分享链接的标题
//  desc: 分享链接的描述，
//  img: 图片链接，
//  linkImg: 缩略图图片链接，
//  etc...
//
// isShowPoster ： 是否分享海报，默认不分享
// img: 海报图片链接
// avatar: 海报用户头像，
// inviteDesc: 海报头像右侧分享描述（eg: 孩子很喜欢小猴思维，我也邀请你一起学）
// qrcode: 二维码链接
// price: 现价
// originPrice: 原价
// incentive: 优惠提示语（eg: 打卡4天，返券49元）
export function appShare(option) {
  safeCallback(() => {
    window.mk.share(option, (status) => {
      // responseCallback();
      if (status === '1' || status === '0') {
        option[0].callback();
      }
    });
  });
}

// 传递分享参数给app
export function sendShareInfoToApp(option) {
  safeCallback(() => {
    window.mk.setShareInfo(option);
  });
}

// app支付
export function toAppPay(option) {
  safeCallback(() => {
    window.mk.requestPayment(option, function (status) {
      if (status === '0' || status === '9000') {
        option.callback && option.callback(status);
      } else {
        new Vue().$MkToast({ type: 'warn', message: '支付取消' });
      }
    });
  });
}

// app登录页
export function toAppLogin(from) {
  safeCallback(() => {
    window.mk.open(
      {
        url: `wangxiaohmk://native/login?from=${from}`,
      },
      function (res) {
        res = JSON.parse(res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user_id);
        localStorage.setItem('platform', res.platform);
        localStorage.setItem('clientId', res.client_id);

        sensorsLogin(res.user_id);

        router.replace({
          path: router.currentRoute.path,
          query: {
            token: res.token,
            user_id: res.user_id,
            platform: res.platform,
          },
        });
      }
    );
  });
}

// 跳转到首页
export function toHomePage(index) {
  safeCallback(() => {
    window.mk.open(
      {
        url: `wangxiaohmk://native/home?index=${index}`,
      },
      function () { }
    );
  });
}

// 供app调用，判断是否是走h5 history
// 参数：flag '1':history.go(-1) '0':app原生回退
export function isWebBack(flag) {
  safeCallback(() => {
    window.mk.webBack(flag);
  });
}

// 供app调用，X按钮
// 参数：toPath 关闭之后去到的某个页面(h5页面)，默认不传值关闭原生webview
export function webClose(toPath = '') {
  safeCallback(() => {
    window.mk.webClose(toPath);
  });
}

// 添加微信
export function addWechat(wxNo, periodId, classType, nickName, teacherName, subject, wechatSource) {
  safeCallback(() => {
    window.mk.addWechat({
      subject,
      teacher_wechat: `${wxNo}`,
      period_id: `${periodId}`,
      class_type: `${classType}`,
      nick_name: `${nickName}`,
      teacher_name: `${teacherName}`,
      wechat_source: wechatSource,
    });
  });
}

// 控制导航栏按钮显示
// 参数：
// isShowReturn 是否显示返回(0 or 1)，默认显示
// isShowClose
// isShowShare
export function controlNavigationBar({ isShowClose = '0', isShowShare = '0' }) {
  safeCallback(() => {
    window.mk.controlNavigationBar({
      isShowClose: `${isShowClose}`,
      isShowShare: `${isShowShare}`,
    });
  });
}

// h5通知客户端购买课程结果
export function sendPurchaseResult({ courseType = 0, result = 0 }) {
  safeCallback(() => {
    window.mk.purchaseResult({
      courseType: `${courseType}`,
      result: `${result}`,
    });
  });
}

// 获取用户是否安装微信和支付宝
export function getAppPayWay(cb) {
  safeCallback(() => {
    window.mk.getPayType(function (v) {
      typeof v === 'string' ? cb(JSON.parse(v)) : cb(v);
    });
  });
}

// h5页面的退出事件
export function leaveH5Page(option) {
  safeCallback(() => {
    window.mk.onLeavePage(function () {
      option.callback();
    });
  });
}

// 关闭webView
export function closeWebView() {
  safeCallback(() => {
    window.mk.closeWebView();
  });
}

// 拦截客户端点击返回
export function stopBack(option) {
  safeCallback(() => {
    window.mk.onBackClick(function () {
      option();
    });
  });
}

// 取消拦截客户端点击返回
export function cancelStopBack() {
  safeCallback(() => {
    window.mk.offBackClick();
  });
}

/**
 * @description 退后台后控制页面的刷新时间以及时机
 * @param {Object} option
 * @param refreshType 0:  不刷新 1：每次进入/回到当前页面刷新 2：进入后台再次返回前台时，间隔时间超过refreshTime时刷新
 * @param refreshTime 间隔时间，单位ms
 */
export function refreshPage(option) {
  safeCallback(() => {
    window.mk.refreshPage(option);
  });
}
