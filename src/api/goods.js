import request from '@/utils/request';
import config from './config.js';

export function importError(parameter){
  return request({
    url:`/pyl/operator/cp/product/download/${parameter.uuid}`,
    method: 'get',
    responseType: 'blob',
  })
}
export function importGoods(parameter){
  return request({
    url:`/pyl/operator/cp/product/import`,
    method: 'post',
    data: parameter,
    headers:{
      'Content-Type':'multipart/form-data'
    },
  })
}

export function supplierDelete(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier/${parameter.id}`,
    method: 'delete',
  });
}
export function supplierEdit(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier`,
    method: 'put',
    data: parameter,
  });
}
export function supplierAdd(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier`,
    method: 'post',
    data: parameter,
  });
}
export function supplierDetail(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier/${parameter.id}`,
    method: 'get',
  });
}

export function supplierList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier/list`,
    method: 'get',
    params: parameter,
  });
}

export function supplierAudit(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier/audit`,
    method: 'post',
    data: parameter,
  });
}

export function supplierAuditDetail(type, id) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier/audit/${id}`,
    method: 'get',
  });
}

export function personsupplierList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/supplier/list`,
    method: 'get',
    params: parameter,
  });
}

export function preWarehouseList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/preWarehouse/list`,
    method: 'get',
    params: parameter,
  });
}
export function preWarehouseDetail(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/preWarehouse/${parameter.id}`,
    method: 'get',
  });
}
export function preWarehouseEdit(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/preWarehouse`,
    method: 'put',
    data: parameter,
  });
}
export function preWarehouseAdd(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/preWarehouse`,
    method: 'post',
    data: parameter,
  });
}

export function preWarehouseDelete(type, id) {
  return request({
    url: `/pyl/operator/${config[type]}/preWarehouse/${id}`,
    method: 'delete',
  });
}

export function goodsList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/product/list`,
    method: 'get',
    params: parameter,
  });
}
export function updateGoods(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/product`,
    method: 'put',
    data: parameter,
  });
}
export function goodsListDetail(type, goodsId) {
  return request({
    url: `/pyl/operator/${config[type]}/product/${goodsId}`,
    method: 'get',
  });
}
export function deletGoods(type, id) {
  return request({
    url: `/pyl/operator/${config[type]}/product/${id}`,
    method: 'delete',
  });
}

export function addGoods(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/product`,
    method: 'post',
    data: parameter,
  });
}
// 集中采购 商品管理一键导出 /pyl/operator/cp/product/export
export function productOutput(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/product/export`,
    method: 'get',
    params: parameter,
    responseType: 'blob',
    timeout: 0
  });
}
// 修改商品状态管理
export function updateStatus(parameter) {
  return request({
    url: `/pyl/operator/cp/product/status`,
    method: 'put',
    data: parameter,
  });
}
// 修改商品状态管理
export function updateGoodsStatus(parameter) {
  return request({
    url: `/pyl/operator/ip/product/status`,
    method: 'put',
    data: parameter,
  });
}
