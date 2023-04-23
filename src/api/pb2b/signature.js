import request from "@/utils/request";

const signApi = {
  // 查询b2b-签章列表
  list: '/pb2b/operator/signature/list',
  // 修改b2b-电子签章
  edit: '/pb2b/operator/signature',
  // 新增b2b-电子签章
  add: '/pb2b/operator/signature',
  // 获取b2b-电子签章详情
  detail: '/pb2b/operator/signature/',
  // 删除b2b-电子签章
  del: '/pb2b/operator/signature/',
  // 修改b2b-电子签章状态
  changeState: '/pb2b/operator/signature/status'
}

export function signList(parameter) {
  return request({
    url: signApi.list,
    method: 'get',
    params: parameter,
  });
}

export function signEdit(parameter) {
  return request({
    url: signApi.edit,
    method: 'put',
    data: parameter,
  });
}

export function signDetail(id) {
  return request({
    url: signApi.detail + id,
    method: 'get',
  });
}

export function signDelete(id) {
  return request({
    url: signApi.del + id,
    method: 'delete',
  });
}

export function signAdd(parameter) {
  return request({
    url: signApi.add,
    method: 'post',
    data: parameter,
  });
}

export function signStatusChange(parameter) {
  return request({
    url: signApi.changeState,
    method: 'put',
    data: parameter,
  });
}
