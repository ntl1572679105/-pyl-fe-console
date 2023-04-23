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
        row-key="roleId"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1300 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a @click="handleReview(record, 1)" v-if="record.status == 0" >通过</a>
              <a @click="handleReview(record, 2)"  v-if="record.status == 0"  style="color: orangered">拒绝</a>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'updateTime'">
            <span v-if="record.status != 2">{{ text }}</span>
            <span v-else>-</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { commissionList, comissionAudit } from '@/api/o2o/commision.js';
import dayjs from 'dayjs';
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '提现编号',
    dataIndex: 'withdrawNo',
    width: 200,
    ellipsis: true,
  },
  {
    title: '提现时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '商家名称',
    dataIndex: 'shopName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '提现金额',
    dataIndex: 'amount',
    customRender: ({ text }) => (text ? '￥' + text : '-'),
    width: 180,
  },
  {
    title: '账户名称',
    dataIndex: 'bankUser',
    width: 180,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => ['待审核', '通过', '拒绝'][text],
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
];

const formItems = [
  {
    type: 'text',
    label: '商家名称',
    value: 'name',
  },
  {
    type: 'rangedatepicker',
    label: '提现时间',
    value: 'time',
  },
];

const formState = reactive({
  name: '',
  time: undefined,
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
  searchForm({});
};
const handleEdit = (record) => {
  proxy.$router.push({
    path: `/xsh-userDeatil/${record.id}`,
  });
};
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (formData && formData.time) {
    requestParameters.beginTime = dayjs(formData.time[0]).format('YYYY-MM-DD');
    requestParameters.endTime = dayjs(formData.time[1]).format('YYYY-MM-DD');
    requestParameters.time = undefined;
  }
  console.log('loadData request parameters:', requestParameters);
  commissionList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleView = (record) => {
  proxy.$router.push({ path: `/xsh-getMoneyDetail/${record.id}` });
};
const handleReview = (record, statusText) => {
  const reviewTitle = statusText == 1 ? '通过' : '拒绝';
  proxy.$confirm({
    title: `确认${reviewTitle}该提现申请吗?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      comissionAudit({ id: record.id, status: statusText }).then(() => {
        proxy.$message.success(`提现已${reviewTitle}`)
      }).finally(() => {
        searchForm();
      });
    },
  });
};
/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const modalOk = () => {
  getList(dataSource.params);
};
</script>
