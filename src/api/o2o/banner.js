import request from "@/utils/request";

const bannerApi = {
  // 查询o2o-banner列表
  list: '/po2o/operator/banner/list',
  // 获取o2o-banner详情
  detail: '/po2o/operator/banner/',
  // 新增o2o-banner
  add: '/po2o/operator/banner',
  // 删除o2o-banner
  del: '/po2o/operator/banner/',
  // 修改o2o-banner
  put: '/po2o/operator/banner'
}

export function getBannerList(params) {
  return request({
    url: bannerApi.list,
    method: 'get',
    params
  })
}

export function getBannerDetail(id) {
  return request({
    url: bannerApi.detail + id,
    method: 'get',
  })
}

export function bannerAdd(parameter) {
  return request({
    url: bannerApi.add,
    method: 'post',
    data: parameter
  })
}

export function bannerDel(id) {
  return request({
    url: bannerApi.del + id,
    method: 'delete',
  })
}

export function bannerEdit(parameter) {
  return request({
    url: bannerApi.put,
    method: 'put',
    data: parameter
  })
}