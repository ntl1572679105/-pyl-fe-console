import request from '@/utils/request';

const vipApi = {
  // 查询会员列表
  list: '/pyl/operator/cp/vipUser/list',
  // 会员详情
  detail: '/pyl/operator/cp/vipUser/info',
  // 新增会员
  add: '/pyl/operator/cp/vipUser',
  // 删除会员
  delete: '/pyl/operator/cp/vipUser/',
  // 积分列表
  integralList: '/pyl/operator/cp/vipIntegralRecord/list',
  // 更新会员信息
  update: '/pyl/operator/cp/vipUser'
}

export function VipList (parameter) {
  return request({
    url: vipApi.list,
    params: parameter,
    method: 'get'
  })
}

export function VipDetail (parameter) {
  return request({
    url: vipApi.detail,
    params: parameter,
    method: 'get'
  })
}

export function AddVip (parameter) {
  return request({
    url: vipApi.add,
    data: parameter,
    method: 'post'
  })
}

export function DeleteVip (userId) {
  return request({
    url: vipApi.delete + userId,
    method: 'delete'
  })
}

export function UpdateVip (parameter) {
  return request({
    url: vipApi.update,
    method: 'put',
    data: parameter
  })
}

export function integralList (parameter) {
  return request({
    url: vipApi.integralList,
    params: parameter,
    method: 'get'
  })
}