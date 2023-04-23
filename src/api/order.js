import request from '@/utils/request';
import config from './config';

// 集中采购订单列表

export function orderList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/order/list`,
    method: 'get',
    params: parameter,
  });
}
// 获取集中采购—订单详情

export function orderListDatil(type, orderId) {
  return request({
    url: `/pyl/operator/${config[type]}/order/${orderId}`,
    method: 'get',
  });
}
export function personListDeatil(orderId) {
  return request({
    url: orderApi.personListDeatil + orderId,
    method: 'get',
  });
}
export function updateOrder(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/order`,
    method: 'put',
    data: parameter,
  });
}
export function personUpdataDatil(parameter) {
  return request({
    url: orderApi.personUpdataDatil,
    method: 'put',
    data: parameter,
  });
}
export function orderAfterSalesList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/orderAfterSales/list`,
    method: 'get',
    params: parameter,
  });
}
export function personorderAfterSalesList(parameter) {
  return request({
    url: orderApi.personorderAfterSalesList,
    method: 'get',
    params: parameter,
  });
}
export function orderAfterSalesDeatil(type, id) {
  return request({
    url: `/pyl/operator/${config[type]}/orderAfterSales/${id}`,
    method: 'get',
  });
}
export function personorderAfterSalesDeatil(id) {
  return request({
    url: orderApi.personorderAfterSalesDeatil + id,
    method: 'get',
  });
}
export function updateorderAfterSales(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/orderAfterSales`,
    method: 'put',
    data: parameter,
  });
}
export function personupdateorderAfterSales(parameter) {
  return request({
    url: orderApi.personupdateorderAfterSales,
    method: 'put',
    data: parameter,
  });
}

export function commentList(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/product/comment/list`,
    method: 'get',
    params: parameter,
  });
}
export function personcommentList(parameter) {
  return request({
    url: orderApi.personcommentList,
    method: 'get',
    params: parameter,
  });
}
export function commentDelete(type, id) {
  return request({
    url: `/pyl/operator/${config[type]}/product/comment/${id}`,
    method: 'delete',
  });
}
// 集采运营端—商家评价
export function CommentUpdate(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/product/comment`,
    method: 'put',
    data: parameter,
  });
}
// b2b—商家评价
export function UpdateComment(type, parameter) {
  return request({
    url: '/pb2b/shop/productComment',
    method: 'put',
    data: parameter,
  });
}
export function personcommentDelete(id) {
  return request({
    url: orderApi.personcommentDelete + id,
    method: 'delete',
  });
}
export function getcomment(id) {
  return request({
    url: orderApi.getcomment + id,
    method: 'get',
  });
}
// 确认退款—订单售后 /pyl/operator/cp/orderAfterSales/refund
export function returnMoney(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/orderAfterSales/refund`,
    method: 'put',
    data: parameter,
  });
}
// 售后收货—订单售后 /pyl/operator/cp/orderAfterSales/receive
export function receive(type, parameter) {
  return request({
    url: `/pyl/operator/${config[type]}/orderAfterSales/receive`,
    method: 'put',
    data: parameter,
  });
}

// 售后收货—最近售后详情
export function getLast(type, params) {
  return request({
    url: `/pyl/operator/${config[type]}/orderAfterSales/getLast`,
    method: 'get',
    params,
  });
}

// 集中采购导出订单
export function orderOutPut(parameter) {
  return request({
    url: `/pyl/operator/cp/order/export`,
    method: 'get',
    params: parameter,
    responseType: 'blob',
  });
}
// 集中 已到前置仓
export function arrivedFront(parameter) {
  return request({
    url: `/pyl/operator/cp/order/arrived`,
    method: 'put',
    data: parameter,
  });
}
// 集中订单核销
export function orderWriteOff(parameter) {
  return request({
    url: `/pyl/operator/cp/order/writeOff`,
    method: 'put',
    data: parameter,
  });
}
// 分配订单
export function orderAssign(parameter) {
  return request({
    url: `/pyl/operator/cp/order/assign`,
    method: 'put',
    data: parameter,
  });
}
// /pyl/operator/cp/order/writeOff

// 查询物流公司列表
export function logisticsList(params) {
  return request({
    url: '/pyl/operator/ip/logisticsDetailGet/list',
    method: 'get',
    params,
  });
}

// 获取物流详情
export function logisticsDetail(id) {
  return request({
    url: `/pyl/operator/ip/logisticsDetailGet?orderNo=${id}`,
    method: 'get',
  });
}

// 发货信息列表
export function shippingList(params) {
  return request({
    url: '/pyl/operator/cp/order/delivery',
    method: 'get',
    params
  });
}