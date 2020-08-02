import { loading } from '@/utils/loading';

export default [
  {
    path: '/pay',
    name: 'payment',
    meta: {
      title: '付款',
      webBack: true, // 判断是否调用webview的history.go(-1)
      // isLogin: true,
    },
    component: (resolve, reject) => {
      loading.show();
      import(/* webpackChunkName: "payment" */ '@/views/payment/pay')
        .then(module => {
          loading.hide();
          resolve(module.default);
        })
        .catch(err => {
          loading.hide();
          reject(err);
        });
    },
  },
  {
    path: '/payRes',
    name: 'payRes',
    meta: {
      title: '支付成功',
      isLogin: true,
      hasClose: true,
    },
    component: () =>
      import(/* webpackChunkName: "payRes" */ '@/views/payment/pay-result'),
  },
];
