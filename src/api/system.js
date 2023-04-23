import request from '@/utils/request';
import config  from './config.js';
// 类目列表
export function categoryList(type,params) {
  return request({
    url: `/pyl/operator/${config[type]}/category/list`,
    method: 'get',
    params,
  });
}

export function categoryDetail(type,id) {
  return request({
    url:`/pyl/operator/${config[type]}/category/` + id,
    method: 'get',
  });
}
export function categoryAdd(type,parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/category`,
    method: 'post',
    data: parameter,
  });
}

export function categoryEdit(type,parameter) {
  return request({
    url:`/pyl/operator/${config[type]}/category`,
    method: 'put',
    data: parameter,
  });
}

export function categoryDelete(type,bannerid) {
  return request({
    url: `/pyl/operator/${config[type]}/category/` + bannerid,
    method: 'delete',
  });
}
