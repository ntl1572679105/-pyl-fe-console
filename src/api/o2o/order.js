import request from '@/utils/request';

const orderApi = {
  // 查询o2o订单列表
  list: '/po2o/operator/o2oOrder/list',
  // 查询o2o订单详情
  detail: '/po2o/operator/o2oOrder/info'
}

export function orderList(params) {
  return request({
    url: orderApi.list,
    method: 'get',
    params
  })
}

export function orderDetail(params) {
  return request({
    url: orderApi.detail,
    method: 'get',
    params
  })
}