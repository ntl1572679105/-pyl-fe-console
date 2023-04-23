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
        <a-button type="primary" @click="handleAdd">添加</a-button>
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
              <a style="color: orangered" @click="handleDelete(record)">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.dataIndex === 'imgUrl'">
            <a-image :width="40" :src="text" />
          </template>
          <template v-else-if="column.key === 'status'">
            <a-space>
              <a-switch
                v-model:checked="record.status"
                :loading="record.loading"
                @change="(checked) => statusChange(record, checked)"
                :checkedValue="0"
                :unCheckedValue="1"
              />
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
import { typeList, delType, updateType } from '@/api/o2o/goods.js';
const { proxy } = getCurrentInstance();
const disabled = ref(true);

const columns = [
  {
    title: '编号',
    dataIndex: 'categoryNo',
    ellipsis: true,
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '分类图片',
    dataIndex: 'imgUrl',
  },
  // {
  //   title: '分类说明',
  //   dataIndex: 'tip',
  // },
  {
    title: '是否显示',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const formItems = [
  {
    type: 'text',
    label: '输入分类名',
    value: 'name',
  },
];
const textStatus = computed(() => {
  return (value) => {
    return ['正常', '停用'][value];
  };
});

const formState = reactive({
  name: '',
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
const handleEdit = (record) => {
  if (record) {
    proxy.$router.push({
      path: `/xsh-goodsTypeDeatil/${record.id}`,
    });
  }
};
const handleAdd = () => {
  proxy.$router.push({
    path: `/xsh-goodsTypeDeatilAdd`,
  });
};
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  console.log('loadData request parameters:', requestParameters);
  typeList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleDelete = (record) => {
  proxy.$confirm({
    title: `确认删除该分类吗?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      delType(record.id)
        .then((res) => {
          proxy.$message.success('删除成功');
          getList(dataSource.params);
        })
        .catch(() => {
          proxy.$message.warning('删除失败，请重试');
        });
    },
  });
};

// 切换显示状态
const statusChange = (record, checked) => {
  record.loading = true;
  updateType({ id: record.id, status: record.status })
    .then(() => {
      proxy.$message.success('操作成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      record.status = checked ? 0 : 1;
      proxy.$message.warning('切换状态失败，请重试');
    })
    .finally(() => {
      record.loading = false;
    });
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const modalOk = () => {
  clearForm();
};
</script>
