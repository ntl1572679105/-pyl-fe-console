<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>

      <!-- <div class="table-operator" v-permission="['supplier:order:add']"> -->
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button
          type="primary"
          @click="handleAdd"
          style="margin-right: 10px"
          v-permission="proxy.$route.meta.type == 1 ? ['operator:jcPreWarehouse:add'] : []"
          >新增前置仓
        </a-button>
      </div>

      <!-- </div> -->

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
            <a-switch
              v-model:checked="record.status"
              :loading="record.loading"
              @change="(checked) => changeStatus(record, checked)"
              :checkedValue="0"
              :unCheckedValue="1"
            />
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image v-if="text" :width="40" :src="text" />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <!-- 自定义指令 -->
              <a
                @click="handleEditor(record)"
                style="margin-right: 10px"
                v-permission="proxy.$route.meta.type == 1 ? ['operator:jcPreWarehouse:edit'] : []"
                >编辑</a
              >
              <a
                @click="handleDelete(record)"
                style="color: orangered"
                v-permission="proxy.$route.meta.type == 1 ? ['operator:jcPreWarehouse:remove'] : []"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <AddfrontModal ref="addfrontModal" @finish="clearForm"></AddfrontModal>
    </a-card>
  </PageContainer>
</template>

<script setup>
import AddfrontModal from './components/AddfrontModal.vue';
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { preWarehouseList, preWarehouseEdit, preWarehouseDelete } from '@/api/goods.js';
import { FormSearch } from '@/components';

const { proxy } = getCurrentInstance();
const formItems = [
  {
    type: 'text',
    label: '前置仓名称',
    value: 'name',
    width: 6,
  },
  {
    type: 'text',
    label: '仓库类型',
    value: 'type',
    width: 6,
  },
];
const columns = [
  {
    title: '仓库名称',
    dataIndex: 'name',
    width: '20%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '仓库类型',
    dataIndex: 'type',
    width: '10%',
  },
  {
    title: '前置仓logo',
    dataIndex: 'logo',
    key: 'img',
    width: 120,
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    width: '20%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '仓库管理员',
    dataIndex: 'manager',
    width: '15%',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: '15%',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
  },
  {
    title: '操作',
    key: 'action',
    // fixed: 'right',
    // width: '10%',
    width: 120,
    align: 'center',
  },
];

onMounted(() => {
  searchForm();
});

const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  name: '',
  type: '',
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
const loading = ref(false);
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  preWarehouseList(apiType.value, requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const handleDelete = (record) => {
  proxy.$confirm({
    title: `操作确认?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      preWarehouseDelete(apiType.value, record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};

const changeStatus = (record, checked) => {
  record.loading = true;
  preWarehouseEdit(apiType.value, { id: record.id, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
    .finally(() => {
      record.loading = false;
    });
};

const handleAdd = () => {
  proxy.$refs.addfrontModal.show({ title: '添加' });
};
const handleEditor = (res) => {
  proxy.$refs.addfrontModal.show({ ...res, title: '编辑' });
};
</script>
<style lang="less" scoped></style>
