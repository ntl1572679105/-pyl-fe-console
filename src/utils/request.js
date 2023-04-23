import axios from 'axios';
import store from '@/store';
import storage from 'store';
import notification from 'ant-design-vue/es/notification';
import { message } from 'ant-design-vue';
import { VueAxios } from './axios';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { router } from '@/router';

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const { data } = error.response;
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message,
      });
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      });
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }
    }
  }
  return Promise.reject(error);
};

// // 不使用token的请求
// const whiteList = ['/captchaImage', '/login']
// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  // console.log(config)
  // if (!whiteList.some(item => config.url.includes(item))) {
  //   config.headers['Authorization'] = token || ''
  // }
  // 如果 token 存在
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  const { code } = response.data;
  if (code === 401) {
    store.dispatch('Reset');

    message.error('登录过期，请重新登录');
    console.log(router);
    router.replace('/user/login');

    return Promise.reject(response);
  } else if (code === 200) {
    if (response.data.total || typeof response.data.total === 'number') {
      return Promise.resolve({ data: response.data.data, total: response.data.total });
    } else if (typeof response.data.data === 'boolean') {
      return Promise.resolve(response.data);
    } else if (response.data.total) {
      return Promise.resolve(response.data);
    } else {
      return Promise.resolve(response.data.data);
    }
  } else if (response.config && response.config.responseType === 'blob') {
    return Promise.resolve(response);
  } else if ((response.data.msg + '').substring(0, 10) === '错误代码：40163') {
    message.error('二维码已失效，请重新获取二维码')
  } else if ((response.data.msg + '').substring(0, 7) === '绑定时间已超时') {
    message.error('二维码已失效，请重新获取二维码')
    setTimeout(() => {
      router.replace('/user/login');
    }, 1000);
  } else {
    console.log(response.data.msg);
    message.error(response.data.msg);
    return Promise.reject(response);
  }
}, errorHandler);

const installer = {
  vm: {},
  install(app) {
    app.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
