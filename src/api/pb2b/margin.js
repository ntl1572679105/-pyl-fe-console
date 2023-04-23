import request from '@/utils/request';

const marginApi = {
  // 新增b2b-保证金记录
  addMargin: '/pb2b/operator/cp/b2bMarginRecord',
  // 更新b2b-保证金记录
  updateMargin: '/pb2b/operator/cp/b2bMarginRecord',
  // 删除b2b-保证金记录
  delMargin: '/pb2b/operator/cp/b2bMarginRecord',
  // 查询b2b-保证金记录详情
  marginDetail: '/pb2b/operator/cp/b2bMarginRecord/',
  // 查询b2b-保证金记录列表
  marginList: '/pb2b/operator/cp/b2bMarginRecord/list/'
}

export function AddMargin (parameter) {
  return request({
    url: marginApi.addMargin,
    method: 'post',
    data: parameter
  })
}

export function UpdateMargin (parameter) {
  return request({
    url: marginApi.updateMargin,
    method: 'put',
    params: parameter
  })
}

export function DeleteMargin (parameter) {
  return request({
    url: marginApi.delMargin,
    method: 'delete',
    data: parameter
  })
}

export function MarginDetail (id) {
  return request({
    url: marginApi.marginDetail + id,
    method: 'get',
  })
}

export function MarginList (parameter, id) {
  return request({
    url: marginApi.marginList + id,
    method: 'get',
    params: parameter
  })
}

