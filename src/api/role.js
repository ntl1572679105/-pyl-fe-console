import request from '@/utils/request';

const roleApi = {
  // 查询角色列表
  RoleList: '/pyl/operator/cm/role/list',
  // 单个角色详情
  roleDetail: '/pyl/operator/cm/role/',
  // 新增角色
  roleAdd: '/pyl/operator/cm/role',
  // 修改角色
  roleEdit: '/pyl/operator/cm/role',
  // 删除角色
  roleDelete: '/pyl/operator/cm/role/',
  // 查询所有可用角色
  roleAll: '/pyl/operator/cm/role/list/all',
};

export function roleList(parameter) {
  return request({
    url: roleApi.RoleList,
    method: 'get',
    params: parameter,
  });
}

export function roleDetail(roleid) {
  return request({
    url: roleApi.roleDetail + roleid,
    method: 'get',
  });
}

export function roleAdd(parameter) {
  return request({
    url: roleApi.roleAdd,
    method: 'post',
    data: parameter,
  });
}

export function roleEdit(parameter) {
  return request({
    url: roleApi.roleEdit,
    method: 'put',
    data: parameter,
  });
}

export function roleDelete(roleid) {
  return request({
    url: roleApi.roleDelete + roleid,
    method: 'delete',
  });
}

export function roleAll(parameter) {
  return request({
    url: roleApi.roleAll,
    method: 'get',
    data: parameter,
  });
}
