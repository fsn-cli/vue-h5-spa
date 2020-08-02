import router from './index';
import store from '../store/index'
import { isWebBack, controlNavigationBar } from '@/utils/jsBridge';
import { codeLogin, toLogin } from 'api/login/h5login';
import { getLocalMonkeyCode, getCookieToken } from '@/utils/local';

router.beforeEach(async (to, from, next) => {
  setCurrentPageWebBack(to, from);
  setCurrentPageaNav(to);
  setLocalData(to);

  if (hasToken()) {
    next();
  } else {
    if (to.meta.isLogin) {
      toLogin(to.fullPath);
    } else {
      // 判断sessionStorage中是否含有免登code码
      const code = getLocalMonkeyCode();
      if (code && to.query.auth) {
        codeLogin({
          code,
          auth: to.query.auth,
          path: to.path,
          query: to.query,
        });
        return;
      }
      next();
    }
  }
});
// 获取当前的学科信息 1 语文 2思维 3 英语
const subjectMap = new Map([
  [1, '语文'],
  [2, '思维'],
  [3, '英语']
]);
const subjectTypeMap = new Map([
  ['experienceClass', '体验课'],
  ['systemClass', '系统课']
]);
router.afterEach((to) => {
  // 动态修改title
  if (to.meta.title) {
    let title = to.meta.title;
    if (to.name === 'systemClass' || to.name === 'experienceClass') {
      title = `小猴${subjectMap.get(Number(to.query.subject_id))}${subjectTypeMap.get(to.name)}`;
    }
    document.title = title;
  } else {
    document.title = '';
  }
});

/**
 * @description 设置当前页面是否调用客户端isWebback方法，0表示不调用，1表示调用
 * @author renliang
 * @date 2019-12-27
 * @param {*} to router对象
 * @param {*} from router对象
 */
function setCurrentPageWebBack(to, from) {
  if (to.meta.webBack) {
    isWebBack('1');
  } else {
    isWebBack('0');
  }

  if (to.path === '/personal/order/address-edit' && to.query.channel) {
    isWebBack('0');
  }
  if (to.path === '/personal/coupon/list' && from.path === '/pay') {
    isWebBack('1');
  }
  if (to.path === '/personal/coupon/list' && from.path === '/clockIn') {
    isWebBack('1');
  }
  if (
    to.path === '/personal/order/express-detail' &&
    from.path === '/personal/order/order-list'
  ) {
    isWebBack('1');
  }
}

/**
 * @description 设置当前页面导航栏分享/关闭按钮
 *              isShowShare:0无分享按钮,1有分享按钮
 *              isShowClose:0无关闭，1有关闭
 * @author renliang
 * @date 2019-12-27
 * @param {*} to router对象
 * @returns 无
 */
function setCurrentPageaNav(to) {
  let navBarOpts = {};
  if (to.meta.hasShare) {
    navBarOpts['isShowShare'] = 1;
  } else {
    navBarOpts['isShowShare'] = 0;
  }
  if (to.meta.hasClose) {
    navBarOpts['isShowClose'] = 1;
  } else {
    navBarOpts['isShowClose'] = 0;
  }
  controlNavigationBar(navBarOpts);
}

/**
 * @description 设置本地存储数据
 * @author renliang
 * @date 2019-12-27
 * @param {*} to router当前对象
 * @returns 无
 */
function setLocalData(to) {
  const token = getToken();
  // eslint-disable-next-line camelcase
  const { query: { user_id, platform, app_version, subject_id, source_id, source_type } } = to;
  token ? localStorage.setItem('token', token) : localStorage.removeItem('token') || localStorage.removeItem('userId');
  // eslint-disable-next-line camelcase
  user_id && localStorage.setItem('userId', user_id)
  platform && localStorage.setItem('platform', platform);
  // eslint-disable-next-line camelcase
  app_version && localStorage.setItem('appVersion', app_version);
  // eslint-disable-next-line camelcase
  subject_id && localStorage.setItem('subjectId', subject_id);
  // eslint-disable-next-line camelcase
  source_id && localStorage.setItem('sourceId', source_id);
  // eslint-disable-next-line camelcase
  source_type && localStorage.setItem('sourceType', source_type);
}

/**
 * @description 获取token 判断新老版本
 * @author renliang
 * @date 2019-12-27
 * @returns {string} token
 */
function getToken() {
  return getCookieToken();
}

/**
 * @description 是否有token
 * @author renliang
 * @date 2019-12-27
 * @param {*} to
 * @returns {boolean} 是否
 */
function hasToken() {
  return (getToken() || localStorage.getItem('token'));
}
