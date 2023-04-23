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
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button type="primary" @click="violateAdd"> 新增违规 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :dataSource="dataSource.list"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a @click="handleNotes(record)">备注</a>
          </template>
        </template>
      </a-table>
    </a-card>
    <ViolationManageModal ref="noteModal" @finish="searchForm"></ViolationManageModal>
    <AddViolate ref="addRulesModal" @finish="searchForm"></AddViolate>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import {
  getViolations,
  updateViolations,
  deleteViolation,
  addViolation,
  violationDetail,
} from '@/api/pb2b/violation.js';
import ViolationManageModal from './components/ViolationManageModal.vue';
import AddViolate from './components/AddViolate.vue';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const formItems = reactive([
  {
    type: 'text',
    label: '店铺名称',
    value: 'shopName',
    width: 6,
  },
  {
    type: 'text',
    label: '商品编号',
    value: 'productNo',
    width: 6,
  },
  {
    type: 'rangedatepickerdisabled',
    label: '提交时间',
    value: 'time',
  },
]);
const formState = reactive({
  shopName: '',
  productNo: '',
  time: undefined,
});
const columns = [
  {
    title: '店铺名称',
    dataIndex: 'shopName',
    ellipsis: true,
  },
  {
    title: '商品编号',
    dataIndex: 'productNo',
    ellipsis: true,
  },
  {
    title: '商品分类',
    dataIndex: 'categoryName',
    ellipsis: true,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '违规类型',
    dataIndex: 'violationRuleName',
    ellipsis: true,
  },
  {
    title: '处理结果',
    dataIndex: 'result',
    ellipsis: true,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 100,
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
  if (requestParameters && requestParameters.time) {
    requestParameters.startTime = dayjs(requestParameters.time[0]).format('YYYY-MM-DD');
    requestParameters.endTime = dayjs(requestParameters.time[1]).format('YYYY-MM-DD');
    requestParameters.time = null;
  }
  getViolations(requestParameters)
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
const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  getList();
};

const violateAdd = () => {
  proxy.$refs.addRulesModal.show({ title: '新增违规' });
};
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
const handleNotes = (record) => {
  console.log(record, 'record');
  proxy.$refs.noteModal.show({ id: record.id });
};
const handleDelete = (record) => {
  proxy.$confirm({
    title: `确认删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      deleteViolation({ id: 1 })
        .then((res) => {
          proxy.$message.success('删除成功');
          getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
};
</script>
<style lang="less" scoped></style>
