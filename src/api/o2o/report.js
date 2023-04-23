import request from "@/utils/request";

const reportApi = {
  // 月账单报表
  month: '/po2o/operator/reportCenter/monthReport',
  // 销售报表
  sales: '/po2o/operator/reportCenter/salesReport',
  // 报表数据统计
  data: '/po2o/operator/reportCenter/dataReport',
  // 核销订单报表
  writeOff: '/po2o/operator/reportCenter/writeOffReport'
}

export function monthReport(params) {
  return request({
    url: reportApi.month,
    method: 'get',
    params
  })
}


export function salesReport(params) {
  return request({
    url: reportApi.sales,
    method: 'get',
    params
  })
}


export function dataReport(params) {
  return request({
    url: reportApi.data,
    method: 'get',
    params
  })
}


export function writeOffReport(params) {
  return request({
    url: reportApi.writeOff,
    method: 'get',
    params
  })
}

