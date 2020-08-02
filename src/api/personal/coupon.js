import { getData } from '@/api/api';

export function list(data) {
  let url = `/ucenter/api/app/v1/coupon/list`;
  return getData({ url: url, data, method: 'post' });
}
// 是否购买过课
export function hasBuy(params) {
  let url = `/shop/api/v1/order/has-buy`;
  if (params) {
    url = `/shop/api/v1/order/has-buy?order_mode=${params}`;
  }

  return getData({ url: url, method: 'get' });
}
