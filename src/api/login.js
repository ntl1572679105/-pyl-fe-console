import request from '@/utils/request';

const userApi = {
  // 图形验证码
  CaptchaImage: '/pyl/common/captchaImage',
  // 登录
  Login: '/pyl/operator/cm/admin/login',
  // 获取用户信息
  UserInfo: '/pyl/operator/cm/admin/info',
  // 获取菜单信息  /pyl/operator/cm/menu/list
  UserMenu: '/pyl/operator/cm/common/menu/list',
  // 修改密码
  ChangePassword: '/pyl/operator/cm/admin/updatePwd',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  SendSms: '/account/sms',
  // 获取手机验证码
  SendSmsCaptcha: '/pyl/common/captcha/sms',
  // 重置密码
  resetPwd: '/pyl/common/password/reset',
  // 微信扫码登录
  WeChatLogin: '/pyl/common/wxScan/login',
  // 微信扫码短信
  WxCaptcha: '/pyl/common/wxScan/captcha/phone',
  // 微信扫码绑定手机
  WxBinding: '/pyl/common/wxScan/bind'
};

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter,
  });
}

export function resetPwd(parameter) {
  return request({
    url: userApi.resetPwd,
    method: 'post',
    data: parameter,
  });
}

export function getCaptchaImage() {
  return request({
    url: userApi.CaptchaImage,
    method: 'get',
  });
}

export function getSmsCaptcha(parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter,
  });
}

export function WxBind(parameter) {
  return request({
    url: userApi.WxBinding,
    method: 'post',
    data: parameter,
  });
}


export function getSendSmsCaptcha(parameter) {
  return request({
    url: userApi.SendSmsCaptcha,
    method: 'get',
    params: parameter,
  });
}
export function getWxCaptcha(parameter) {
  return request({
    url: userApi.WxCaptcha,
    method: 'post',
    data: parameter,
  });
}

export function changePassword(parameter) {
  return request({
    url: userApi.ChangePassword,
    method: 'put',
    data: parameter,
  });
}

export function getInfo() {
  return request({
    url: userApi.UserInfo,
    method: 'get',
  });
}


export function WeChatToken(params) {
  return request({
    url: userApi.WeChatLogin,
    method: 'get',
    params
  });
}

export function getCurrentUserNav() {
  return request({
    url: userApi.UserMenu,
    method: 'get',
  });
}

export function logout() {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step(parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter,
  });
}
