import request from '@/utils/request';

const userApi = {
  // 查询b2b-订单列表
  orderList: `/pb2b/operator/order/list`,
  // 获取b2b-订单详情
  oerderDetail: `/pb2b/operator/order/`,

  // 查询b2b—商品评价列表
  productCommentList: '/pb2b/operator/productComment/list',
  // 获取b2b—商品评价详情
  productCommentDetail: '/pb2b/operator/productComment/',
  // 删除b2b—商品评价
  productCommentDelete: 'pb2b/operator/productComment/',
  // 修改b2b—商品评价
  productCommentUpdate: '/pb2b/operator/productComment',
  // 查询b2b—获取合同列表
  contractList: '/pyl/operator/cm/sunyard/contract/list',
  // 查询b2b—获取合同文件地址
  contractUrl: '/pyl/operator/cm/sunyard/contract/url/',

  // 获取物流详情
  logisticsDetail: '/pb2b/operator/logisticsDetailGet',
};

export function orderList(params) {
  return request({
    url: userApi.orderList,
    method: 'get',
    params,
  });
}
export function oerderDetail(id) {
  return request({
    url: userApi.oerderDetail + id,
    method: 'get',
  });
}

export function productCommentList(params) {
  return request({
    url: userApi.productCommentList,
    method: 'get',
    params,
  });
}
export function productCommentDetail(id) {
  return request({
    url: userApi.productCommentDetail + id,
    method: 'get',
  });
}

export function productCommentUpdate(parameter) {
  return request({
    url: userApi.productCommentUpdate,
    method: 'put',
    data: parameter,
  });
}
export function productCommentDelete(id) {
  return request({
    url: userApi.productCommentDelete + id,
    method: 'delete',
  });
}

export function contractList(params) {
  return request({
    url: userApi.contractList,
    method: 'get',
    params,
  });
}

export function contractUrl(fileId) {
  return request({
    url: userApi.contractUrl + fileId,
    method: 'get',
  });
}

// 获取物流详情
export function logisticsDetail(id) {
  return request({
    url: `${userApi.logisticsDetail}?orderNo=${id}`,
    method: 'get',
  });
}
