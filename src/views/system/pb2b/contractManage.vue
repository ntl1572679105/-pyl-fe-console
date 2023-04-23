<template>
  <PageContainer>
    <a-card :border="false">
      <FormSearch
        :formData="formState"
        :formItems="formItems"
        @searchForm="searchForm"
        @clearForm="clearForm"
      >
      </FormSearch>
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'contractCode'">
            <!-- <a @click="viewDetail(record)" v-if="record.contractList.length">{{ record.contractList[0].contractCode }}<span v-if="record.contractList.length !== 1">...</span></a> -->
            <a @click="viewDetail(record)">788092502727983104...</a>
          </template>
        </template>
      </a-table>
    </a-card>
    <ContractListModal ref="contractListModal"></ContractListModal>
  </PageContainer>
</template>

<script setup>
import { FormSearch } from '@/components';
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { contractList } from '@/api/pb2b/contract.js';
import ContractListModal from './components/ContractListModal.vue';

const { proxy } = getCurrentInstance();
const formItems = [
  {
    type: 'text',
    label: '用户ID',
    value: 'userNo',
    width: 8,
  },
  {
    type: 'text',
    label: '用户账号',
    value: 'userName',
    width: 8,
  },
];

const formState = reactive({
  keyword: ''
});

const columns = [
  {
    title: '用户ID',
    dataIndex: 'userNo',
  },
  {
    title: '用户账号',
    dataIndex: 'userName',
  },
  {
    title: '合同编号',
    dataIndex: 'contractCode',
  },
  {
    title: '生成时间',
    dataIndex: 'createTime',
  },
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
});

const clearForm = () => {
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

// 分页
const tableChange = (page) => {
  console.log(page);
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const getList = (formData) => {
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  contractList(requestParameters).then((res) => {
    loading.value = false;
    dataSource.list = res.data;
    pagination.total = res.total;
  })
};
const viewDetail = (record) => {
  proxy.$refs.contractListModal.show(record);
}
</script>

<style lang="scss"></style>
