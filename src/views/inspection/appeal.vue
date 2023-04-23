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
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :dataSource="dataSource.list"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a @click="detail(record)">查看详情</a>
          </template>
          <template v-if="column.key === 'status'">
            {{inpectionStatus(text)}}
          </template>
        </template>
      </a-table>
      <AppealDetail ref="appealDetail"></AppealDetail>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import AppealDetail from './components/AppealDetail.vue';

const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'select',
    label: '申诉状态',
    value: 'status',
    options: [
      { label: '待审核', value: '0' },
      { label: '审核中', value: '1' },
      { label: '审核通过', value: '2' },
      { label: '已驳回', value: '3' },
    ]
  },
];
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    // ellipsis: true,
    width: '150'
  },
  {
    title: '巡检时间',
    dataIndex: 'time',
  },
  {
    title: '巡检人员',
    dataIndex: 'person',
  },
  {
    title: '发起店铺',
    dataIndex: 'shopName',
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
  },
  {
    title: '申诉状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];
const formState = reactive({
  status: '',
});
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

const getList = (formData) => {
  loading.value = true;
  // const requestParameters = Object.assign(
  //   {
  //     pageNum: pagination.current,
  //     pageSize: pagination.pageSize,
  //   },
  //   formData,
  // );
  // List(requestParameters)
  //   .then((res) => {
  //     dataSource.list = res;
  //     pagination.total = res.length;
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
  const res = [
    {
      id: '001',
      time: '2022-11-08 15:03:53',
      person: '赵立春',
      shopName: '王记渔获',
      createTime: '2022-11-08 15:03:53',
      status: 1,
    },
    {
      id: '002',
      time: '2022-11-08 16:03:53',
      person: '侯亮平',
      shopName: '老李海鲜',
      createTime: '2022-11-08 16:03:53',
      status: 1,
    },
    {
      id: '003',
      time: '2022-11-08 15:03:53',
      person: '赵立春',
      shopName: '王记渔获',
      createTime: '2022-11-10 10:03:53',
      status: 1,
    },
    {
      id: '004',
      time: '2022-11-08 16:03:53',
      person: '侯亮平',
      shopName: '老李海鲜',
      createTime: '2022-11-11 09:03:53',
      status: 1,
    },
  ];

  setTimeout(() => {
    loading.value = false;
    dataSource.list = res;
  }, 1000);
};
const loading = ref(false);
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};
const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  getList();
};
const inpectionStatus = computed(() => {
  // 巡检人员状态 0-待审核 1-审核中 2-审核通过 3-已驳回
  return (value) => {
    return ['待审核', '审核中', '审核通过', '已驳回'][value];
  };
});
const detail = (item) => {
  proxy.$refs.appealDetail.show({title: '申诉详情', ...item});
}
</script>

<style lang="scss"></style>
