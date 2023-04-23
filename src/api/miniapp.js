import request from '@/utils/request';
import config from './config';


export function bannerList(type, params) {
  return request({
    url: `/pyl/operator/${config[type]}/banner/list`,
    method: 'get',
    params,
  });
}

export function bannerDetail(type, bannerid) {
  return request({
    url: `/pyl/operator/${config[type]}/banner/` + bannerid,
    method: 'get',
  });
}

export function bannerAdd(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/banner`,
    method: 'post',
    data: parameter,
  });
}

export function bannerEdit(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/banner`,
    method: 'put',
    data: parameter,
  });
}

export function bannerDelete(type, bannerid) {
  return request({
    url: `/pyl/operator/${config[type]}/banner/` + bannerid,
    method: 'delete',
  });
}

export function recommenderList(type, params) {
  return request({
    url: `/pyl/operator/${config[type]}/recommender/list`,
    method: 'get',
    params,
  });
}

export function recommenderDetail(type, recommenderid) {
  return request({
    url: `/pyl/operator/${config[type]}/recommender/` + recommenderid,
    method: 'get',
  });
}

export function recommenderAdd(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/recommender`,
    method: 'post',
    data: parameter,
  });
}

export function recommenderEdit(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/recommender`,
    method: 'put',
    data: parameter,
  });
}

export function recommenderDelete(type, recommenderid) {
  return request({
    url: `/pyl/operator/${config[type]}/recommender/` + recommenderid,
    method: 'delete',
  });
}
// 查询个采—优惠券列表 /pyl/operator/ip/coupon/list
export function couponList(parameter, type) {
  return request({
    url: `/pyl/operator/${config[type]}/coupon/list`,
    method: 'get',
    params: parameter,
  });
}
// 删除个采—优惠券 /pyl/operator/ip/coupon/{id}
export function couponDelete(id, type) {
  return request({
    url: `/pyl/operator/${config[type]}/coupon/${id}`,
    method: 'delete',
  });
}
// 新增个采—优惠券 /pyl/operator/ip/coupon
export function couponAdd(parameter, type) {
  return request({
    url: `/pyl/operator/${config[type]}/coupon`,
    method: 'post',
    data: parameter,
  });
}
// 获取个采—优惠券详情/pyl/operator/ip/coupon/{id}
export function couponDetail(id, type) {
  return request({
    url: `/pyl/operator/${config[type]}/coupon/${id}`,
    method: 'get',
  });
}
// 修改个采—优惠券 /pyl/operator/ip/coupon
export function couponUpdate(parameter, type) {
  return request({
    url: `/pyl/operator/${config[type]}/coupon`,
    method: 'put',
    data: parameter,
  });
}

//// 聚合首页相关

// 查询背景管理配置列表
export function aggrList(params) {
  return request({
    url: '/pyl/operator/cm/mpBackgroundDeploy/list',
    method: 'get',
    params
  })
}

// 黑白配置接口
export function blackWhite(params) {
  return request({
    url: '/pyl/operator/cm/mpBackgroundDeploy/isBlack',
    method: 'get',
    params
  })
}

// 修改背景管理配置
export function bgDeployEdit (parameters) {
  return request({
    url: '/pyl/operator/cm/mpBackgroundDeploy',
    method: 'put',
    data: parameters
  })
}

// 查询背景管理配置详情
export function bgDeployDetail (id) {
  return request({
    url: '/pyl/operator/cm/mpBackgroundDeploy/' + id,
    method: 'get',
  })
}
