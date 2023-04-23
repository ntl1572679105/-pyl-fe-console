<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
        :moreSpan="-8"
      >
        <template #prefix>
          <a-col :span="8">
            <a-form-item name="shopType" label="商品模块">
              <a-select
                v-model:value="formState.shopType"
                :default-value="{ value: '3', label: '供应链金融' }"
                placeholder="请选择"
                :options="[
                  { value: '3', label: '供应链金融' },
                  { value: '4', label: '顶级渔获' },
                ]"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </template>
        <template #more>
          <a-col :span="8">
            <a-form-item name="shopId" label="商铺名称">
              <a-select
                v-model:value="formState.shopId"
                placeholder="请选择"
                allowClear
                show-search
                :filter-option="false"
                :not-found-content="shopState.fetching ? undefined : null"
                :options="shopState.data"
                @search="fetchShop"
              >
                <template v-if="shopState.fetching" #notFoundContent>
                  <a-spin size="small" />
                </template>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
      </FormSearch>
      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1700 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleDetail(record)">详情</a>
            </a-space>
          </template>
          <!-- 订单状态 -->
          <template v-if="column.key === 'status'">
            {{ textOrderStatus(text) }}
          </template>
          <template v-if="column.key === 'payType'">
            {{ payTypeText(text) }}
          </template>
          <template v-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
  <!-- 对话框 数据导出-->
</template>

<script setup>
import { orderList } from '@/api/pb2b/order.js';
import { shopList } from '@/api/pb2b/goods.js';
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';

// orderOuput
const { proxy } = getCurrentInstance();
const shopTypeFlag = ref(true);
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    key: 'tooltip',
    width: 200,
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '手机号',
    dataIndex: 'userPhone',
    ellipsis: true,
    width: 140,
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
    width: 140,
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    width: 140,
  },
  {
    title: '店铺',
    dataIndex: 'shopName',
    ellipsis: true,
    key: 'tooltip',
    width: 200,
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    key: 'payType',
    width: 100,
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    width: 200,
  },
  {
    title: '物流单号',
    dataIndex: 'deliveryNo',
    ellipsis: true,
    key: 'tooltip',
    width: 200,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100,
    align: 'center',
  },
];
const formItems = [
  // {
  //   type: 'select',
  //   label: '商品模块',
  //   value: 'shopType',
  //   width: 6,
  //   options:  [{ value: '3', label: '供应链金融'}, { value: '4', label: '顶级渔获'}]
  // },
  {
    type: 'text',
    label: '订单编号',
    value: 'orderNo',
    width: 8,
  },
  {
    type: 'text',
    label: '手机号',
    value: 'userPhone',
    width: 8,
  },
  {
    type: 'text',
    label: '用户名称',
    value: 'userName',
    width: 8,
  },

  {
    type: 'select',
    label: '订单状态',
    value: 'status',
    width: 8,
    // 订单状态 0- 1-已支付/待发货 2-已发货/待收货 3-待评价 4-已完成 5-已取消
    options: [
      {
        value: 0,
        label: '待支付',
      },
      {
        value: 1,
        label: '已支付/待发货',
      },
      {
        value: 2,
        label: '已发货/待收货',
      },
      {
        value: 3,
        label: '待评价',
      },
      {
        value: 4,
        label: '已完成',
      },
      {
        value: 5,
        label: '已取消',
      },
    ],
  },
  {
    type: 'datepicker',
    label: '支付时间',
    value: 'payTime',
    width: 8,
  },
  {
    type: 'text',
    label: '物流单号',
    value: 'deliveryNo',
    width: 8,
  },
];
const dataSource = reactive({
  list: [],
  params: {},
  shopList: [],
});
const formState = reactive({
  shopType: undefined,
  orderNo: undefined,
  status: undefined,
  payTime: undefined,
  userPhone: undefined,
  userName: undefined,
  shopId: undefined,
  deliveryNo: undefined,
});

const textOrderStatus = computed(() => {
  //  订单状态 0-待支付 1-已支付/待发货 2-已发货/待收货 3-待评价 4-已完成 5-已取消
  return (value) => {
    return ['待支付', '已支付/待发货', '已发货/待收货', '待评价', '已完成', '已取消'][value];
  };
});

const payTypeText = computed(() => {
  // 1-微信支付 2-白条支付
  return (value) => {
    if (!value) return '-';
    return ['-', '微信支付', '白条支付'][value];
  };
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const clearForm = () => {
  formState.shopId = undefined;
  formState.shopType = '';
  shopTypeFlag.value = false;
  pagination.current = 1;
  dataSource.params = {};
  getList();
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};
const loading = ref([]);
// 挂载
onMounted(() => {
  getList();
});
// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (requestParameters.payTime) {
    requestParameters.payTime = dayjs(formData.payTime).format('YYYY-MM-DD');
  }
  if (formState.shopId) {
    requestParameters.shopId = formState.shopId;
  }
  if (formState.shopType) {
    requestParameters.shopType = formState.shopType;
  } else if (shopTypeFlag.value) {
    requestParameters.shopType = 3;
  } else {
    requestParameters.shopType = undefined;
  }

  orderList(requestParameters)
    .then((res) => {
      console.log(res, 'res');
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 分页 逻辑操作
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

let lastFetchId = 0;
const shopState = reactive({
  data: [],
  fetching: false,
});

const fetchShop = debounce((value) => {
  console.log('fetching product: ', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  shopState.data = [];
  shopState.fetching = true;
  shopList({ name: value, pageNum: 1, pageSize: 20 }).then((res) => {
    if (fetchId !== lastFetchId) return;
    shopState.data = res.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    shopState.fetching = false;
  });
}, 300);

// 弹窗
const handleDetail = (record) => {
  proxy.$router.push({ path: `/pb2b-orderDetail/${record.id}` });
};
</script>
<style lang="less" scoped></style>
