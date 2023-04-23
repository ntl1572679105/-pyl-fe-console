import request from "@/utils/request";

const disputeApi = {
  // 查询b2b-订单纠纷列表
  list: `/pb2b/operator/orderDispute/list`,
  // 编辑b2b-订单纠纷
  edit: `/pb2b/operator/orderDispute`,
  // 售后审核b2b-订单纠纷
  audit: `/pb2b/operator/orderDispute/audit`,
  // 关闭b2b-订单纠纷
  cancal: `/pb2b/operator/orderDispute/cancel`,
  // 确认退款b2b-订单纠纷
  refund: `/pb2b/operator/orderDispute/refund`,
  // 查询b2b-订单纠纷详情
  detail: `/pb2b/operator/orderDispute/`,
  // 编辑b2b-仲裁评判
  arbitration: '/pb2b/operator/orderDispute/arbitration'
}

export function List(parameter) {
  return request({
    url: disputeApi.list,
    method: 'get',
    params: parameter
  })
}

export function Edit(parameter) {
  return request({
    url: disputeApi.edit,
    method: 'put',
    data: parameter
  })
}

export function Audit(parameter) {
  return request({
    url: disputeApi.audit,
    method: 'put',
    params: parameter
  })
}

export function Cancel(parameter) {
  return request({
    url: disputeApi.cancel,
    method: 'put',
    params: parameter
  })
}

export function Refund(parameter) {
  return request({
    url: disputeApi.refund,
    method: 'put',
    data: parameter
  })
}

export function Detail(id) {
  return request({
    url: disputeApi.detail + id,
    method: 'get',
  })
}


export function Arbitration(parameter) {
  return request({
    url: disputeApi.arbitration,
    method: 'post',
    data: parameter
  })
}