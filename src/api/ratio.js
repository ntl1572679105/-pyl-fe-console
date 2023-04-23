import request from '@/utils/request';

const ratioApi = {
  // 查询b2b-分销比例配置列表
  getList: '/pyl/operator/cm/ratio/list',
  // 查询b2b-分销比例配置详情
  detail: '/pyl/operator/cm/ratio/',
  // 编辑b2b-分销比例配置
  edit: '/pyl/operator/cm/ratio',
  // 查询分销比例配置详情
  commonDetail: '/pyl/common/ratio/info'
}

export function ratioList (params) {
  return request({
    url: ratioApi.getList,
    method: 'get',
    params
  })
}

export function ratioDetail (params, id) {
  return request({
    url: ratioApi.detail + id,
    method: 'get',
    params
  })
}

export function ratioEdit (parameter) {
  return request({
    url: ratioApi.edit,
    method: 'put',
    data: parameter,
  })
}

export function commonRatioDetail (params) {
  return request({
    url: ratioApi.commonDetail,
    method: 'get',
    params
  })
}
