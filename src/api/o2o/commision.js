import request from "@/utils/request";

const commissionApi = {
  // 查询提现列表
  list: '/po2o/operator/commissionWithdraw/list',
  // 佣金详情接口
  detail: '/po2o/operator/commissionWithdraw/info',
  // 佣金审核
  audit: '/po2o/operator/commissionWithdraw/audit',
  // 导出提现列表
  export: '/po2o/operator/commissionWithdraw/upload'
}

export function commissionList (params) {
  return request({
    url: commissionApi.list,
    method: 'get',
    params
  })
}
export function commissionDetail (params) {
  return request({
    url: commissionApi.detail,
    method: 'get',
    params
  })
}
export function comissionAudit (parameter) {
  return request({
    url: commissionApi.audit,
    method: 'post',
    data: parameter
  })
}

export function comissionExport (params) {
  return request({
    url: commissionApi.export,
    method: 'get',
    params,
    responseType: 'blob',
    timeout: 0,
  })
}