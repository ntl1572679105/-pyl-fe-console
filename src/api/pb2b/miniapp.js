import request from '@/utils/request';

const userApi = {
  // 查询b2b-banner列表
  bannerList: '/pb2b/operator/banner/list',
  // 新增b2b-banner
  bannerAdd: '/pb2b/operator/banner',
  // 修改b2b-banner
  bannerUpdate: `/pb2b/operator/banner`,
  // 获取b2b-banner详情
  bannerDeatil: `/pb2b/operator/banner/`,
  // 删除b2b-banner
  bannerDelet: `/pb2b/operator/banner/`,

  // 新增b2b-推荐位 /pb2b/operator/recommender
  recommenderAdd: `/pb2b/operator/recommender`,
  // 修改b2b-推荐位 /pb2b/operator/recommender
  recommenderUpdate: `/pb2b/operator/recommender`,
  // 删除b2b-推荐位 /pb2b/operator/recommender/{id}
  recommenderDelete: `/pb2b/operator/recommender/`,
  // 获取b2b-推荐位详情
  recommenderDetail: `/pb2b/operator/recommender/`,
  // 查询b2b-推荐位列表
  recommenderList: `/pb2b/operator/recommender/list`,
  // 查询b2b-类目推荐位列表
  listByCategory: `/pb2b/operator/recommender/listByCategory`,
  // 查询b2b-商铺推荐位列表
  listShop: `/pb2b/operator/recommender/listShop`,
};
export function bannerList(params) {
  return request({
    url: userApi.bannerList,
    method: 'get',
    params,
  });
}
export function bannerAdd(parameter) {
  return request({
    url: userApi.bannerAdd,
    method: 'post',
    data: parameter,
  });
}
export function bannerUpdate(parameter) {
  return request({
    url: userApi.bannerUpdate,
    method: 'put',
    data: parameter,
  });
}
export function bannerDeatil(id) {
  return request({
    url: userApi.bannerDeatil + id,
    method: 'get',
  });
}
export function bannerDelet(id) {
  return request({
    url: userApi.bannerDelet + id,
    method: 'delete',
  });
}
export function recommenderAdd(parameter) {
  return request({
    url: userApi.recommenderAdd,
    method: 'post',
    data: parameter,
  });
}
export function recommenderUpdate(parameter) {
  return request({
    url: userApi.recommenderUpdate,
    method: 'put',
    data: parameter,
  });
}
export function recommenderDelete(id) {
  return request({
    url: userApi.recommenderDelete + id,
    method: 'delete',
  });
}
export function recommenderDetail(id) {
  return request({
    url: userApi.recommenderDetail + id,
    method: 'get',
  });
}
export function recommenderList(parameter) {
  return request({
    url: userApi.recommenderList,
    method: 'get',
    params: parameter,
  });
}

export function listByCategory(parameter) {
  return request({
    url: userApi.listByCategory,
    method: 'get',
    params: parameter,
  });
}

export function listShop(parameter) {
  return request({
    url: userApi.listShop,
    method: 'get',
    params: parameter,
  });
}
