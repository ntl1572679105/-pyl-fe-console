# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## 打包注意

1. 测试：关联使用 jenkins 打包部署到 oss 上
2. UAT：本地打包`npm run build:uat`, 将 dist 文件夹压缩为 pyl-console-uat.zip,再上传到 oss: http://web.hobbykit.cn/publish/zip/ 目录下
3. 正式: 本地打包`npm run build`, 将 dist 文件夹压缩为 pyl-console-pro.zip,再上传到 oss: http://web.hobbykit.cn/publish/zip/ 目录下

## 常用依赖

- "vue": "^3.2.25": vue
- "vuex":"^4.0.2", 数据仓库
- "vue-router":"^4.0.14", 路由
- "axios":"^0.26.1",网络库
- "dayjs":"^1.11.0", 日期时间处理 js
- "lodash":"^4.17.21", 含有节流、防抖、pick 等功能
- "store": "^2.0.12", localstore 等处理
- "vue-clipboard2": "^0.3.3", 常用内容拷贝 js
- "ant-design-vue": "^.3.1.0-rc.2", UI 组件库
- "nprogress": "^0.2.0", 导航栏进度显示

## 目录

### api

存放网络请求相关内容

### assets

存放图片资源、字体资源和通用样式

### components

存放全局通用组件和常用组件

### config

存放全局配置和基础路由配置

### core

存放组件懒加载内容、自定义指令等

### plugin

存放插件，也可以放引入到本地的第三方插件

### layouts

存放全局布局内容

### locales

本地化，暂不需要

### mock

mock 数据，根据情况加载

### router

路由设置，及动态路由生成

### store

全局仓库管理

### utils

常用 js 库

## Antd-vue 3

### 注意

#### icon

icon 使用：<https://www.antdv.com/components/icon-cn#components-icon-demo-iconfont>
对应原来组件直接使用 icon 的要特别注意
