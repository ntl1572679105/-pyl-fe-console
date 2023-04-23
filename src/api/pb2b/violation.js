import request from '@/utils/request';

const violationsApi = {
  // 更新b2b-违规管理
  update: '/pb2b/operator/violationsManagement',
  // 新增b2b-违规管理
  add: '/pb2b/operator/violationsManagement',
  // 删除b2b-违规管理
  delete: '/pb2b/operator/violationsManagement',
  // 查询b2b-违规管理列表
  list: '/pb2b/operator/violationsManagement/list',
  // 查询b2b-违规管理详情
  detail: '/pb2b/operator/violationsManagement/'
}

export function getViolations (parameter) {
  return request({
    url: violationsApi.list,
    method: 'get',
    params: parameter
  })
}
export function updateViolations (parameter) {
  return request({
    url: violationsApi.update,
    method: 'put',
    params: parameter
  })
}
export function deleteViolation (parameter) {
  return request({
    url: violationsApi.delete,
    method: 'delete',
    params: parameter
  })
}
export function addViolation (parameter) {
  return request({
    url: violationsApi.add,
    method: 'post',
    data: parameter
  })
}
export function violationDetail (id) {
  return request({
    url: violationsApi.detail + id,
    method: 'get',
  })
}

