const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
};

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/layouts/BasicLayout.vue'),
    meta: { title: 'menu.home' },
    redirect: '/system/user',
    children: [],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    redirect: '/user/login',
    hidden: true,
    meta: {
      title: '登录',
    },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/ResetPwd.vue'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/RegisterResult.vue'),
      },
      {
        path: 'reset',
        name: 'reset',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/ResetPwd.vue'),
        meta: {
          'title': '重置密码',
        }
      },
      {
        path: 'wechat',
        name: 'wechat',
        meta: {
          'title': '微信登录',
        },
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/WeChatCode.vue'),
      },
    ],
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404.vue'),
  },
];

/**
 * 供应本地路由
 */
export const localRouterMap = [
  {
    name: 'rootRouterIndex',
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/cp-orderManage/list',
    meta: {
      title: '',
      hiddenHeaderContent: true,
    },
    children: [
      {
        component: () => import('@/layouts/BlankLayout.vue'),
        name: 'order',
        path: '/order',
        redirect: '/cp-orderManage/list',
        meta: {
          title: '订单资源库',
        },
        children: [
          {
            name: 'cp-orderManage-list',
            path: '/cp-orderManage/list',
            component: () => import('@/views/order/list.vue'),
            meta: {
              title: '集中采购',
              type: 1,
              hiddenHeaderContent: true,
            },
            children: []
          },
          {
            // cp-order-detail
            name: 'cp-order-detail',
            path: '/cp-order-detail/:id',
            component: () => import('@/views/order/Detail.vue'),
            meta: {
              title: '订单详情',
              type: 1,
              params: { id: 1 },
              hiddenHeaderContent: true,
              hideInMenu: true,
              parentPath: '/cp-orderManage/list',
              parentTitle: '集中采购',
            },
            // 将props传递给路由 设置为true时 route.params将被设置为组件的props
            props: true,
          },
          {
            name: 'ip-orderManage',
            path: '/ip-orderManage/list',
            component: () => import('@/views/order/list.vue'),
            meta: {
              title: '个人采购',
              type: 2,
              hiddenHeaderContent: true,
            },
            children: []
          },
          {
            name: 'ip-order-detail',
            path: '/ip-order-detail/:id',
            component: () => import('@/views/order/Detail.vue'),
            meta: {
              title: '订单详情',
              type: 2,
              params: { id: 1 },
              hiddenHeaderContent: true,
              hideInMenu: true,
              parentPath: '/ip-orderManage/list',
              parentTitle: '个人采购',
            },
            // 将props传递给路由 设置为true时 route.params将被设置为组件的props
            props: true,
          },
          {
            name: 'pb2b-orderManage',
            path: '/pb2b-orderManage',
            component: () => import('@/views/order/pb2b/index.vue'),
            meta: {
              title: '渔获商城',
              type: 2,
              hiddenHeaderContent: true,
            },
            children: []
          },
          {
            name: 'pb2b-order-detail',
            path: '/pb2b-orderDetail/:id',
            component: () => import('@/views/order/pb2b/OrderDeatil.vue'),
            meta: {
              title: '订单详情',
              type: 2,
              hiddenHeaderContent: true,
              hideInMenu: true,
              parentPath: '/pb2b-orderManage',
              parentTitle: '渔获商城',
            },
            // 将props传递给路由 设置为true时 route.params将被设置为组件的props
            props: true,
          },
        ],
      },
      {
        component: () => import('@/layouts/BlankLayout.vue'),
        name: 'goods',
        path: '/goods',
        redirect: '/cp-goodsManage/list',
        meta: {
          title: '商品资源库',
        },
        children: [
          {
            name: 'cp-goodsManage-list',
            path: '/cp-goodsManage/list',
            component: () => import('@/views/goods/list.vue'),
            meta: {
              title: '集中采购',
              type: 1,
              hiddenHeaderContent: true,
            },
          },
          {
            name: 'ip-goodsManage-list',
            path: '/ip-goodsManage/list',
            component: () => import('@/views/goods/list.vue'),
            meta: {
              title: '个人采购',
              type: 2,
              hiddenHeaderContent: true,
            }
          },
          {
            name: 'b2b-goodsManage-list',
            path: '/b2b-goodsManage/list',
            component: () => import('@/views/goods/p2b/list.vue'),
            meta: {
              title: '渔获商城',
              type: 2,
              hiddenHeaderContent: true,
            },
          }
        ],
      },
      {
        name: 'customer',
        path: '/customer',
        component: () => import('@/layouts/BlankLayout.vue'),
        redirect: '/customer/userlist',
        meta: {
          title: '用户资源库',
        },
        children: [
          {
            name: 'customer-user',
            path: '/customer/userlist',
            component: () => import('@/views/customer/UserList.vue'),
            meta: {
              title: '用户管理',
              hiddenHeaderContent: true,
            },
          },
          {
            name: 'customer-userDeatil',
            path: '/customer/userlistDeatil/:id',
            component: () => import('@/views/customer/UserListDeatil.vue'),
            meta: {
              title: '用户详情',
              hiddenHeaderContent: true,
              hideInMenu: true,
              parentPath: '/customer/userlist',
              parentTitle: '用户管理',
            },
            // 将props传递给路由 设置为true时 route.params将被设置为组件的props
            props: true,
          },
          {
            name: 'customer-feedback',
            path: '/customer/feedbacklist',
            component: () => import('@/views/customer/FeedbackList.vue'),
            meta: {
              title: '意见反馈',
              hiddenHeaderContent: true,
            },
          },
        ],
      },
      {
        name: 'role',
        path: '/role',
        component: () => import('@/layouts/BlankLayout.vue'),
        redirect: '/system/role-list',
        meta: {
          title: '组织资源库',
        },
        children: [
          {
            name: 'role-list',
            path: '/system/role-list',
            component: () => import('@/views/system/RoleList.vue'),
            meta: {
              title: '角色管理',
            },
          },
          {
            name: 'admin-list',
            path: '/system/admin-list',
            component: () => import('@/views/system/AdminList.vue'),
            meta: {
              title: '管理员管理',
            },
          },
          {
            name: 'menu-list',
            path: '/system/menu-list',
            component: () => import('@/views/system/MenuList.vue'),
            meta: {
              title: '菜单管理',
            },
          },
        ],
      },
      {
        name: 'goodsManage',
        path: '/goodsManage',
        component: () => import('@/layouts/BlankLayout.vue'),
        redirect: '/goodsManage',
        meta: {
          title: '商户资源库',
        },
        children: [
          {
            name: 'cp-supplierManage',
            path: '/cp-supplierManage',
            component: () => import('@/views/goods/supplier.vue'),
            meta: {
              title: '集中采购              ',
              type: 1,
              hiddenHeaderContent: true,
            },
          },
          {
            name: 'ip-supplierManage',
            path: '/ip-supplierManage',
            component: () => import('@/views/goods/supplier.vue'),
            meta: {
              title: '个人采购              ',
              type: 2,
              hiddenHeaderContent: true,
            },
          },
        ],
      },
      {
        name: 'tools',
        path: '/tools',
        component: () => import('@/layouts/BlankLayout.vue'),
        redirect: '/tools/userlist',
        meta: {
          title: '渔船资源库',
        },
        children: [
          {
            name: 'tools-grade',
            path: '/tools/grade',
            component: () => import('@/views/tools/Grade.vue'),
            meta: {
              title: '渔获评级',
              hiddenHeaderContent: true,
            },
          },
          {
            name: 'tools-deal',
            path: '/tools/deal',
            component: () => import('@/views/tools/Deal.vue'),
            meta: {
              title: '渔获交易价格',
              hiddenHeaderContent: true,
            },
          },
        ],
      },
    ],
  },
];
