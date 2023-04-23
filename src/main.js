// with polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@ant-design-vue/pro-layout/dist/style.css'; // pro-layout css or style.less

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import { VueAxios } from './utils/request';

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import antdComponent from './core/lazy_use'; // 组件懒加载
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';
import './permission'; // 全局路由权限控制
import './assets/styles/global.less'; // 全局less

const app = createApp(App);
app.use(VueAxios);

app.use(router);
app.use(store);
antdComponent(app);
app.use(ProLayout);
app.use(PageContainer);
app.mount('#app');
