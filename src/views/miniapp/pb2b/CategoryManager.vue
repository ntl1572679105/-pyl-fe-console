<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd"> 新建推荐位 </a-button>
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
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" />
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="0"
              :unCheckedValue="1"
              @change="(checked) => changeStatus(checked, record)"
              :loading="record.loading"
            />
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <CategoryModal ref="categoryModal" @finish="modelOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { listByCategory, recommenderUpdate, recommenderDelete } from '@/api/pb2b/miniapp.js';
import CategoryModal from './components/CategoryModal.vue';

const { proxy } = getCurrentInstance();

const columns = [
  {
    title: '类目名称',
    dataIndex: 'categoryName',
    width: '15%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: '15%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '封面图片',
    dataIndex: 'pcMainImgUrl',
    key: 'img',
    width: '10%',
  },
  {
    title: '商品编号',
    dataIndex: 'productNo',
    width: '20%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: '8%',
  },
  // {
  //   title: '虚拟销量',
  //   dataIndex: 'fictiSales',
  //   width: '8%',
  // },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '8%',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '8%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '操作',
    key: 'action',
    width: '10%',
    align: 'center',
  },
];
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
  // console.log(formData, formState);
  loading.value = true;
  const requestParameters = Object.assign(
    {},
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  requestParameters.type = 0;
  // console.log('loadData request parameters:', requestParameters);
  listByCategory(requestParameters)
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
  console.log(page);
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
// 修改状态
const changeStatus = (checked, record) => {
  record.loading = true;
  recommenderUpdate({ ...record, status: checked ? 1 : 0 })
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

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该推荐位?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      recommenderDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
// 新增、修改
const handleAdd = () => {
  proxy.$refs.categoryModal.show({ title: '新增', type: 0 });
};
const handleEdit = (record) => {
  proxy.$refs.categoryModal.show({ title: '编辑', ...record, type: 0 });
};
const modelOk = () => {
  clearForm();
};
</script>
