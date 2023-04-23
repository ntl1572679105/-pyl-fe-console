import request from "@/utils/request.js";

const shangjiaApi = {
  // 查询o2o商家列表
  list: '/po2o/operator/o2oShop/list',
  // 查询o2o商家详情
  detail: '/po2o/operator/o2oShop/',
  // 新增o2o商家
  add: '/po2o/operator/o2oShop/insert',
  // 修改o2o商家
  edit: '/po2o/operator/o2oShop',
  // 删除o2o商家
  delete: '/po2o/operator/o2oShop/',
  // 查询o2o商家分类列表
  cateList: '/po2o/operator/o2oShopCategory/list',
  // 查询o2o商家分类详情
  cateDetail: '/po2o/operator/o2oShopCategory/',
  // 新增o2o商家分类
  cateAdd: '/po2o/operator/o2oShopCategory/insert',
  // 修改o2o商家分类
  cateEdit: '/po2o/operator/o2oShopCategory',
  // 删除o2o商家分类
  cateDel: '/po2o/operator/o2oShopCategory/',
}

export function shangjiaList(params) {
  return request({
    url: shangjiaApi.list,
    method: 'get',
    params
  })
}

export function shangjiaDetail(id) {
  return request({
    url: shangjiaApi.detail + id,
    method: 'get',
  })
}

export function shangjiaAdd(parameter) {
  return request({
    url: shangjiaApi.add,
    method: 'post',
    data: parameter
  })
}

export function shangjiaEdit(parameter) {
  return request({
    url: shangjiaApi.edit,
    method: 'put',
    data: parameter
  })
}

export function shangjiaDelete(params, id) {
  return request({
    url: shangjiaApi.detail + id,
    method: 'delete',
    params
  })
}

export function cateList(params) {
  return request({
    url: shangjiaApi.cateList,
    method: 'get',
    params
  })
}

export function cateDetail(id) {
  return request({
    url: shangjiaApi.cateDetail + id,
    method: 'get',
  })
}

export function cateAdd(parameter) {
  return request({
    url: shangjiaApi.cateAdd,
    method: 'post',
    data: parameter
  })
}

export function cateEdit(data) {
  return request({
    url: shangjiaApi.cateEdit,
    method: 'put',
    data
  })
}

export function cateDelete(id) {
  return request({
    url: shangjiaApi.cateDel + id,
    method: 'delete',
  })
}