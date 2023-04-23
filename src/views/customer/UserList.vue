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
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['operator:mpUser:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ text === 0 ? '正常' : '停用' }}</span>
          </template>
          <template v-else-if="column.key === 'image'">
            <a-image :width="40" :src="record.avatar || avatar" />
          </template>
          <template v-else-if="column.key === 'sex'">
            <span>{{ sexText(text) }}</span>
          </template>
        </template>
      </a-table>

      <UserModal ref="userModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { userList, userDetail, userDelete } from '@/api/customer.js';
import UserModal from './components/UserModal.vue';
import avatar from '/src/assets/images/avatar.jpg';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '用户编号',
    dataIndex: 'userNo',
    // customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '用户账号',
    dataIndex: 'userName',
  },
  //   {
  //     title: '用户昵称',
  //     dataIndex: 'nickName',
  //   },
  {
    title: '用户头像',
    dataIndex: 'avatar',
    key: 'image',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  //   {
  //     title: '生日',
  //     dataIndex: 'birthday',
  //   },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '用户状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '仲裁次数',
    dataIndex: 'arbitrationNum',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];

const formItems = [
  {
    type: 'text',
    label: '用户编号',
    value: 'userNo',
    width: 7,
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
  userNo: undefined,
  phone: undefined,
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

const sexText = computed(() => {
  return (value) => {
    // 0-未知 1-女 2-男
    if (value === null) return '未知';
    return ['未知', '女', '男'][value];
  };
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
  userList(requestParameters)
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
        getList(dataSource.params);
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
  getList(dataSource.params);
};
</script>
