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
        <a-button type="primary" @click="shopAdd"> 新增店铺 </a-button>
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
        :scroll="{ x: 1500 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button
                type="link"
                @click="handleAudit(record)"
                :disabled="record.auditStatus !== 0"
                >审核</a-button
              >
              <a @click="handleAudit(record, 2)">详情</a>
              <a @click="handleSecurity(record)">保证金</a>
              <a @click="handleEditor(record)" v-if="record.auditStatus === 1">编辑</a>
              <a @click="handleDelet(record)" style="color: orangered">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" />
          </template>
          <template v-else-if="column.dataIndex === 'auditStatus'">
            {{ auditStatusText(text) }}
          </template>
          <template v-else-if="column.dataIndex === 'remainMargin'">
            {{ text || 0 }}
          </template>
          <template v-else-if="column.key === 'status'">
            <a-space>
              <a-switch
                v-model:checked="record.status"
                :unCheckedValue="1"
                :checkedValue="0"
                @change="(checked) => changeStatus(checked, record)"
                :loading="record.loading"
              />
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
      <AddShopModal ref="addShopModal" @finish="refreshData"></AddShopModal>
      <MarginModal ref="marignModal" @finish="refreshData"></MarginModal>
      <AuditShopModal ref="auditShopModal" @finish="refreshData" />
      <AuditShopDetailModal ref="auditShopDetailModal" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { shopList, shopDelete, shopDeatil, shopStatusUpdate, shopAuditDetail } from '@/api/pb2b/goods.js';
import { FormSearch } from '@/components';
import AddShopModal from './components/AddShopModal.vue';
import MarginModal from './components/MarginModal.vue';
import AuditShopModal from './components/AuditShopModal.vue';
import AuditShopDetailModal from './components/AuditShopDetailModal.vue';

const { proxy } = getCurrentInstance();
const formItems = reactive([
  {
    type: 'text',
    label: '商铺名称',
    value: 'name',
    width: 8,
  },
  {
    type: 'text',
    label: '联系人',
    value: 'linkman',
    width: 8,
  },
  {
    type: 'text',
    label: '手机号码',
    value: 'phone',
    width: 8,
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    width: 8,
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
  {
    type: 'select',
    label: '审核状态',
    value: 'auditStatus',
    width: 8,
    options: [
      { label: '待审核', value: 0 },
      { label: '已通过', value: 1 },
      { label: '未通过', value: 2 },
    ],
  },
]);
const formState = reactive({
  name: '',
  linkman: '',
  phone: '',
  status: undefined,
  auditStatus: undefined,
});
const columns = [
  {
    title: '店铺名称',
    dataIndex: 'name',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '联系人',
    dataIndex: 'linkman',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '店铺简介',
    dataIndex: 'briefIntroduction',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '店铺logo',
    dataIndex: 'logo',
    key: 'img',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    key: 'auditStatus',
    width: 100,
  },
  {
    title: '保证金',
    dataIndex: 'remainMargin',
    width: 100,
  },
  {
    title: '仲裁次数',
    dataIndex: 'arbitrationNum',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 250,
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

const auditStatusText = computed(() => {
  return (value) => {
    if (value === null || value === undefined) return '-';
    return ['待审核', '已通过', '未通过'][value];
  };
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
  shopList(requestParameters)
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

// 修改状态
const changeStatus = (checked, record) => {
  record.loading = true;
  shopStatusUpdate({ id: record.id, status: checked ? 1 : 0 })
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
const shopAdd = () => {
  proxy.$refs.addShopModal.show({ title: '新增店铺' });
};
const handleEditor = (record) => {
  shopDeatil(record.id).then((res) => {
    proxy.$refs.addShopModal.show({ ...res, title: '修改店铺', id: record.id });
  });
};
const handleSecurity = (record) => {
  proxy.$refs.marignModal.show({
    title: '保证金',
    id: record.id,
    remainMargin: record.remainMargin,
  });
};

const handleDelet = (record) => {
  proxy.$confirm({
    title: `确认删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      shopDelete(record.id).then((res) => {
        proxy.$message.success('删除成功');
        refreshData();
      });
    },
  });
};

// 审批
const handleAudit = (record, isDetail = 1) => {
  if (isDetail === 2) {
    if (record.auditRecordId) {
      shopAuditDetail(record.auditRecordId).then((res) => {
        proxy.$refs.auditShopDetailModal.show({
          ...res,
          id: record.id,
          auditStatus: res.isCover,
          auditTime: res.coverTime,
        });
      });
    } else {
      proxy.$refs.auditShopDetailModal.show(record);
    }
    return;
  }
  if (record.auditRecordId) {
    shopAuditDetail(record.auditRecordId).then((res) => {
      proxy.$refs.auditShopModal.show({
        ...res,
        id: record.id,
        auditStatus: res.isCover,
        auditTime: res.coverTime,
      });
    });
  } else {
    proxy.$refs.auditShopModal.show(record);
  }
};

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const refreshData = () => {
  getList(dataSource.params);
};
</script>
<style lang="less" scoped></style>
