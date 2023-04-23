import request from '@/utils/request.js';

const regimentApi = {
  // 团长佣金列表
  list: '/pyl/operator/cm/regimentFinancial/list',
  // 查询团长列表
  mpUserList: '/pyl/operator/cm/mpRegimentUser',
  // 查询团长详情
  mpUserEdit: '/pyl/operator/cm/mpRegimentUser',
  // 查询团长详情
  mpUserDetail: '/pyl/operator/cm/mpRegimentUser/',
  // 新增团长
  mpUserAdd: '/pyl/operator/cm/mpRegimentUser',
  // 删除团长
  mpUserDelete: '/pyl/operator/cm/mpRegimentUser/',
  // 新增团长邀请码
  code: '/pyl/operator/cm/mpRegimentInvitationCode',

  // 查询提现列表
  withdrawList: '/pyl/operator/cm/commissionWithdraw/list',
  // 佣金详情接口（提现）
  withdrawDetail: '/pyl/operator/cm/commissionWithdraw/info?withdrawId=',
  // 佣金审核（提现）
  withdrawAudit: '/pyl/operator/cm/commissionWithdraw/audit',

  // 分销报表
  reportList: '/pyl/operator/cm/distributionCenter/report',
  // 月账单
  monthBill: '/pyl/operator/cm/distributionCenter/monthBill',
  // 账单详情
  distributionDetail: '/pyl/operator/cm/distributionCenter/withdraw',
  // 查询团长分享订单列表
  shareList: '/pyl/operator/cm/regimentShareOrder/list'
};

export function getRegimentList(params) {
  return request({
    url: regimentApi.list,
    method: 'get',
    params,
  });
}

export function mpUserList(params) {
  return request({
    url: regimentApi.mpUserList,
    method: 'get',
    params,
  });
}
export function mpUserAdd(params) {
  return request({
    url: regimentApi.mpUserAdd,
    method: 'post',
    params,
  });
}
export function mpUserDetail(id) {
  return request({
    url: regimentApi.mpUserDetail + id,
    method: 'get',
  });
}
export function mpUserEdit(params) {
  return request({
    url: regimentApi.mpUserList,
    method: 'put',
    params,
  });
}
export function mpUserDelete(id) {
  return request({
    url: regimentApi.mpUserDelete + id,
    method: 'delete',
  });
}
export function code(params) {
  return request({
    url: regimentApi.code,
    method: 'post',
    params,
  });
}

export function withdrawList(params) {
  return request({
    url: regimentApi.withdrawList,
    method: 'get',
    params,
  });
}
export function withdrawAudit(data) {
  return request({
    url: regimentApi.withdrawAudit,
    method: 'post',
    data,
  });
}
export function withdrawDetail(id) {
  return request({
    url: regimentApi.withdrawDetail + id,
    method: 'get',
  });
}

export function reportList(params) {
  return request({
    url: regimentApi.reportList,
    method: 'get',
    params,
  });
}

export function monthBill(params) {
  return request({
    url: regimentApi.monthBill,
    method: 'get',
    params,
  });
}

export function distributionDetail(params) {
  return request({
    url: regimentApi.distributionDetail,
    method: 'get',
    params,
  });
}

export function shareList(params, shopType) {
  return request({
    url: regimentApi.shareList,
    method: 'get',
    params,
    headers: {
      'shop-type': shopType
    },
  })
}
