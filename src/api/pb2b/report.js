import request from '@/utils/request';

const reportApi = {
  // B2B-订单统计
  orderReport: '/pb2b/operator/cp/b2bBusinessReport/orderCount',
  // B2B-销售统计
  salesReport: '/pb2b/operator/cp/b2bBusinessReport/salesCount',
  // 店铺列表
  shopList: '/pb2b/operator/shop/list'
}

export function OrderOption(parameter) {
  return request({
    url: reportApi.orderReport,
    method: 'get',
    params: parameter
  })
}

export function SalesOption(parameter) {
  return request({
    url: reportApi.salesReport,
    method: 'get',
    params: parameter
  })
}

export function shopList() {
  return request({
    url: reportApi.shopList,
    method: 'get',
  })
}