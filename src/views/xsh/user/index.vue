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
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">查看</a>
              <a @click="handleJie(record, index)" v-if="record.status == 1">解除</a>
              <a @click="handleLa(record, index)" v-if="record.status == 0" style="color: #ff4d4f"
                >拉黑</a
              >
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { roleList, roleDetail, roleDelete } from '@/api/role.js';
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '用户昵称',
    dataIndex: 'userName',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => ['正常', '封禁'][text],
  },
  {
    title: '注册时间',
    dataIndex: 'time',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const formItems = [
  {
    type: 'datepicker',
    label: '注册时间',
    value: 'roleName',
  },
  {
    type: 'datepicker',
    label: '最后登录时间',
    value: 'roleName',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '封禁', value: 1 },
    ],
  },
  {
    type: 'text',
    label: '用户昵称',
    value: 'userName',
  },
];
const textStatus = computed(() => {
  return (value) => {
    return ['正常', '停用'][value];
  };
});

const formState = reactive({
  roleName: '',
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
  //   searchForm();
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
  setTimeout(() => {
    dataSource.list = [
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 0,
        time: '2017.01.01',
      },
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 1,
        time: '2017.01.01',
      },
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 0,
        time: '2017.01.01',
      },
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 1,
        time: '2017.01.01',
      },
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 0,
        time: '2017.01.01',
      },
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 0,
        time: '2017.01.01',
      },
      {
        id: '01123',
        userName: '张三',
        phone: 15015011501,
        status: 0,
        time: '2017.01.01',
      },
    ];
    loading.value = false;
  }, 400);

  // console.log('loadData request parameters:', requestParameters);
  //   roleList(requestParameters)
  //     .then((res) => {
  //       dataSource.list = res.data;
  //       pagination.total = res.total;
  //     })
  //     .finally(() => {
  //       loading.value = false;
  //     });
};
// 0 正常 1 封禁
const handleJie = (record, index) => {
  proxy.$confirm({
    title: `确认解除该用户?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      record.status = 0;
    },
  });
};
const handleLa = (record, index) => {
  proxy.$confirm({
    title: `确认拉黑该用户?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      record.status = 1;
    },
  });
};
/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  //   getList(dataSource.params);
};

const modalOk = () => {
  clearForm();
};
</script>
