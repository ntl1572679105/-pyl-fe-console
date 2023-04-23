import request from "@/utils/request";

const gradeApi = {
  // 评级
  grade: `/pb2b/operator/grade`,
}

export function getGrade(parameter) {
  return request({
    url: gradeApi.grade,
    method: 'post',
    data: parameter
  })
}
