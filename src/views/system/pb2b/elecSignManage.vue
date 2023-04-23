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
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button type="primary" @click="handleAdd()"> 新建 </a-button>
      </div>
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
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="!record.status" @click="handleStop(record, 1)">停用</a>
              <a v-else @click="handleStart(record)" v-show="record.status !== 2">启用</a>
              <a v-if="record.status" @click="handleEdit(record)">编辑</a>
              <a v-if="record.status" @click="handleDel(record)" style="color: orangered">删除</a>
              <a v-if="record.status === 1" @click="handleStop(record, 2)" style="color: orange"
                >挂失</a
              >
              <a @click="handleView(record)">查看</a>
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            <span>{{ signStatus(record.status) }}</span>
          </template>
          <template v-if="column.dataIndex === 'updateBy'">
            {{ text || '-' }}
          </template>
          <template v-if="column.dataIndex === 'updateTime'">
            {{ text || '-' }}
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { FormSearch } from '@/components';
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue';
import { signList, signDelete, signStatusChange } from '@/api/pb2b/signature.js';

const { proxy } = getCurrentInstance();
const formItems = [
  {
    type: 'text',
    label: '印章名称',
    value: 'imageName',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { value: 0, label: '启用' },
      { value: 1, label: '停用' },
      { value: 2, label: '挂失' },
    ],
    width: 6,
  },
];

const formState = reactive({
  imageName: '',
  info: '',
  status: undefined,
  updateBy: '',
  updateTime: '',
});

const signStatus = computed(() => {
  // 状态 0-启用 1-停用 2-挂失
  return (value) => {
    return ['启用', '停用', '挂失'][value];
  };
});
const columns = [
  {
    title: '印章名称',
    dataIndex: 'imageName',
    width: 120,
    ellipsis: true,
  },
  {
    title: '简介',
    dataIndex: 'info',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '操作人',
    dataIndex: 'updateBy',
    width: 140,
  },
  {
    title: '操作时间',
    dataIndex: 'updateTime',
    width: 190,
  },
  {
    title: '操作',
    key: 'action',
    width: 250,
    align: 'center',
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
  getList();
});

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  getList();
};

const handleEdit = (record) => {
  proxy.$router.push({ path: `/pb2b-elecSign-detail/edit/${record.id}`, query: { type: 'edit' } });
};
const handleView = (record) => {
  proxy.$router.push({ path: `/pb2b-elecSign-detail/view/${record.id}`, query: { type: 'view' } });
};
const handleAdd = () => {
  proxy.$router.push({ path: '/pb2b-elecSign-detail/add', query: { type: 'add' } });
};
const handleDel = (record) => {
  proxy.$confirm({
    title: '操作确认',
    content: '确认删除此项？',
    onOk: () => {
      signDelete(record.id).then((res) => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
const handleStop = (record, num) => {
  const statusNum = num;
  const str = statusNum === 1 ? '停用' : '挂失';
  proxy.$confirm({
    title: '操作确认',
    content: `确认是否${str}？`,
    onOk: () => {
      console.log(record.id);
      signStatusChange({ id: record.id, status: statusNum }).then(() => {
        proxy.$message.success(`${str}成功`);
        clearForm();
      });
    },
  });
};

const handleStart = (record) => {
  proxy.$confirm({
    title: '操作确认',
    content: '系统仅支持一个印章处于启用状态，如果有其他印章状态为启用，该操作会把其他印章状态改为停用。 确认启用该印章吗？',
    onOk: () => {
      console.log(record.id);
      signStatusChange({ id: record.id, status: 0 }).then(() => {
        proxy.$message.success('启用成功');
        clearForm();
      });
    },
  });
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const getList = (formData) => {
  const requestParameters = Object.assign({
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    ...formData,
  });
  signList(requestParameters).then((res) => {
    loading.value = false;
    dataSource.list = res.data;
    pagination.total = res.total;
  });
};
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
</script>

<style lang="scss"></style>
