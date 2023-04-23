<template>
  <PageContainer>
    <a-card :border="false">
      <FormSearch
        :formData="formState"
        :formItems="formItems"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <!-- <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <space>
              <a @click="detail(record)">详情</a>
            </space>
          </template>
        </template> -->
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { FormSearch } from '@/components';
import { ref, reactive, onMounted } from 'vue';

const formItems = [
  {
    type: 'select',
    label: '日期分类',
    value: 'timeType',
    options: [
        { label: '按月统计', value: 1 },
        { label: '按周统计', value: 2 },
        { label: '按年统计', value: 3 },
      ],
  },
  {
    type: 'rangedatepicker',
    label: '日期区间',
    value: 'time',
  },
  {
    type: 'text',
    label: '巡检人员',
    value: 'person',
  },
  {
    type: 'text',
    label: '扣分',
    value: 'deduction',
  },
  {
    type: 'select',
    label: '门店',
    value: 'shopName',
  }
];

const formState = reactive({
  timeType: '',
  time: '',
  person: '',
  deduction: '',
  shopName: '',
});

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '巡检情况',
    dataIndex: 'situation',
  },
  {
    title: '门店',
    dataIndex: 'shopName',
  },
  {
    title: '分值',
    dataIndex: 'score',
  },
  {
    title: '选件时间',
    dataIndex: 'time',
  },
  // {
  //   title: '操作',
  //   key: 'action',
  // },
];

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

const loading = ref([]);

onMounted(() => {
  searchForm();
  getList();
});

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  // getList();
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  // getList(formData);
};

const getList = () => {
  setTimeout(() => {
    loading.value = false;
    dataSource.list = [
      {
        id: '001',
        situation: '以次充好、掺杂使假、短斤缺两',
        shopName: '老李海鲜',
        score: '98',
        person: '赵立春',
        time: '2022-05-07 15:06:56'
      },
      {
        id: '002',
        situation: '恶意串通，捏造虚假供求和价格',
        shopName: '老李海鲜',
        score: '98',
        person: '赵立春',
        time: '2022-05-07 15:06:56'
      },
      {
        id: '003',
        situation: '交易水产品未严格按品种、规格分类',
        shopName: '老李海鲜',
        score: '98',
        person: '赵立春',
        time: '2022-05-07 15:06:56'
      },
    ]
  }, 1000);
}
</script>

<style lang="scss"></style>
