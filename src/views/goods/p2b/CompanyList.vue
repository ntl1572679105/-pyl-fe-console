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
        :scroll="{ x: 2200 }"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a v-if="record.status === 0" @click="handleEditor(record)">审核</a>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image v-if="text[0]" :width="40" :src="text[0]" />
            <a-image v-if="text[1]" :width="40" :src="text[1]" />
            <a-image v-if="text[2]" :width="40" :src="text[2]" />
          </template>
          <template v-else-if="column.key === 'status'"> {{ statusText(text) }} </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <CompanyModal ref="companyModal" @finish="refresh" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { companyVerifyList } from '@/api/pb2b/goods.js';
import CompanyModal from './components/CompanyModal.vue';

const { proxy } = getCurrentInstance();
const formItems = reactive([
  {
    type: 'text',
    label: '法人姓名',
    value: 'legalName',
  },
  {
    type: 'text',
    label: '法人手机',
    value: 'legalPhone',
  },
  {
    type: 'text',
    label: '法人身份证',
    value: 'legalIdNo',
  },
  {
    type: 'text',
    label: '企业名称',
    value: 'companyName',
    width: 6,
  },
  {
    type: 'text',
    label: '统一信用代码',
    value: 'unifiedCreditCode',
    width: 6,
  },
  {
    type: 'select',
    label: '企业认证状态',
    value: 'status',
    width: 6,
    options: [
      { label: '待审核', value: 0 },
      { label: '审核拒绝', value: 1 },
      { label: '审核通过', value: 2 },
    ],
  },
]);

const columns = [
  {
    title: '认证编号',
    dataIndex: 'verifyNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '统一信用代码',
    dataIndex: 'unifiedCreditCode',
  },
  {
    title: '营业执照附件',
    dataIndex: 'businessLicenseUrls',
    key: 'img',
  },
  {
    title: '法人姓名',
    dataIndex: 'legalName',
  },
  {
    title: '法人手机',
    dataIndex: 'legalPhone',
  },
  {
    title: '法人身份证',
    dataIndex: 'legalIdNo',
  },
  {
    title: '企业认证状态',
    dataIndex: 'status',
    key: 'status',
    width: 140,
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    width: 140,
  },
  {
    title: '审核时间',
    dataIndex: 'auditTime',
    width: 140,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100,
    align: 'center',
  },
];

const statusText = computed(() => {
  return (value) => {
    return ['待审核', '审核拒绝', '审核通过'][value];
  };
});

const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  legalName: '',
  legalPhone: '',
  companyName: '',
  unifiedCreditCode: '',
  status: undefined,
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
  pagination.current = 1;
  dataSource.params = {};
  getList();
};

onMounted(() => {
  searchForm();
});

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  companyVerifyList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const loading = ref(false);
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

// 审核
const handleEditor = (record) => {
  proxy.$refs.companyModal.show(record);
};

const refresh = () => {
  getList(dataSource.params);
};
</script>
<style lang="less" scoped></style>
