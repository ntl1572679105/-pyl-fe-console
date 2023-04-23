import request from "@/utils/request";

const ruleApi = {
  // 查询集中采购-违规规则列表
  RulesList: '/pb2b/operator/violationRules/list',
  // 更新集中采购-违规规则
  UpdateRules: '/pb2b/operator/violationRules',
  // 新增集中采购-违规规则
  AddRules: '/pb2b/operator/violationRules',
  // 删除集中采购-违规规则
  DelRules: '/pb2b/operator/violationRules',
  // 查询集中采购-违规规则详情
  RuleDetail: '/pb2b/operator/violationRules/',
}

export function List (parameter) {
  return request({
    url: ruleApi.RulesList,
    method: 'get',
    params: parameter
  })
}

export function Update (parameter) {
  return request({
    url: ruleApi.UpdateRules,
    method: 'put',
    params: parameter
  })
}


export function Add (parameter) {
  return request({
    url: ruleApi.AddRules,
    method: 'post',
    data: parameter
  })
}


export function Delete (parameter) {
  return request({
    url: ruleApi.DelRules,
    method: 'delete',
    params: parameter
  })
}


export function Detail (id) {
  return request({
    url: ruleApi.RuleDetail + id,
    method: 'get',
  })
}

