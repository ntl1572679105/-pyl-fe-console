import * as loginService from '@/api/login';
// 根据接口返回的path映射路由
const menuMap = new Map();
// key: 为返回菜单的path，value: 对应的组件页面及子页面

/// 前端本地映射路由
// 订单管理列表
menuMap.set('/ip-orderManage/list', {
  name: 'ip-orderManage-list',
  path: '/ip-orderManage/list',
  component: () => import('@/views/order/list.vue'),
  meta: {
    title: '订单管理',
    type: 2,
    hiddenHeaderContent: true,
  },
  children: [
    {
      // cp-order-detail
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
        parentTitle: '订单列表',
      },
      props: true,
    },
  ],
});
menuMap.set('/cp-orderManage/list', {
  name: '/cp-orderManage/list',
  path: '/cp-orderManage/list',
  component: () => import('@/views/order/list.vue'),
  meta: {
    title: '订单管理',
    type: 1,
    hiddenHeaderContent: true,
  },
  children: [
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
        parentTitle: '订单列表',
      },
      props: true,
    },
  ],
});
menuMap.set('/cp-shipping-order', {
  name: 'cp-shipping-order',
  path: '/cp-shippingOrder',
  component: () => import('@/views/order/ShippingOrder.vue'),
  meta: {
    title: '发货信息列表',
    type: 1
  },
  children: [
    {
      // cp-order-detail
      name: 'cp-shipping-detail',
      path: '/cp-shipping-detail/:id',
      component: () => import('@/views/order/Detail.vue'),
      meta: {
        title: '发货信息详情',
        type: 1,
        params: { id: 1 },
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/cp-shippingOrder',
        parentTitle: '发货信息列表',
      },
      props: true,
    },
  ],
})
// 经营报表
menuMap.set('/cp-reportOrder', {
  name: 'cp-report-order',
  path: '/cp-reportOrder',
  component: () => import('@/views/report/OrderStatistics.vue'),
  meta: {
    title: '订单统计',
    type: 1,
  },
});
menuMap.set('/cp-reportGoods', {
  name: 'cp-report-goods',
  path: '/cp-reportGoods',
  component: () => import('@/views/report/OrderStatistics.vue'),
  meta: {
    title: '商品销售',
    type: 1,
  },
});
// 经营概况
menuMap.set('/cp-jingYingGaiKuan', {
  name: 'cp-jingYingGaiKuan',
  path: '/cp-jingYingGaiKuan',
  component: () => import('@/views/report/jingYingGaiKuan.vue'),
  meta: {
    title: '经营概况',
    type: 1,
  },
});
// 供应链审核
menuMap.set('/cp-gongYingLian', {
  name: 'cp-gongYingLian',
  path: '/cp-gongYingLian',
  component: () => import('@/views/goods/gongYingLian.vue'),
  meta: {
    title: '供应链审核',
    type: 1,
  },
});
// 经营报表
menuMap.set('/pb2b-reportOrder', {
  name: 'pb2b-report-order',
  path: '/pb2b-reportOrder',
  component: () => import('@/views/report/OrderStatistics.vue'),
  meta: {
    title: '订单统计',
    type: 2,
  },
});
// 重置密码
// menuMap.set('reset', {
//   name: 'reset',
//   path: 'reset',
//   component: () => import('@/views/login/ResetPwd.vue'),
//   meta: {
//     title: '重置密码',
//   },
// });
menuMap.set('/pb2b-reportGoods', {
  name: 'pb2b-report-goods',
  path: '/pb2b-reportGoods',
  component: () => import('@/views/report/OrderStatistics.vue'),
  meta: {
    title: '商品销售',
    type: 2,
  },
});
menuMap.set('/pb2b-jingYingGaiKuan', {
  name: 'pb2b-jingYingGaiKuan',
  path: '/pb2b-jingYingGaiKuan',
  component: () => import('@/views/report/jingYingGaiKuan.vue'),
  meta: {
    title: '经营概况',
    type: 2,
  },
});
// 违规管理
menuMap.set('/pb2b-violateManage', {
  name: 'pb2b-violate-manage',
  path: '/pb2b-violateManage',
  component: () => import('@/views/goods/p2b/Violate.vue'),
  meta: {
    title: '违规管理',
    type: 2,
  },
});
// 违规规则
menuMap.set('/pb2b-violateRules', {
  name: 'pb2b-violate-rules',
  path: '/pb2b-violateRules',
  component: () => import('@/views/goods/p2b/ViolateRules.vue'),
  meta: {
    title: '违规规则',
    type: 2,
  },
});
// 评价管理列表
menuMap.set('/ip-commentManage/list', {
  name: 'ip-commentManage',
  path: '/ip-commentManage/list',
  component: () => import('@/views/order/Management.vue'),
  meta: {
    title: '评价管理',
    type: 2,
    hiddenHeaderContent: true,
  },
});
menuMap.set('/cp-commentManage/list', {
  name: 'cp-commentManage',
  // cp-commentManage  /order/management
  path: '/cp-commentManage/list',
  component: () => import('@/views/order/Management.vue'),
  meta: {
    title: '评价管理',
    type: 1,
    hiddenHeaderContent: true,
  },
});
// 退换售后列表
menuMap.set('/cp-orderAfterSalesManage/list', {
  name: 'cp-orderAfterSalesManage',
  path: '/cp-orderAfterSalesManage/list',
  component: () => import('@/views/order/Returnandsale.vue'),
  meta: {
    title: '退换售后',
    type: 1,
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'cp-orderAfterSalesManage-detail',
      path: '/cp-orderAfterSalesManage/:id',
      component: () => import('@/views/order/ReturnAndSaleDetail.vue'),
      meta: {
        title: '退换售后详情',
        type: 1,
        params: { id: 1 },
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/cp-orderAfterSalesManage/list',
        parentTitle: '退换售后',
      },
      props: true,
    },
  ],
});
menuMap.set('/ip-orderAfterSalesManage/list', {
  name: 'ip-orderAfterSalesManage',
  path: '/ip-orderAfterSalesManage/list',
  component: () => import('@/views/order/Returnandsale.vue'),
  meta: {
    title: '退换售后',
    type: 2,
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'ip-orderAfterSalesManage-detail',
      path: '/ip-orderAfterSalesManage/:id',
      component: () => import('@/views/order/ReturnAndSaleDetail.vue'),
      meta: {
        title: '退换售后详情',
        type: 2,
        params: { id: 1 },
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/ip-orderAfterSalesManage/list',
        parentTitle: '退换售后',
      },
      props: true,
    },
  ],
});
menuMap.set('/cp-disputedOrderManage/list', {
  name: 'cp-disputedOrderManage',
  path: '/cp-disputedOrderManage/list',
  component: () => import('@/views/order/DisputedManage.vue'),
  meta: {
    title: '纠纷订单管理',
    type: 1,
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'cp-disputedOrderManage-detail',
      path: '/cp-disputedOrderManage/:id',
      component: () => import('@/views/order/DisputedManageDetail.vue'),
      meta: {
        title: '纠纷订单详情',
        type: 1,
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/cp-disputedOrderManage/list',
        parentTitle: '纠纷订单管理',
      },
      props: true,
    },
  ],
});
menuMap.set('/pb2b-disputedOrderManage/list', {
  name: 'pb2b-disputedOrderManage',
  path: '/pb2b-disputedOrderManage/list',
  component: () => import('@/views/order/pb2b/DisputedManage.vue'),
  meta: {
    title: '纠纷订单管理',
    type: 2,
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'pb2b-disputedOrderManage-detail',
      path: '/pb2b-disputedOrderManage/:id',
      component: () => import('@/views/order/pb2b/DisputedManageDetail.vue'),
      meta: {
        title: '纠纷订单详情',
        type: 2,
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/pb2b-disputedOrderManage/list',
        parentTitle: '纠纷订单管理',
      },
      props: true,
    },
  ],
});
// 商品管理列表
menuMap.set('/cp-goodsManage/list', {
  name: 'cp-goodsManage-list',
  path: '/cp-goodsManage/list',
  component: () => import('@/views/goods/list.vue'),
  meta: {
    title: '商品管理',
    type: 1,
    hiddenHeaderContent: true,
  },
  children: [
    // 新增
    {
      name: 'cp-goodsManage-add',
      // /goods/add
      path: '/cp-goodsManage/add',
      component: () => import('@/views/goods/AddGoods.vue'),
      // 添加自定义数据
      meta: {
        title: '新增商品',
        hiddenHeaderContent: true,
        hideInMenu: true,
        type: 1,
        parentPath: '/cp-goodsManage/list',
        parentTitle: '商品管理',
      },
      props: true,
    },
    {
      // 编辑
      name: 'cp-goodsManage-editor',
      // cp-goodsManage-editor /goods/add/:id
      path: '/cp-goodsManage/editor/:id',
      component: () => import('@/views/goods/AddGoods.vue'),
      // 添加自定义数据
      meta: {
        title: '编辑商品',
        hiddenHeaderContent: true,
        hideInMenu: true,
        type: 1,
        parentPath: '/cp-goodsManage/list',
        parentTitle: '商品管理',
      },
      props: true,
    },
  ],
});
menuMap.set('/ip-goodsManage/list', {
  name: 'ip-goodsManage-list',
  path: '/ip-goodsManage/list',
  component: () => import('@/views/goods/list.vue'),
  meta: {
    title: '商品管理',
    type: 2,
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'ip-goodsManage-add',
      path: '/ip-goodsManage/add',
      component: () => import('@/views/goods/AddGoods.vue'),
      // 添加自定义数据
      meta: {
        title: '新增商品',
        hiddenHeaderContent: true,
        hideInMenu: true,
        type: 2,
        parentPath: '/ip-goodsManage/list',
        parentTitle: '商品管理',
      },
      props: true,
    },
    {
      name: 'ip-goodsManage-editor',
      // cp-goodsManage-editor /goods/add/:id
      path: '/ip-goodsManage/editor/:id',
      component: () => import('@/views/goods/AddGoods.vue'),
      // 添加自定义数据
      meta: {
        title: '编辑商品',
        hiddenHeaderContent: true,
        hideInMenu: true,
        type: 2,
        parentPath: '/ip-goodsManage/list',
        parentTitle: '商品管理',
      },
      props: true,
    },
  ],
});
// 前置仓管理列表
menuMap.set('/cp-frontmanagement/list', {
  name: 'cp-frontmanagement-list',
  path: '/cp-frontmanagement/list',
  component: () => import('@/views/goods/Frontmanagement.vue'),
  meta: {
    title: '前置仓管理',
    type: 1,
    hiddenHeaderContent: true,
  },
});
// 供应商管理列表
menuMap.set('/cp-supplierManage', {
  name: '/cp-supplierManage',
  path: '/cp-supplierManage',
  component: () => import('@/views/goods/supplier.vue'),
  meta: {
    title: '供应商管理              ',
    type: 1,
    hiddenHeaderContent: true,
  },
});
menuMap.set('/ip-supplierManage', {
  name: 'ip-supplierManage',
  path: '/ip-supplierManage',
  component: () => import('@/views/goods/supplier.vue'),
  meta: {
    title: '供应商管理              ',
    type: 2,
    hiddenHeaderContent: true,
  },
});
// 小程序聚合首页
menuMap.set('/aggregationPage', {
  name: 'aggregation-page',
  path: '/aggregationPage',
  component: () => import('@/views/miniapp/Aggregation.vue'),
  meta: {
    title: '小程序聚合首页',
    type: 2,
    hiddenHeaderContent: true
  }
})
// 首页Banner管理列表
menuMap.set('/cp-miniapp/bannermanage', {
  name: 'cp-miniapp-bannermanage',
  path: '/cp-miniapp/bannermanage',
  component: () => import('@/views/miniapp/BannerManage.vue'),
  meta: {
    title: '首页Banner管理',
    type: 1,
    hiddenHeaderContent: true,
  },
});
menuMap.set('/ip-miniapp/bannermanage', {
  name: 'ip-miniapp-bannermanage',
  path: '/ip-miniapp/bannermanage',
  component: () => import('@/views/miniapp/BannerManage.vue'),
  meta: {
    title: '首页Banner管理',
    type: 2,
    hiddenHeaderContent: true,
  },
});

// 好吃推荐列表
menuMap.set('/cp-miniapp/recommender-good/:type', {
  name: 'cp-recommender-good',
  path: '/cp-miniapp/recommender-good/:type',
  component: () => import('@/views/miniapp/RecommenderManage.vue'),
  // 添加自定义数据
  meta: {
    title: '好吃推荐',
    params: { type: 1 },
    type: 1,
    hiddenHeaderContent: true,
  },
  props: true,
});
menuMap.set('/ip-miniapp/recommender-good/:type', {
  name: 'ip-recommender-good',
  path: '/ip-miniapp/recommender-good/:type',
  component: () => import('@/views/miniapp/RecommenderManage.vue'),
  // 添加自定义数据
  meta: {
    title: '好吃推荐',
    params: { type: 1 },
    type: 2,
    hiddenHeaderContent: true,
  },
  props: true,
});
// 集市上新列表
menuMap.set('/cp-miniapp/recommender-new/:type', {
  name: 'cp-recommender-new',
  path: '/cp-miniapp/recommender-new/:type',
  component: () => import('@/views/miniapp/RecommenderManage.vue'),
  // 添加自定义数据
  meta: {
    title: '集市上新',
    type: 1,
    params: { type: 2 },
    hiddenHeaderContent: true,
  },
  props: true,
});
menuMap.set('/ip-miniapp/recommender-new/:type', {
  name: 'ip-recommender-new',
  path: '/ip-miniapp/recommender-new/:type',
  component: () => import('@/views/miniapp/RecommenderManage.vue'),
  // 添加自定义数据
  meta: {
    title: '集市上新',
    type: 2,
    params: { type: 2 },
    hiddenHeaderContent: true,
  },
  props: true,
});
// 集市经典列表
menuMap.set('/cp-miniapp/recommender-classics/:type', {
  name: 'cp-recommender-classics',
  path: '/cp-miniapp/recommender-classics/:type',
  component: () => import('@/views/miniapp/RecommenderManage.vue'),
  // 添加自定义数据
  meta: {
    title: '集市经典',
    type: 1,
    params: { type: 3 },
    hiddenHeaderContent: true,
  },
  props: true,
});
menuMap.set('/ip-miniapp/recommender-classics/:type', {
  name: 'ip-recommender-classics',
  path: '/ip-miniapp/recommender-classics/:type',
  component: () => import('@/views/miniapp/RecommenderManage.vue'),
  // 添加自定义数据
  meta: {
    title: '集市经典',
    type: 2,
    params: { type: 3 },
    hiddenHeaderContent: true,
  },
  props: true,
});
menuMap.set('/vip/list', {
  name: 'vip-list',
  path: '/vip/list',
  component: () => import('@/views/vip/list.vue'),
  meta: {
    title: '会员管理',
    hiddenHeaderContent: true,
    type: 1,
  },
  children: [
    {
      name: 'vip-detail',
      path: '/vip/detail/:id',
      component: () => import('@/views/vip/detail.vue'),
      meta: {
        title: '会员详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/vip/list',
        parentTitle: '会员管理',
      },
      // 将props传递给路由 设置为true时 route.params将被设置为组件的props
      props: true,
    },
  ],
});

menuMap.set('/vip/pb2b-list', {
  name: 'vip-pb2b-list',
  path: '/vip/pb2b-list',
  component: () => import('@/views/vip/list.vue'),
  meta: {
    title: '会员管理',
    hiddenHeaderContent: true,
    type: 2,
  },
  children: [
    {
      name: 'vip-pb2b-detail',
      path: '/vip/pb2b-detail/:id',
      component: () => import('@/views/vip/detail.vue'),
      meta: {
        title: '会员详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/vip/list',
        parentTitle: '会员管理',
      },
      // 将props传递给路由 设置为true时 route.params将被设置为组件的props
      props: true,
    },
  ],
});
menuMap.set('/vip/statistics', {
  name: 'vip-statistics',
  path: '/vip/statistics',
  component: () => import('@/views/vip/Statistics.vue'),
  meta: {
    type: 1,
    title: '会员统计',
    hiddenHeaderContent: true,
  },
  children: [],
});
menuMap.set('/vip/pb2b-statistics', {
  name: 'vip-pb2b-statistics',
  path: '/vip/pb2b-statistics',
  component: () => import('@/views/vip/Statistics.vue'),
  meta: {
    type: 2,
    title: '会员统计',
    hiddenHeaderContent: true,
  },
  children: [],
});
// 用户管理列表
menuMap.set('/customer/userlist', {
  name: 'customer-user',
  path: '/customer/userlist',
  component: () => import('@/views/customer/UserList.vue'),
  meta: {
    title: '用户管理',
    hiddenHeaderContent: true,
  },
  children: [
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
  ],
});
// 意见反馈列表
menuMap.set('/customer/feedbacklist', {
  name: 'customer-feedback',
  path: '/customer/feedbacklist',
  component: () => import('@/views/customer/FeedbackList.vue'),
  meta: {
    title: '意见反馈',
    hiddenHeaderContent: true,
  },
});
// 类目管理列表
menuMap.set(`/cp-system/categorylist`, {
  name: 'cp-system-category',
  path: '/cp-system/categorylist',
  component: () => import('@/views/system/CategoryList.vue'),
  meta: {
    title: '类目管理',
    type: 1,
    hiddenHeaderContent: true,
  },
});
menuMap.set(`/ip-system/person-categorylist`, {
  name: 'ip-system-person-category',
  path: '/ip-system/person-categorylist',
  component: () => import('@/views/system/CategoryList.vue'),
  meta: {
    title: '类目管理',
    type: 2,
    hiddenHeaderContent: true,
  },
});
// 角色管理列表
menuMap.set(`/system/role-list`, {
  name: 'role-list',
  path: '/system/role-list',
  component: () => import('@/views/system/RoleList.vue'),
  meta: {
    title: '角色管理',
  },
});
// 管理员管理列表
menuMap.set(`/system/admin-list`, {
  name: 'admin-list',
  path: '/system/admin-list',
  component: () => import('@/views/system/AdminList.vue'),
  meta: {
    title: '管理员管理',
  },
});
// 菜单管理列表
menuMap.set(`/system/menu-list`, {
  name: 'menu-list',
  path: '/system/menu-list',
  component: () => import('@/views/system/MenuList.vue'),
  meta: {
    title: '菜单管理',
  },
});
// 个人采购优惠券管理列表
menuMap.set(`/ip-miniapp/discountManage`, {
  name: 'ip-discountManage',
  path: '/ip-miniapp/discountManage',
  component: () => import('@/views/miniapp/DiscountManage.vue'),
  // 添加自定义数据
  meta: {
    title: '优惠券管理',
    type: 2,
    hiddenHeaderContent: true,
  },
  props: true,
  children: [
    {
      name: 'ip-discountManage-add',
      path: '/ip-miniapp/discountManage/add',
      component: () => import('@/views/miniapp/AddDiscountManage.vue'),
      // 添加自定义数据
      meta: {
        title: '新增优惠券',
        type: 2,
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/ip-miniapp/discountManage',
        parentTitle: '优惠券管理',
      },
      props: true,
    },
    {
      name: 'ip-discountManage-update',
      path: '/ip-miniapp/discountManage/update/:id',
      component: () => import('@/views/miniapp/AddDiscountManage.vue'),
      // 添加自定义数据
      meta: {
        title: '编辑优惠券',
        type: 2,
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/ip-miniapp/discountManage',
        parentTitle: '优惠券管理',
      },
      props: true,
    },
  ],
});
// 集中采购优惠券列表
menuMap.set(`/cp-miniapp/discountManage`, {
  name: 'cp-discountManage',
  path: '/cp-miniapp/discountManage',
  component: () => import('@/views/miniapp/DiscountManage.vue'),
  // 添加自定义数据
  meta: {
    title: '优惠券管理',
    type: 1,
    hiddenHeaderContent: true,
  },
  props: true,
  children: [
    {
      name: 'cp-discountManage-add',
      path: '/cp-miniapp/discountManage/add',
      component: () => import('@/views/miniapp/AddDiscountManage.vue'),
      // 添加自定义数据
      meta: {
        title: '新增优惠券',
        type: 1,
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/cp-miniapp/discountManage',
        parentTitle: '优惠券管理',
      },
      props: true,
    },
    {
      name: 'cp-discountManage-update',
      path: '/cp-miniapp/discountManage/update/:id',
      component: () => import('@/views/miniapp/AddDiscountManage.vue'),
      // 添加自定义数据
      meta: {
        title: '编辑优惠券',
        type: 1,
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/cp-miniapp/discountManage',
        parentTitle: '优惠券管理',
      },
      props: true,
    },
  ],
});

// 渔获商城
menuMap.set(`pb2b-goods`, {
  name: 'pb2b-goods',
  path: '/pb2b-goodsManage',
  component: () => import('@/views/goods/p2b/list.vue'),
  meta: {
    title: '渔获商城商品管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'pb2b-goodsDeatil',
      path: '/pb2b-goodsDeatil/:id',
      component: () => import('@/views/goods/p2b/Deatil.vue'),
      meta: {
        title: '商品详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/pb2b-goodsManage',
        parentTitle: '商品管理',
      },
      props: true,
    },
  ],
});
// 店铺管理
menuMap.set(`pb2b-shop`, {
  name: 'pb2b-shop',
  path: '/pb2b-shopManage',
  component: () => import('@/views/goods/p2b/shopManage.vue'),
  meta: {
    title: '店铺管理',
    hiddenHeaderContent: true,
  },
});
// 店铺管理
menuMap.set(`pb2b-companyVerify`, {
  name: 'pb2b-companyVerify',
  path: '/pb2b-companyVerify',
  component: () => import('@/views/goods/p2b/CompanyList.vue'),
  meta: {
    title: '企业认证',
    hiddenHeaderContent: true,
  },
});
// 渔获商城类目管理
menuMap.set(`pb2b-category`, {
  name: 'pb2b-category',
  path: '/pb2b-categoryManage',
  component: () => import('@/views/system/pb2b/categoryManage.vue'),
  meta: {
    title: '类目管理',
    hiddenHeaderContent: true,
  },
});
// 渔获商城 电子签章管理
menuMap.set(`pb2b-elecSignManage`, {
  name: 'pb2b-elecSignManage',
  path: '/pb2b-elecSignManage',
  component: () => import('@/views/system/pb2b/elecSignManage.vue'),
  meta: {
    title: '电子签章管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'pb2b-elecSignAdd',
      path: '/pb2b-elecSign-detail/add',
      component: () => import('@/views/system/pb2b/detail.vue'),
      meta: {
        title: '新增电子签章',
        hiddenHeaderContent: true,
        parentPath: '/pb2b-elecSignManage',
        parentTitle: '电子签章管理',
      },
    },
    {
      name: 'pb2b-elecSignEdit',
      path: '/pb2b-elecSign-detail/edit/:id',
      component: () => import('@/views/system/pb2b/detail.vue'),
      meta: {
        title: '编辑电子签章',
        hiddenHeaderContent: true,
        parentPath: '/pb2b-elecSignManage',
        parentTitle: '电子签章管理',
      },
    },
    {
      name: 'pb2b-elecSignView',
      path: '/pb2b-elecSign-detail/view/:id',
      component: () => import('@/views/system/pb2b/detail.vue'),
      meta: {
        title: '查看电子签章',
        hiddenHeaderContent: true,
        parentPath: '/pb2b-elecSignManage',
        parentTitle: '电子签章管理',
      },
    },
  ],
});
// 渔获商城 合同管理
menuMap.set(`pb2b-contractManage`, {
  name: 'pb2b-contractManage',
  path: '/pb2b-contractManage',
  component: () => import('@/views/system/pb2b/contractManage.vue'),
  meta: {
    title: '合同管理',
    hiddenHeaderContent: true,
  },
});
// 渔获商城banner管理
menuMap.set(`pb2b-banner`, {
  name: 'pb2b-banner',
  path: '/pb2b-bannerManage',
  component: () => import('@/views/miniapp/pb2b/bannerManage.vue'),
  meta: {
    title: 'banner管理',
    hiddenHeaderContent: true,
  },
});

// 推荐位
menuMap.set(`pb2b-catereCommenderManage`, {
  name: 'pb2b-category-recommender',
  path: '/pb2b-categoryRecommender',
  component: () => import('@/views/miniapp/pb2b/CategoryManager.vue'),
  meta: {
    title: '类目推荐位管理',
    hiddenHeaderContent: true,
  },
});
menuMap.set(`pb2b-TehuiCommenderManage`, {
  name: 'pb2b-Tehuirecommender',
  path: '/pb2b-TehuiCommenderManage/:type',
  component: () => import('@/views/miniapp/pb2b/catereCommenderManage.vue'),
  meta: {
    title: '特惠推荐位管理',
    hiddenHeaderContent: true,
    params: {
      type: 1,
    },
  },
  props: true,
});
menuMap.set(`pb2b-HourCommenderManage`, {
  name: 'pb2b-Hourecommender',
  path: '/pb2b-HourCommenderManage/:type',
  component: () => import('@/views/miniapp/pb2b/catereCommenderManage.vue'),
  meta: {
    title: '24小时热销推荐位管理',
    hiddenHeaderContent: true,
    params: {
      type: 2,
    },
  },
  props: true,
});
menuMap.set(`pb2b-RenqiCommenderManage`, {
  name: 'pb2b-Renqirecommender',
  path: '/pb2b-RenqiCommenderManage/:type',
  component: () => import('@/views/miniapp/pb2b/catereCommenderManage.vue'),
  meta: {
    title: '人气周榜推荐位管理',
    hiddenHeaderContent: true,
    params: {
      type: 3,
    },
  },
  props: true,
});
menuMap.set(`pb2b-RexiaoCommenderManage`, {
  name: 'pb2b-Rexiaorecommender',
  path: '/pb2b-RexiaoCommenderManage/:type',
  component: () => import('@/views/miniapp/pb2b/catereCommenderManage.vue'),
  meta: {
    title: '热销总榜推荐位管理',
    hiddenHeaderContent: true,
    params: {
      type: 4,
    },
  },
  props: true,
});
menuMap.set(`pb2b-YouxuanCommenderManage`, {
  name: 'pb2b-Youxuanrecommender',
  path: '/pb2b-YouxuanCommenderManage/:type',
  component: () => import('@/views/miniapp/pb2b/catereCommenderManage.vue'),
  meta: {
    title: '优选推荐推荐位管理',
    hiddenHeaderContent: true,
    params: {
      type: 5,
    },
  },
  props: true,
});
menuMap.set(`pb2b-NewCommenderManage`, {
  name: 'pb2b-Newrecommender',
  path: '/pb2b-NewCommenderManage/:type',
  component: () => import('@/views/miniapp/pb2b/catereCommenderManage.vue'),
  meta: {
    title: '新鲜好物推荐位管理',
    hiddenHeaderContent: true,
    params: {
      type: 6,
    },
  },

  props: true,
});
menuMap.set(`pb2b-ShopCommenderManage`, {
  name: 'pb2b-Shoprecommender',
  path: '/pb2b-ShopCommenderManage',
  component: () => import('@/views/miniapp/pb2b/ShopManager.vue'),
  meta: {
    title: '商铺推荐位管理',
    hiddenHeaderContent: true,
  },
});
// 订单渔获商城
menuMap.set(`pb2b-orderManage`, {
  name: 'pb2b-orderManage',
  path: '/pb2b-orderManage',
  component: () => import('@/views/order/pb2b/index.vue'),
  meta: {
    title: '订单管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'pb2b-orderDetail',
      path: '/pb2b-orderDetail/:id',
      component: () => import('@/views/order/pb2b/OrderDeatil.vue'),
      meta: {
        title: '订单详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/pb2b-orderManage',
        parentTitle: '订单管理',
      },
      props: true,
    },
  ],
});

menuMap.set('pb2b-commentManage', {
  name: 'pb2b-commentManage',
  path: '/pb2b-commentManage',
  component: () => import('@/views/order/pb2b/Management.vue'),
  meta: {
    title: '评价管理',
    hiddenHeaderContent: true,
  },
});
/* -------------------------------------------------------------------------------------------------------------------------- */
// 享生活开始
menuMap.set(`xsh-userManage`, {
  name: 'xsh-userManage',
  path: '/xsh-userManage',
  component: () => import('@/views/xsh/user/index.vue'),
  meta: {
    title: '用户管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-userDeatil',
      path: '/xsh-userDeatil/:id',
      component: () => import('@/views/xsh/user/detail.vue'),
      meta: {
        title: '用户详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-userManage',
        parentTitle: '订单管理',
      },
      props: true,
    },
  ],
});
menuMap.set(`xsh-shangjiaType`, {
  name: 'xsh-shangjiaType',
  path: '/xsh-shangjiaType',
  component: () => import('@/views/xsh/shangjia/shangjiaType.vue'),
  meta: {
    title: '商家分类管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-shangjiaTypeDeatiEditor',
      path: '/xsh-shangjiaTypeDetail/:id',
      component: () => import('@/views/xsh/shangjia/shangjiaTypeDetail.vue'),
      meta: {
        title: '编辑商家分类详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-shangjiaType',
        parentTitle: '商家分类管理',
        type: 1,
      },
      props: true,
    },
    {
      name: 'xsh-shangjiaTypeDeatiAdd',
      path: '/xsh-shangjiaTypeDetailAdd',
      component: () => import('@/views/xsh/shangjia/shangjiaTypeDetail.vue'),
      meta: {
        title: '添加商家分类详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-shangjiaType',
        parentTitle: '商家分类管理',
        type: 1,
      },
      props: true,
    },
  ],
});
menuMap.set(`xsh-shangjiaManage`, {
  name: 'xsh-shangjiaManage',
  path: '/xsh-shangjiaManage',
  component: () => import('@/views/xsh/shangjia/shangjiaManage.vue'),
  meta: {
    title: '商家管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-shangjiaManageAdd',
      path: '/xsh-shangjiaManageAdd',
      component: () => import('@/views/xsh/shangjia/shangjiaManageAdd.vue'),
      meta: {
        title: '添加商家资料',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-shangjiaManage',
        parentTitle: '商家管理',
      },
      props: true,
    },
    {
      name: 'xsh-shangjiaManageUpdate',
      path: '/xsh-shangjiaManageDetail/:id',
      component: () => import('@/views/xsh/shangjia/shangjiaManageAdd.vue'),
      meta: {
        title: '修改商家资料',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-shangjiaManage',
        parentTitle: '商家管理',
      },
      props: true,
    },
    {
      name: 'xsh-shangjiaManageView',
      path: '/xsh-shangjiaManageView/:id',
      component: () => import('@/views/xsh/shangjia/shangjiaManageAdd.vue'),
      meta: {
        title: '查看商家资料',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-shangjiaManage',
        parentTitle: '商家管理',
        type: 3,
      },
      props: true,
    },
  ],
});
menuMap.set(`xsh-orderManage`, {
  name: 'xsh-orderManage',
  path: '/xsh-orderManage',
  component: () => import('@/views/xsh/orderManage/orderManage.vue'),
  meta: {
    title: '订单管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-orderDeatil',
      path: '/xsh-orderDeatil/:id',
      component: () => import('@/views/xsh/orderManage/orderDetail.vue'),
      meta: {
        title: '订单详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-orderManage',
        parentTitle: '订单管理',
        type: 1,
      },
    },
  ],
});
menuMap.set(`xsh-returnOrder`, {
  name: 'xsh-returnOrder',
  path: '/xsh-returnOrder',
  component: () => import('@/views/xsh/orderManage/returnOrder.vue'),
  meta: {
    title: '退款订单管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-returnOrderDetail',
      path: '/xsh-returnOrderDetail/:id',
      component: () => import('@/views/xsh/orderManage/orderDetail.vue'),
      meta: {
        title: '退款订单详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-returnOrder',
        parentTitle: '退款订单管理',
        type: 2,
      },
    },
  ],
});
menuMap.set(`xsh-goodsTypeManage`, {
  name: `xsh-goodsTypeManage`,
  path: `/xsh-goodsTypeManage`,
  component: () => import('@/views/xsh/goods/goodsTypeManage.vue'),
  meta: {
    title: '商品分类管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-goodsTypeDeatiEditor',
      path: '/xsh-goodsTypeDeatil/:id',
      component: () => import('@/views/xsh/shangjia/shangjiaTypeDetail.vue'),
      meta: {
        title: '编辑商品分类详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-goodsTypeManage',
        parentTitle: '商品分类管理',
        type: 2,
      },
      props: true,
    },
    {
      name: 'xsh-goodsTypeDeatiAdd',
      path: '/xsh-goodsTypeDeatilAdd',
      component: () => import('@/views/xsh/shangjia/shangjiaTypeDetail.vue'),
      meta: {
        title: '添加商品分类详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-goodsTypeManage',
        parentTitle: '商品分类管理',
        type: 2,
      },
      props: true,
    },
  ],
});
menuMap.set(`xsh-goodsList`, {
  name: `xsh-goodsList`,
  path: `/xsh-goodsList`,
  component: () => import('@/views/xsh/goods/goodsList.vue'),
  meta: {
    title: '商品列表',
    hiddenHeaderContent: true,
  },
});
menuMap.set(`xsh-bannerManage`, {
  name: `xsh-bannerManage`,
  path: `/xsh-bannerManage`,
  component: () => import('@/views/xsh/banner/bannerManage.vue'),
  meta: {
    title: '首页banner管理',
    hiddenHeaderContent: true,
  },
});
menuMap.set(`xsh-getMoney`, {
  name: `xsh-getMoney`,
  path: `/xsh-getMoney`,
  component: () => import('@/views/xsh/getMoney/getMoney.vue'),
  meta: {
    title: '提现申请列表',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-getMoneyDetail',
      path: '/xsh-getMoneyDetail/:id',
      component: () => import('@/views/xsh/getMoney/getMoneyDetail.vue'),
      meta: {
        title: '提现详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-getMoney',
        parentTitle: '提现申请列表',
      },
      props: true,
    },
  ],
});
menuMap.set(`xsh-writeoffOrder`, {
  name: `xsh-writeoffOrder`,
  path: `/xsh-writeoffOrder`,
  component: () => import('@/views/xsh/getMoney/writeoffOrder.vue'),
  meta: {
    title: '核销订单列表',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'xsh-writeOffDetail',
      path: '/xsh-writeOffDetail/:id',
      component: () => import('@/views/xsh/orderManage/orderDetail.vue'),
      meta: {
        type: 3,
        title: '核销订单详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/xsh-writeoffOrder',
        parentTitle: '核销订单列表',
      },
      props: true,
    },
  ],
});
menuMap.set(`xsh-monthBb`, {
  name: `xsh-monthBb`,
  path: `/xsh-monthBb`,
  component: () => import('@/views/xsh/report/monthReport.vue'),
  meta: {
    title: '月账单报表',
    hiddenHeaderContent: true,
  },
});
menuMap.set(`xsh-saleReport`, {
  name: `xsh-saleReport`,
  path: `/xsh-saleReport`,
  component: () => import('@/views/xsh/report/saleReport.vue'),
  meta: {
    title: '销售报表',
    hiddenHeaderContent: true,
  },
});
menuMap.set(`xsh-writeoffReport`, {
  name: `xsh-writeoffReport`,
  path: `/xsh-writeoffReport`,
  component: () => import('@/views/xsh/report/writeoffReport.vue'),
  meta: {
    title: '核销',
    hiddenHeaderContent: true,
  },
});

// 巡检人员管理
menuMap.set('/marketManage/inspection-person', {
  name: 'inspect-person',
  path: '/marketManage/inspection-person',
  component: () => import('@/views/inspection/person.vue'),
  meta: {
    title: '巡检人员管理',
    hiddenHeaderContent: true,
  },
});
// 巡检规则管理
menuMap.set('/marketManage/inspection-rules', {
  name: 'inspect-rules',
  path: '/marketManage/inspection-rules',
  component: () => import('@/views/inspection/rules.vue'),
  meta: {
    title: '巡检规则管理',
    hiddenHeaderContent: true,
  },
});
// 申诉管理
menuMap.set('/marketManage/appeal', {
  name: 'appeal',
  path: '/marketManage/appeal',
  component: () => import('@/views/inspection/appeal.vue'),
  meta: {
    title: '申诉管理',
    hiddenHeaderContent: true,
  },
});
// 门店管理
menuMap.set('/marketManage/store', {
  name: 'store',
  path: '/marketManage/store',
  component: () => import('@/views/inspection/store.vue'),
  meta: {
    title: '门店管理',
    hiddenHeaderContent: true,
  },
});
// 数据统计管理
menuMap.set('/marketManage/data-manage', {
  name: 'data-manage',
  path: '/marketManage/data-manage',
  component: () => import('@/views/inspection/DataManage.vue'),
  meta: {
    title: '数据统计管理',
    hiddenHeaderContent: true,
  },
});

// 运营工作台-集中采购
menuMap.set('/workbench/cp', {
  name: 'workbench-cp',
  path: '/workbench/cp',
  component: () => import('@/views/workbench/cpIndex.vue'),
  meta: {
    title: '集中采购',
    hiddenHeaderContent: true,
  },
});

/**
 * 分销服务内容
 */
// 分销比例配置
menuMap.set('dist-configuration', {
  name: 'configuration',
  path: '/Configuration',
  component: () => import('@/views/goods/Configuration.vue'),
  meta: {
    title: '分销比例配置',
    hiddenHeaderContent: true,
  },
});
// 团长管理
menuMap.set('dist-chieflist', {
  name: 'chieflist',
  path: '/customer/chieflist',
  component: () => import('@/views/customer/ChiefList.vue'),
  meta: {
    title: '团长管理',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'customer-chiefDeatil',
      path: '/customer/chiefDeatil/:id',
      component: () => import('@/views/customer/ChiefDeatil.vue'),
      meta: {
        title: '团长详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/customer/chieflist',
        parentTitle: '团长管理',
      },
      props: true,
    },
  ],
});
// 渔获工具
menuMap.set('tools-grade', {
  name: 'grade',
  path: '/tools/grade',
  component: () => import('@/views/tools/Grade.vue'),
  meta: {
    title: '渔获评级',
    hiddenHeaderContent: true,
  },
});
menuMap.set('tools-deal', {
  name: 'deal',
  path: '/tools/deal',
  component: () => import('@/views/tools/Deal.vue'),
  meta: {
    title: '渔获交易价格',
    hiddenHeaderContent: true,
  },
});
// 财务管理-团长佣金
menuMap.set('dist-ChiefCommission', {
  name: 'chiefCommission',
  path: '/financial/chiefCommissionList',
  component: () => import('@/views/financial/ChiefCommissionList.vue'),
  meta: {
    title: '团长佣金',
    hiddenHeaderContent: true,
  },
});
// 财务管理-佣金审核
menuMap.set('dist-CommissionReview', {
  name: 'commissionReview',
  path: '/financial/commissionReviewList',
  component: () => import('@/views/financial/CommissionReviewList.vue'),
  meta: {
    title: '佣金审核',
    hiddenHeaderContent: true,
  },
  children: [
    {
      name: 'dist-commissionReviewDeatil',
      path: '/financial/commissionReviewList/:id',
      component: () => import('@/views/financial/ChiefCommissionDetail.vue'),
      meta: {
        title: '提现详情',
        hiddenHeaderContent: true,
        hideInMenu: true,
        parentPath: '/financial/commissionReviewList',
        parentTitle: '佣金审核',
      },
      props: true,
    },
  ],
});
menuMap.set('dist-ReportList', {
  name: 'dist-ReportList',
  path: '/distribution/reportList',
  component: () => import('@/views/distribution/ReportList.vue'),
  meta: {
    title: '分销报表',
    hiddenHeaderContent: true,
  },
});
menuMap.set('dist-MonthlyBillList', {
  name: 'dist-MonthlyBillList',
  path: '/distribution/monthlyBillList',
  component: () => import('@/views/distribution/MonthlyBillList.vue'),
  meta: {
    title: '月账单',
    hiddenHeaderContent: true,
  },
});

// 渔船管理
menuMap.set('fisher', {
  name: 'fisher',
  path: '/fisher',
  component: () => import('@/views/fisher/index.vue'),
  meta: {
    title: '渔船管理',
    hiddenHeaderContent: true,
  },
});

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/exception/404.vue'),
};

// 根级菜单
const rootRouter = {
  name: 'rootRouterIndex',
  path: '/',
  component: () => import('@/layouts/BasicLayout.vue'),
  meta: {
    title: '',
    hiddenHeaderContent: true,
  },
  children: [],
};

/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    loginService
      .getCurrentUserNav()
      .then((res) => {
        // res的结果为 map进去的结果
        console.log('generatorDynamicRouter response:', res);
        const menuNav = [];
        const childrenNav = [];
        listMapList(res, childrenNav);
        // 后端直接返回树形菜单
        rootRouter.children = childrenNav;
        // debugger
        console.log(childrenNav, 'childrenNav');
        rootRouter.redirect = childrenNav[0].path;
        menuNav.push(rootRouter);
        menuNav.push(notFoundRouter);
        console.log('menuNav', menuNav);
        resolve(menuNav);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * 数组遍历转换为菜单数组
 * @param {*} list 源数组
 * @param {*} result 结果
 * @param {*} parent 数节点
 */
const listMapList = (list, result, parent) => {
  list.forEach((item) => {
    // isFrame : 是否为外链 0-是 1-否
    // menuId: 菜单id
    // menuName: 菜单名称
    // menuType: M-目录 C-菜单 F-按钮
    // path: 地址
    // perms: 权限字符串
    // status: 菜单状态 0-正常 1-停用
    // visible: 显示状态 0-显示 1-隐藏
    // debugger
    if (item.menuType === 'M' || item.menuType === 'C') {
      const child = {
        name: parent ? `${parent.name}/${item.path}` : `/${item.path}`,
        meta: {
          title: item.menuName,
          menuType: item.menuType,
          hiddenHeaderContent: true,
          hideInMenu: item.visible === 1,
          // params: {
          //   type: '',
          // },
        },
        children: [],
      };
      // 子节点提升list
      let leafList = [];
      if (menuMap.get(item.path)) {
        // 判断是否有菜单
        const localMenu = menuMap.get(item.path);
        child.path = localMenu.path;

        child.component = localMenu.component;
        child.meta.type = localMenu.meta.type;
        // debugger
        if (localMenu.meta.params && localMenu.meta.params.type) {
          child.meta.params = { type: localMenu.meta.params.type };
        }
        // child.meta.params.type = localMenu.meta.params ? localMenu.meta.params.type : '';
        child.props = localMenu.props || false;
        // 是否有详情和其他操作页面，若有则将子页面提升到同一级
        localMenu.children &&
          (leafList = localMenu.children.map((element) => {
            const { meta } = element;
            meta.hiddenHeaderContent = true;
            meta.hideInMenu = true;
            meta.parentPath = child.path;
            meta.parentTitle = child.meta.title;
            return { ...element, meta };
          }));
      } else if (item.menuType === 'M') {
        // console.log(child);
        child.path = `${child.name}`;
        child.component = () => import('@/layouts/BlankLayout.vue');
      } else {
        child.path = `/${child.name}`;
        child.component = () => import('@/views/exception/404.vue');
      }
      if (item.isFrame === 0) {
        child.component = () => import('@/views/iframe/index.vue');
      }

      // 迭代子树
      item.children && listMapList(item.children, child.children, child);
      if (child.children.length <= 0) {
        delete child.children;
      } else {
        child.redirect = child.children[0].path;
      }
      result.push(child, ...leafList);
    }
  });
};
