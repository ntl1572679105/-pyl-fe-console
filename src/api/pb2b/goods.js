import request from '@/utils/request';

const userApi = {
  // 查询b2b-商品列表
  goodsList: `/pb2b/operator/product/list`,
  // 获取b2b-商品详情 /pb2b/operator/product/{id}
  productDeatil: `/pb2b/operator/product/`,
  // 查询b2b-类目列表
  categoryList: `/pb2b/operator/category/list`,
  // 查询b2b-店铺列表
  shopList: `/pb2b/operator/shop/list`,
  // 删除b2b-店铺
  shopDelete: `/pb2b/operator/shop/`,
  // 获取b2b-店铺详情
  shopDeatil: `/pb2b/operator/shop/`,
  // 修改b2b-店铺
  shopUpdate: '/pb2b/operator/shop',
  // 新增b2b-店铺
  shopAdd: `/pb2b/operator/shop`,
  // 获取b2b-店铺审核详情
  shopAuditDetail: '/pb2b/operator/shop/audit/',
  // 新增b2b-审核店铺
  shopAudit: `/pb2b/operator/shop/audit`,

  // 查询b2b-企业认证列表
  companyVerifyList: '/pb2b/operator/companyVerify/list',
  // 获取b2b-企业认证详情
  companyVerifyDetail: '/pb2b/operator/companyVerify/',
  // 修改b2b-企业认证
  companyVerifyUpdate: '/pb2b/operator/companyVerify',
  // 导出b2b商品—商品
  export: '/pb2b/operator/product/export',
  // 上下架—商品
  changeStatus: '/pb2b/operator/product/status',
  // 停用/启用b2b-店铺
  shopStatusChange: '/pb2b/operator/shop/downAndUp'
};
export function goodsList(parameter) {
  return request({
    url: userApi.goodsList,
    method: 'get',
    params: parameter,
  });
}
export function productDeatil(id) {
  return request({
    url: userApi.productDeatil + id,
    method: 'get',
  });
}
export function categoryList(params) {
  return request({
    url: userApi.categoryList,
    method: 'get',
    params,
  });
}
export function shopList(parameter) {
  return request({
    url: userApi.shopList,
    method: 'get',
    params: parameter,
  });
}
export function shopDelete(id) {
  return request({
    url: userApi.shopDelete + id,
    method: 'delete',
  });
}
export function shopDeatil(id) {
  return request({
    url: userApi.shopDeatil + id,
    method: 'get',
  });
}

export function shopUpdate(parameter) {
  return request({
    url: userApi.shopUpdate,
    method: 'put',
    data: parameter,
  });
}
export function shopStatusUpdate(parameter) {
  return request({
    url: userApi.shopStatusChange,
    method: 'put',
    data: parameter
  })
}
export function shopAdd(parameter) {
  return request({
    url: userApi.shopAdd,
    method: 'post',
    data: parameter,
  });
}

export function shopAuditDetail(id) {
  return request({
    url: userApi.shopAuditDetail + id,
    method: 'get',
  });
}
export function shopAudit(parameter) {
  return request({
    url: userApi.shopAudit,
    method: 'post',
    data: parameter,
  });
}

export function companyVerifyList(parameter) {
  return request({
    url: userApi.companyVerifyList,
    method: 'get',
    params: parameter,
  });
}
export function companyVerifyDetail(id) {
  return request({
    url: userApi.companyVerifyDetail + id,
    method: 'get',
  });
}

export function companyVerifyUpdate(parameter) {
  return request({
    url: userApi.companyVerifyUpdate,
    method: 'put',
    data: parameter,
  });
}

export function productOutput(parameter) {
  return request({
    url: userApi.export,
    method: 'get',
    params: parameter,
    responseType: 'blob',
    timeout: 0
  });
}
export function updateGoodsStatus(parameter) {
  return request({
    url: userApi.changeStatus,
    method: 'put',
    data: parameter
  });
}