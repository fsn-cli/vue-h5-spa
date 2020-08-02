export default [
  {
    path: '/login',
    name: 'h5login',
    meta: {
      title: '登录',
    },
    component: () =>
      import(/* webpackChunkName: "h5login" */ '@/views/login/login'),
  },
];
