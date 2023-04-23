import request from '@/utils/request';

const commonApi = {
  // 图形验证码
  CaptchaImage: '/pyl/common/captchaImage',
  // 上传文件
  upload: '/pyl/common/file/upload',
  // 下载文件
  down: '/pyl/common/download',

  // 查询菜单列表
  menuList: '/pyl/operator/cm/common/menu/list',
  // 查询角色列表
  roleList: '/pyl/operator/cm/common/role/list',
};

export function getCaptchaImage() {
  return request({
    url: commonApi.CaptchaImage,
    method: 'get',
  });
}

export function Upload(parameter) {
  return request({
    url: commonApi.upload,
    method: 'post',
    data: parameter,
  });
}

export function download(params) {
  return request({
    url: commonApi.down,
    method: 'get',
    params,
    responseType: 'blob',
  });
}

export function menuList() {
  return request({
    url: commonApi.menuList,
    method: 'get',
  });
}

export function roleList() {
  return request({
    url: commonApi.roleList,
    method: 'get',
  });
}
