<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      >
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
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'rank'">
            {{ index < 9 ? `${pagination.current - 1}${index + 1}` : index + 1 }}
          </template>
          <template v-if="column.key === 'amount'">
            {{ text || 0 }}
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import dayjs from 'dayjs';
import { VipList } from '@/api/vip';
import { GetVipList } from '@/api/pb2b/vip';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '排名',
    dataIndex: 'rank',
    // key: 'orderNo',
  },
  {
    title: '会员账号',
    dataIndex: 'userName',
  },
  {
    title: '订单总量',
    dataIndex: 'orderNumber',
    key: 'amount',
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    key: 'amount',
  },
];

const formItems = [
  {
    type: 'rangedatepickerdisabled',
    label: '时间范围',
    value: 'time',
  },
  {
    type: 'select',
    label: '排序规则',
    value: 'orderByColumn',
    options: [
      {
        value: 'order_number',
        label: '订单总量',
      },
      {
        value: 'order_amount',
        label: '订单金额',
      },
    ],
  },
];
const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  orderNo: undefined,
  status: undefined,
  payTime: undefined,
  userPhone: undefined,
  userName: undefined,
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const clearForm = () => {
  dataSource.params = {};
  getList();
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  if (formData) {
    if (formData.time) {
      dataSource.params.startTime = dayjs(formData.time[0]).format('YYYY-MM-DD');
      dataSource.params.endTime = dayjs(formData.time[1]).format('YYYY-MM-DD');
    }
  }
  getList(dataSource.params);
};
// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
    { time: undefined },
  );
  console.log('request parameters:', requestParameters);
  const api = proxy.$route.meta.type === 1 ? VipList : GetVipList;
  api(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const loading = ref([]);
// 挂载
onMounted(() => {
  getList();
});
</script>

<style lang="scss"></style>
