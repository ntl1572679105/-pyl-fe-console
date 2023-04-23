<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>

      <div class="table-operator">
        <a-button type="primary" @click="handleAdd" v-permission="['operator:admin:add']">
          添加管理员
        </a-button>
      </div>

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
              <a @click="handleEdit(record)" v-permission="['operator:admin:edit']">编辑</a>
              <a @click="resetPwd(record)" v-permission="['operator:admin:resetPwd']">重置密码</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['operator:admin:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ text === 0 ? '正常' : '停用' }}</span>
          </template>
        </template>
      </a-table>

      <UserModal ref="userModal" @finish="modalOk" />
      <ResetModal ref="resetModal" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { userList, userDelete, userDetail } from '@/api/user.js';
import UserModal from './components/UserModal.vue';
import ResetModal from './components/ResetModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '用户编号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  },
];

const formItems = [
  {
    type: 'text',
    label: '用户名',
    value: 'userName',
    width: 5,
  },
  {
    type: 'text',
    label: '手机号',
    value: 'phone',
    width: 5,
  },
  {
    type: 'select',
    label: '状态',
    width: 6,
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
];

const formState = reactive({
  userName: '',
  phone: '',
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
  // console.log('loadData request parameters:', requestParameters);
  userList(requestParameters)
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

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该用户?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      userDelete(record.userId).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
const resetPwd = (record) => {
  proxy.$refs.resetModal.show(record);
};
// 新增、修改
const handleAdd = () => {
  proxy.$refs.userModal.show({ title: '新增' });
};
const handleEdit = (record) => {
  userDetail(record.userId).then((res) => {
    // console.log(res,'res')
    proxy.$refs.userModal.show({
      title: '编辑',
      ...res,
      roleIdList: res.roles.map((item) => item.roleId),
    });
  });
};
const modalOk = () => {
  clearForm();
};
</script>
