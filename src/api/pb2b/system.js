import request from '@/utils/request';
const userApi = {
  // 查询b2b-类目列表
  categoryList: `/pb2b/operator/category/list`,
  //编辑b2b-类目
  categoryUpdate: `/pb2b/operator/category`,
  //   新增b2b-类目 /pb2b/operator/category
  categoryAdd: `/pb2b/operator/category`,
  //   查询b2b-类目详情 /pb2b/operator/category/{id}
  categoryDeatil: `/pb2b/operator/category/`,
  //   删除b2b-类目
  categoryDelete: `/pb2b/operator/category/`,
};
export function categoryList(parameter) {
  return request({
    url: userApi.categoryList,
    method: 'get',
    params: parameter
  });
}
export function categoryUpdate(parameter) {
  return request({
    url: userApi.categoryUpdate,
    method: 'put',
    data: parameter,
  });
}
export function categoryAdd(parameter) {
  return request({
    url: userApi.categoryAdd,
    method: 'post',
    data: parameter,
  });
}
export function categoryDeatil(id) {
  return request({
    url: userApi.categoryDeatil + id,
    method: 'get',
  });
}
export function categoryDelete(id) {
  return request({
    url: userApi.categoryDeatil + id,
    method: 'delete',
  });
}
