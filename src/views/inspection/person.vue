<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button type="primary" @click="addPerson" style="margin-right: 10px"
          >添加巡检人员
        </a-button>
      </div>
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
          <template v-if="column.key === 'status'">
            <!-- <a-switch
              v-model:checked="record.status"
              :loading="record.loading"
              @change="(checked) => changeStatus(record, checked)"
              :checkedValue="0"
              :unCheckedValue="1"
            /> -->
            {{ inpectionStatus(text) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.status" @click="handleStop(record)" style="color: orangered">停用</a>
              <a v-if="!record.status" @click="handleStart(record)">启用</a>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'id'">
            <span v-if="index<9">0{{ pagination.current - 1}}{{ index + 1 }}</span>
            <span v-else>0{{ index + 1 }}</span>
          </template>
        </template>
      </a-table>
      <AddPersonModal ref="addPersonModal" @finish="modalAdd" :data="data" ></AddPersonModal>
    </a-card>
  </PageContainer>
  <!-- 对话框 数据导出-->
</template>

<script setup>
import AddPersonModal from './components/AddPersonModal.vue';
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';

const { proxy } = getCurrentInstance();
const formItems = [
  {
    type: 'text',
    label: '巡检人员ID',
    value: 'id',
  },
  {
    type: 'text',
    label: '巡检人员名称',
    value: 'name',
  },
  {
    type: 'select',
    label: '巡检人员状态',
    value: 'status',
    options: [
      { value: 0, label: '使用中' },
      { value: 1, label: '停用' },
    ],
  },
  {
    type: 'text',
    label: '巡检人员手机号',
    value: 'phone',
  },
];

const columns = [
  {
    title: '巡检人员ID',
    dataIndex: 'id',
    ellipsis: true,
  },
  {
    title: '巡检人员名称',
    dataIndex: 'name',
  },
  {
    title: '巡检人员手机号',
    dataIndex: 'phone',
  },
  {
    title: '巡检人员状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];
onMounted(() => {
  // searchForm();
  getList();
});
// 添加巡检人员
const addPerson = () => {
  proxy.$refs.addPersonModal.show();
};
const dataSource = reactive({
  list: [],
  params: {},
});

const formState = reactive({
  id: '',
  name: '',
  status: '',
  phone: '',
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const loading = ref(false);

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  // supplierList(apiType.value, requestParameters)
  // .then((res) => {
  // dataSource.list = res.data;
  // pagination.total = res.total;
  // })
  // .finally(() => {
  setTimeout(() => {
    dataSource.list = [
      {
        id: '001',
        name: '赵立春',
        phone: '514646454646',
        status: 1,
      },
      {
        id: '002',
        name: '李达康',
        phone: '15489237654',
        status: 1,
      },
      {
        id: '003',
        name: '侯亮平',
        phone: '15898876154',
        status: 1,
      },
      {
        id: '004',
        name: '沙瑞金',
        phone: '134896147451',
        status: 1,
      },
    ];
    loading.value = false;
  }, 1000);

  // });
};
// // 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  // getList();
};

// // 表单搜索回调
// const searchForm = (formData) => {
//   pagination.current = 1;
//   dataSource.params = formData;
//   getList(formData);
// };

// const clearForm = () => {
//   pagination.current = 1;
//   dataSource.params = {};
//   getList({});
// };
// const apiType = ref('');
// apiType.value = proxy.$route.meta.type;
const handleStop = (record) => {
  proxy.$confirm({
    title: `确认停用该人员?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      // supplierDelete(apiType.value, { id: record.id }).then(() => {
      //   proxy.$message.success('删除成功');
      //   clearForm();
      // });
      record.status = 0;
      console.log(record);
      proxy.$message.success('停用成功');
    },
  });
};
const handleStart = (record) => {
  proxy.$confirm({
    title: `确认启用该人员?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      record.status = 1;
      console.log(record);
      proxy.$message.success('启用成功');
    },
  });
};
const inpectionStatus = computed(() => {
  // 巡检人员状态 0-停用 1-使用中
  return (value) => {
    return ['停用', '使用中'][value];
  };
});
const modalAdd = (data) => {
  dataSource.list.push({
    name: data.name,
    phone: data.phone,
    status: 1,
  });
};
</script>
<style lang="less" scoped></style>
