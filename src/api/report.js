import request from '@/utils/request';

const reportApi = {
  // 订单统计
  orderReport: '/pyl/operator/cp/businessReport/orderCount',
  // 销售统计
  salesReport: '/pyl/operator/cp/businessReport/salesCount',
  // 前置仓列表
  warehouseList: '/pyl/operator/cp/preWarehouse/list',
  // 经营概况
  summaryOperations:`/pyl/operator/cp/businessReport/summaryOperations`,
  pb2bsummaryOperations:`/pb2b/operator/cp/b2bBusinessReport/summaryOperations`,
}

export function getOrderOption(parameter) {
  return request({
    url: reportApi.orderReport,
    method: 'get',
    params: parameter
  })
}

export function getSalesOption(parameter) {
  return request({
    url: reportApi.salesReport,
    method: 'get',
    params: parameter
  })
}

export function warehouseList() {
  return request({
    url: reportApi.warehouseList,
    method: 'get',
  })
}
// 经营概况
export function summary(){
  return request({
    url: reportApi.summaryOperations,
    method: 'get',
  })
}
// pb2b经营概况
export function Pb2bsummary(){
  return request({
    url: reportApi.pb2bsummaryOperations,
    method: 'get',
  })
}