import request from "@/utils/request";

const dealApi = {
  // 评级
  list: `/pb2b/operator/seaFood/list`,
}

export function getDealList(parameter) {
  return request({
    url: dealApi.list,
    method: 'get',
    params: parameter
  })
}
