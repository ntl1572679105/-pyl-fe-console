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
        row-key="userId"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleDetail(record)" v-permission="['operator:mpUser:detail']">详情</a>
              <a @click="handleEdit(record)" v-permission="['operator:mpUser:edit']">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f" v-permission="['operator:mpUser:remove']">删除</a>
            </a-space>
          </template>

          <template v-else-if="column.key === 'name'">
            <div>{{text.split('（')[0]}}</div>
          </template>

        </template>
      </a-table>

    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { userList, userDetail, userDelete } from '@/api/customer.js';
import {getDealList} from "@/api/pb2b/deal";
import avatar from '/src/assets/images/avatar.jpg';
import dayjs from "dayjs";
const { proxy } = getCurrentInstance();
const columns = [
  // {
  //   title: '用户编号',
  //   dataIndex: 'userNo',
  //   // customRender: ({ index }) => `${index + 1}`,
  // },
  {
    title: '渔获种类',
    dataIndex: 'name',
    key:'name'
  },
  {
    title: '价格时间',
    dataIndex: 'monthTime',
    key: 'monthTime',
  },
  {
    title: '价格（元/500g）',
    dataIndex: 'price',
  },
  //   {
  //     title: '生日',
  //     dataIndex: 'birthday',
  //   },
  // {
  //   title: '性别',
  //   dataIndex: 'sex',
  //   key: 'sex',
  // },
  // {
  //   title: '用户状态',
  //   dataIndex: 'status',
  //   key: 'status',
  // },
  // {
  //   title: '操作',
  //   key: 'action',
  //   align: 'center',
  // },
];

const formItems = [
  {
    type: 'select',
    label: '渔获种类',
    width: 6,
    value: 'name',
    options: [
      { label: '大黄鱼', value: '大黄鱼' },
      { label: '小黄鱼', value: '小黄鱼' },
      { label: '三疣梭子蟹', value: '三疣梭子蟹' },
      { label: '舟山带鱼', value: '舟山带鱼' },
      { label: '鲳鱼', value: '鲳鱼' },
    ],
  },
  {
    type: 'rangedatepickerdisabled',
    label: '时间段',
    value: 'time',
  },
  {
    type: 'select',
    label: '排序方式',
    width: 6,
    value: 'orderByColumn',
    options: [
      { label: '按时间', value: 'month_time' },
      { label: '按价格', value: 'price' },
    ],
  },
];

const formState = reactive({
  name:undefined,
  orderByColumn: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
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
  console.log(' request parameters:', requestParameters);
  if (requestParameters && requestParameters.time) {
    requestParameters.startTime = dayjs(requestParameters.time[0]).format('YYYY-MM-DD'),
      requestParameters.endTime = dayjs(requestParameters.time[1]).format('YYYY-MM-DD')
    requestParameters.time = null
  }
  getDealList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleDetail = (record) => {
  proxy.$router.push({
    path: `/customer/userlistDeatil/${record.id}`,
  });
};
/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该用户?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      userDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};

const handleEdit = (record) => {
  userDetail(record.id).then((res) => {
    proxy.$refs.userModal.show(res);
  });
};
const modalOk = () => {
  clearForm();
};
</script>
