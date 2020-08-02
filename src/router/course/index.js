// import { loading } from '@/utils/loading';
export default [
  {
    path: '/experienceClass',
    name: 'experienceClass',
    meta: {
      title: '小猴思维体验课',
      hasShare: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "experienceClass" */ '@/views/course/ExperienceClass'
      ),
  },
  {
    path: '/experienceBackClass',
    name: 'experienceBackClass',
    meta: {
      title: '小猴思维体验课',
      hasShare: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "experienceClass" */ '@/views/course/ExperienceClass'
      ),
  },
  {
    path: '/systemClass',
    name: 'systemClass',
    meta: {
      title: '小猴思维系统课',
      hasShare: true,
    },
    component: (resolve, reject) => {
      // loading.show();
      import(/* webpackChunkName: "systemClass" */ '@/views/course/SystemClass')
        .then(module => {
          // loading.hide();
          resolve(module.default);
        })
        .catch(err => {
          // loading.hide();
          reject(err);
        });
    },
  },
  {
    path: '/PreviewExperienceClass',
    name: 'PreviewExperienceClass',
    meta: {
      title: '体验课预览',
      hasShare: true,
    },
    component: () =>
      import(
        /* webpackChunkName: "PreviewExperienceClass" */ '@/views/course/PreviewExperienceClass'
      ),
  },
  {
    path: '/PreviewSystemClass',
    name: 'PreviewSystemClass',
    meta: {
      title: '系统课预览',
      hasShare: true,
    },
    component: (resolve, reject) =>
      import(
        /* webpackChunkName: "PreviewSystemClass" */ '@/views/course/PreviewSystemClass'
      ),
  },
];
