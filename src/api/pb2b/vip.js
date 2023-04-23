import request from '@/utils/request';

const vipApi = {
  // b2b-查询会员列表
  list: '/pb2b/operator/vipUser/list',
  // b2b-会员详情
  detail: '/pb2b/operator/vipUser/info',
  // b2b-新增会员
  add: '/pb2b/operator/vipUser',
  // b2b-删除会员
  delete: '/pb2b/operator/vipUser/',
  // b2b-积分列表
  integralList: '/pb2b/operator/vipIntegralRecord/list',
  // b2b-更新会员信息
  update: '/pb2b/operator/vipUser'
}

export function GetVipList (parameter) {
  return request({
    url: vipApi.list,
    params: parameter,
    method: 'get'
  })
}

export function GetVipDetail (parameter) {
  return request({
    url: vipApi.detail,
    params: parameter,
    method: 'get'
  })
}

export function AddB2bVip (parameter) {
  return request({
    url: vipApi.add,
    method: 'post',
    data: parameter
  })
}

export function DeleteB2bVip (userId) {
  return request({
    url: vipApi.delete + userId,
    method: 'delete'
  })
}

export function GetIntegralList (parameter) {
  return request({
    url: vipApi.integralList,
    params: parameter,
    method: 'get'
  })
}

export function UpdateB2bVip (parameter) {
  return request({
    url: vipApi.update,
    data: parameter,
    method: 'put'
  })
}
