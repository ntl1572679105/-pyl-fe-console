<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>

      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1410 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'status'">
            <span>{{ statusText(text) }}</span>
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template v-else-if="column.dataIndex === 'userName'">
            <a-tooltip>
              {{ record.mpUser.userName }}
            </a-tooltip>
          </template>
          <template v-else-if="column.dataIndex === 'phone'">
            <a-tooltip>
              {{ record.mpUser.phone }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { getRegimentList } from '@/api/regiment.js';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '编号',
    customRender: ({ index }) => `${index + 1}`,
    width: 100,
  },
  {
    title: '分享订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '团长名称',
    dataIndex: 'userName',
    ellipsis: true,
    // key: 'tooltip',
  },
  {
    title: '团长手机号',
    dataIndex: 'phone',
  },
  {
    title: '订单生成时间',
    dataIndex: 'createTime',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    key: 'status',
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
  },
  {
    title: '团长佣金',
    dataIndex: 'commission',
  },
];

const formItems = [
  {
    type: 'text',
    label: '团长名称',
    value: 'userName',
    // width: 6,
  },
  {
    type: 'text',
    label: '团长手机号码',
    value: 'phone',
    // width: 6,
  },
  {
    type: 'text',
    label: '分享订单编号',
    value: 'orderNo',
    // width: 4,
  },
  {
    type: 'select',
    label: '平台',
    value: 'shopType',
    // width: 4,
    defaultValue: {
      value: 1,
      label: '集采商城',
    },
    options: [
      {
        value: 1,
        label: '集采商城',
      },
      {
        value: 2,
        label: '个采商城',
      },
      {
        value: 3,
        label: 'b2b商城',
      },
      // {
      //   value: 4,
      //   label: '顶级渔获',
      // },
      // {
      //   value: 5,
      //   label: '享生活(o2o)',
      // },
    ],
  },
  {
    type: 'select',
    label: '订单状态',
    value: 'status',
    options: [
      { value: 0, label: '待支付' },
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
];

const formState = reactive({
  username: '',
  phone: '',
  orderNo: '',
  status: undefined,
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const statusText = computed(() => {
  return (value) => {
    // 0-待解决 1-已完成 2-已关闭
    if (value === null) return '';
    return ['待支付', '已支付/待发货', '已发货/待收货', '待评价', '已完成', '已取消'][value];
  };
});

onMounted(() => {
  searchForm();
});

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  searchForm();
};

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (formData && formData.shopType) {
    console.log(1);
  } else {
    requestParameters.shopType = 1;
  }
  // console.log('loadData request parameters:', requestParameters);
  getRegimentList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
</script>
