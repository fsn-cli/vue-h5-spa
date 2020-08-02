export default [
  {
    path: '/coupon/list',
    name: 'coupon-list',
    meta: {
      title: '优惠券列表',
      isLogin: false,
      webBack: true
    },
    component: () =>
      import(
        /* webpackChunkName: "coupon-list" */ '@/views/coupon/list'
      ),
  },
];
