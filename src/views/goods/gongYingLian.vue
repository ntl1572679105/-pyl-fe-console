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
        <a-button
          type="primary"
          @click="addCanku"
          style="margin-right: 10px"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcSupplier:add'] : ['operator:gcSupplier:add']
          "
          >新增供应商
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
            <a-switch
              v-model:checked="record.status"
              :loading="record.loading"
              @change="(checked) => changeStatus(record, checked)"
              :checkedValue="0"
              :unCheckedValue="1"
            />
          </template>
          <template v-if="column.dataIndex === 'auditStatus'"> 审核通过 </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a
                @click="handleEditor(record)"
                style="margin-right: 10px"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcSupplier:edit']
                    : ['operator:gcSupplier:edit']
                "
                >编辑</a
              >
              <a
                @click="handleDelete(record)"
                style="color: orangered"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcSupplier:remove']
                    : ['operator:gcSupplier:remove']
                "
                >删除</a
              >
            </a-space>
          </template>
        </template>
      </a-table>
      <SupplierModal ref="supplierModal" @finish="clearForm"></SupplierModal>
    </a-card>
  </PageContainer>
  <!-- 对话框 数据导出-->
</template>

<script setup>
import SupplierModal from './components/SupplierModal.vue';
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { supplierList, supplierDelete, supplierEdit } from '@/api/goods';
import { FormSearch } from '@/components';

const { proxy } = getCurrentInstance();
const formItems = [
  {
    type: 'text',
    label: '供应商名称',
    value: 'name',
    width: 6,
  },
  {
    type: 'text',
    label: '供应商类型',
    value: 'type',
    width: 6,
  },
];

const columns = [
  {
    title: '供应商名称',
    dataIndex: 'name',
    ellipsis: true,
    key: 'name',
  },
  {
    title: '供应商类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    ellipsis: true,
    key: 'address',
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    ellipsis: true,
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];
onMounted(() => {
  searchForm();
});
// 供应商
const addCanku = () => {
  proxy.$refs.supplierModal.show();
};
const handleEditor = (res) => {
  proxy.$refs.supplierModal.show({ id: res.id });
};
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
  supplierList(apiType.value, requestParameters)
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
  getList();
};

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  getList({});
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;
const handleDelete = (record) => {
  proxy.$confirm({
    title: `操作确认?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      supplierDelete(apiType.value, { id: record.id }).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};

// 状态改变
const changeStatus = (record, checked) => {
  record.loading = true;
  supplierEdit(apiType.value, { id: record.id, status: checked ? 1 : 0 })
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
</script>
<style lang="less" scoped></style>
