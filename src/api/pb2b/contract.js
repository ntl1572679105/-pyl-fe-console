import request from "@/utils/request";

const contractApi = {
  // 查询b2b—查询合同列表
  getList: '/pyl/operator/cm/contract/list',
}

export function contractList(parameter) {
  return request({
    url: contractApi.getList,
    method: 'get',
    params: parameter
  })
}