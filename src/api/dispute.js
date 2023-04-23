import request from "@/utils/request";

const disputeApi = {
  // 查询b2b-订单纠纷列表
  list: `/pyl/operator/cp/orderDispute/list`,
  // 编辑b2b-订单纠纷
  edit: `/pyl/operator/cp/orderDispute`,
  // 售后审核b2b-订单纠纷
  // audit: `/pyl/operator/cp/orderDispute/audit`,
  // 关闭b2b-订单纠纷
  // cancal: `/pyl/operator/cp/orderDispute/cancel`,
  // 确认退款b2b-订单纠纷
  refund: `/pyl/operator/cp/orderDispute/refund`,
  // 查询b2b-订单纠纷详情
  detail: `/pyl/operator/cp/orderDispute/`,
}

export function disputeList(parameters) {
  return request({
    url: disputeApi.list,
    method: 'get',
    params: parameters
  })
}

export function disputeEdit(parameter) {
  return request({
    url: disputeApi.edit,
    method: 'put',
    data: parameter
  })
}

// export function disputeAudit(parameter) {
//   return request({
//     url: disputeApi.audit,
//     method: 'put',
//     params: parameter
//   })
// }

// export function disputeCancel(parameter) {
//   return request({
//     url: disputeApi.cancel,
//     method: 'put',
//     params: parameter
//   })
// }

export function disputeRefund(parameter) {
  return request({
    url: disputeApi.refund,
    method: 'put',
    data: parameter
  })
}

export function disputeDetail(id) {
  return request({
    url: disputeApi.detail + id,
    method: 'get',
  })
}