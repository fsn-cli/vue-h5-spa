import { getData } from 'api/api';

// 获取订单列表
export function getOrderList(uid) {
  const url = `/shop/api/v1/express/list?user_id=${uid}`;
  return getData({ url: url, method: 'get' });
}

// 获取用户地址信息
export function getUserAddress() {
  const url = `/ucenter/api/v1/account/addr/default`;
  return getData({ url: url, method: 'get' });
}

// 获取物流信息 废弃
// export function getExpressInfo(expressNo, companyCode) {
//   const url = `/shop/api/v1/express/getbycode?expressNo=${expressNo}&companyCode=${companyCode}`;
//   return getData({ url: url, method: 'get' });
// }
// 获取物流信息
export function getExpressInfo(deliverId) {
  const url = `/shop/api/v1/express/detail?deliver_id=${deliverId}`;
  return getData({ url: url, method: 'get', loading: true });
}

// 创建用户默认地址
export function createAddress(data) {
  const url = `/ucenter/api/v1/addr/add`;
  return getData({ url: url, method: 'post', data });
}
