import request from '@/utils/request';

const menuApi = {
  // 菜单列表
  MenuList: '/pyl/operator/cm/menu/list',
  // 单个菜单详情
  MenuDetail: '/pyl/operator/cm/menu/',
  // 新增菜单
  MenuAdd: '/pyl/operator/cm/menu',
  // 修改菜单
  MenuEdit: '/pyl/operator/cm/menu',
  // 删除菜单
  MenuDelete: '/pyl/operator/cm/menu/',
};

export function menuList(parameter) {
  return request({
    url: menuApi.MenuList,
    method: 'get',
    data: parameter,
  });
}

export function menuDetail(menuid) {
  return request({
    url: menuApi.MenuDetail + menuid,
    method: 'get',
  });
}

export function menuAdd(parameter) {
  return request({
    url: menuApi.MenuAdd,
    method: 'post',
    data: parameter,
  });
}

export function menuEdit(parameter) {
  return request({
    url: menuApi.MenuEdit,
    method: 'put',
    data: parameter,
  });
}

export function menuDelete(menuid) {
  return request({
    url: menuApi.MenuDelete + menuid,
    method: 'delete',
  });
}
