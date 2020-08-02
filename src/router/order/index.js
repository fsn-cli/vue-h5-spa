export default [
  {
    path: '/order/address-edit',
    name: 'address-edit',
    meta: {
      title: '地址信息',
      webBack: true,
      isLogin: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "address-edit" */ '@/views/order/address-edit'
      ),
  },
];
