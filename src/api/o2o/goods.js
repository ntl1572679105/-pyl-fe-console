import request from "@/utils/request";

const goodsApi = {
  // 查询o2o商品列表
  goodsList: '/po2o/operator/o2oProduct/list',
  // 查询o2o商品详情
  goodsDetail: '/po2o/operator/o2oProduct/',
  // 新增o2o商品
  addGoods: '/po2o/operator/o2oProduct/insert',
  // 删除o2o商品
  delGoods: '/po2o/operator/o2oProduct/',
  // 修改o2o商品
  updateGoods: '/po2o/operator/o2oProduct',
  // 查询o2o商品分类列表
  goodsTypeList: '/po2o/operator/o2oProductCategory/list',
  // 查询o2o商品分类详情
  goodsTypeDetail: '/po2o/operator/o2oProductCategory/',
  // 新增o2o商品分类
  goodsAddType: '/po2o/operator/o2oProductCategory',
  // 删除o2o商品分类
  goodsDelType: '/po2o/operator/o2oProductCategory/',
  // 修改o2o商品分类
  goodsUpdateType: '/po2o/operator/o2oProductCategory'
}

export function goodsList(params) {
  return request({
    url: goodsApi.goodsList,
    method: 'get',
    params
  })
}


export function goodsDetail(id) {
  return request({
    url: goodsApi.goodsDetail + id,
    method: 'get',
  })
}


export function addGoods(parameter) {
  return request({
    url: goodsApi.addGoods,
    method: 'post',
    data: parameter
  })
}


export function delGoods(id) {
  return request({
    url: goodsApi.delGoods + id,
    method: 'delete',
  })
}



export function updateGoods(parameter) {
  return request({
    url: goodsApi.updateGoods,
    method: 'put',
    data: parameter
  })
}


export function typeList(params) {
  return request({
    url: goodsApi.goodsTypeList,
    method: 'get',
    params
  })
}

export function typeDetail(id) {
  return request({
    url: goodsApi.goodsTypeDetail + id,
    method: 'get',
  })
}
export function addType(parameter) {
  return request({
    url: goodsApi.goodsAddType,
    method: 'post',
    data: parameter
  })
}

export function delType(id) {
  return request({
    url: goodsApi.goodsDelType + id,
    method: 'delete',
  })
}

export function updateType(parameter) {
  return request({
    url: goodsApi.goodsUpdateType,
    method: 'put',
    data: parameter
  })
}
