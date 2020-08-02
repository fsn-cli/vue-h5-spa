import { getData } from '@/api/api';
// 获取课程信息
export function getCourseList(data) {
  return getData({
    url: '/shop/api/v1/productInfo',
    method: 'get',
    data,
  });
}
// 获取sku信息
export function getSkuList(data) {
  return getData({
    url: '/shop/api/v1/userPurchaseInfo',
    method: 'get',
    data,
  });
}
// 售课提醒-APP内订阅
export function subscriber(data) {
  return getData({
    method: 'GET',
    url: '/shop/api/v1/subscribe/app',
    data,
  });
}

// 获取分享得链接
export function getShareLink(data) {
  return getData({
    method: 'POST',
    url: 'https://app2.xueersi.com/cupid/invitation/v1/placard/getPurchaseLink',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
}
// 详情页预览页面
export function getPreviewData(data) {
  return getData({
    method: 'get',
    url: '/shop/api/v1/preview',
    data,
  });
}
