import request from '@/utils/request';

const customerApi = {
  // 查询小程序用户列表
  UserList: '/pyl/operator/cm/user/list',
  // 获取小程序用户详情
  UserDetail: '/pyl/operator/cm/user/',
  // 修改小程序用户
  UserEdit: '/pyl/operator/cm/user',
  // 删除小程序用户
  UserDelete: '/pyl/operator/cm/user/',

  // 查询小程序意见反馈列表
  FeedbackList: '/pyl/operator/cm/feedback/list',
  // 获取小程序意见反馈详情
  FeedbackDetail: '/pyl/operator/cm/feedback/',
  // 修改小程序意见反馈
  FeedbackEdit: '/pyl/operator/cm/feedback',
  // 查询积分明细列表
  integralList: '/pyl/operator/cm/integral/list',

  // Excel导入渔船信息
  fishingBoatsImport: '/pyl/operator/cm/fishingBoats/import',
  // 查询小程序渔船管理列表
  fishingBoatsList: '/pyl/operator/cm/fishingBoats/list',
  // 新增小程序渔船信息
  fishingBoatsAdd: '/pyl/operator/cm/fishingBoats',
  // 修改小程序渔船信息
  fishingBoatsEdit: '/pyl/operator/cm/fishingBoats',
  // 删除小程序渔船信息
  fishingBoatsDelete: '/pyl/operator/cm/fishingBoats/',
};

export function userList(parameter) {
  return request({
    url: customerApi.UserList,
    method: 'get',
    params: parameter,
  });
}

export function userDetail(userid) {
  return request({
    url: customerApi.UserDetail + userid,
    method: 'get',
  });
}

export function userEdit(parameter) {
  return request({
    url: customerApi.UserEdit,
    method: 'put',
    data: parameter,
  });
}

export function userDelete(userid) {
  return request({
    url: customerApi.UserDelete + userid,
    method: 'delete',
  });
}

export function feedbackList(parameter) {
  return request({
    url: customerApi.FeedbackList,
    method: 'get',
    params: parameter,
  });
}

export function feedbackDetail(id) {
  return request({
    url: customerApi.FeedbackDetail + id,
    method: 'get',
  });
}

export function feedbackEdit(parameter) {
  return request({
    url: customerApi.FeedbackEdit,
    method: 'put',
    data: parameter,
  });
}
export function integralList(parameter) {
  return request({
    url: customerApi.integralList,
    method: 'get',
    params: parameter,
  });
}

export function fishingBoatsImport(parameter) {
  return request({
    url: customerApi.fishingBoatsImport,
    method: 'post',
    data: parameter,
  });
}

export function fishingBoatsList(params) {
  return request({
    url: customerApi.fishingBoatsList,
    method: 'get',
    params,
  });
}

export function fishingBoatsAdd(parameter) {
  return request({
    url: customerApi.fishingBoatsAdd,
    method: 'post',
    data: parameter,
  });
}

export function fishingBoatsEdit(parameter) {
  return request({
    url: customerApi.fishingBoatsEdit,
    method: 'put',
    data: parameter,
  });
}

export function fishingBoatsDelete(id) {
  return request({
    url: customerApi.fishingBoatsDelete + id,
    method: 'delete',
  });
}
