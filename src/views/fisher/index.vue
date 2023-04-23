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
        <a-button type="primary" @click="handleAdd" v-permission="['operator:role:add']">
          新建
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
        :scroll="{ x: 1300 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space v-if="!record.admin">
              <a @click="handleEdit(record)" v-permission="['operator:role:edit']">编辑</a>
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="['operator:role:remove']"
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'type'">
            {{ textType(text) }}
          </template>
          <template v-else-if="column.key === 'size'">
            <div>船长：{{ record.shipLength }}(米)</div>
            <div>船宽：{{ record.shipWidth }}(米)</div>
            <!-- {{ `船长：${record.shipLength} \n 船宽：${record.shipWidth}` }} -->
          </template>
          <template v-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <FisherModal ref="fisherModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import dayjs from 'dayjs';
import { fishingBoatsList, fishingBoatsDelete } from '@/api/customer.js';
import FisherModal from './components/FisherModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '渔船编号',
    // dataIndex: 'number',
    customRender: ({ index }) => `${index + 1}`,
    width: 100,
  },
  {
    title: '所有人名称',
    dataIndex: 'name',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 140,
  },
  {
    title: 'MMSI码',
    dataIndex: 'mmsi',
    width: 150,
  },
  {
    title: '船舶种类',
    dataIndex: 'shipType',
    width: 150,
    // key: 'type',
  },
  {
    title: '船名',
    dataIndex: 'shipName',
    ellipsis: true,
    key: 'tooltip',
    width: 150,
  },
  {
    title: '尺寸',
    key: 'size',
    width: 150,
  },
  {
    title: '建造日期',
    dataIndex: 'buildTime',
    width: 120,
  },
  {
    title: '船员信息',
    dataIndex: 'crew',
    ellipsis: true,
    key: 'tooltip',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
    align: 'center',
  },
];

const formItems = [
  {
    type: 'text',
    label: 'MMSI码',
    value: 'mmsi',
  },
  {
    type: 'text',
    label: '手机号',
    value: 'phone',
  },
  {
    type: 'select',
    label: '船舶种类',
    value: 'shipType',
    options: [
      //   { label: '捕捞渔船', value: 0 },
      //   { label: '休闲渔船', value: 1 },
      //   { label: '辅助渔船', value: 2 },
      { label: '捕捞渔船', value: '捕捞渔船' },
      { label: '休闲渔船', value: '休闲渔船' },
      { label: '辅助渔船', value: '辅助渔船' },
    ],
  },
  {
    type: 'text',
    label: '船名',
    value: 'shipName',
  },
  {
    type: 'datepicker',
    label: '建造日期',
    value: 'buildTime',
  },
];
const textType = computed(() => {
  return (value) => {
    return ['捕捞渔船', '休闲渔船', '辅助渔船'][value];
  };
});

const formState = reactive({
  mmsi: '',
  phone: '',
  shipType: undefined,
  shipName: '',
  buildTime: undefined,
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
  if (requestParameters.buildTime) {
    requestParameters.buildTime = dayjs(formData.buildTime).format('YYYY-MM-DD');
  }
  console.log(requestParameters);
  fishingBoatsList(requestParameters)
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

const handleAdd = () => {
  proxy.$refs.fisherModal.show({ title: '添加' });
};
const handleEdit = (record) => {
  //   roleDetail(record.roleId).then((res) => {
  proxy.$refs.fisherModal.show({ title: '编辑', ...record });
  //   });
};
const deleteSub = (record) => {
  proxy.$confirm({
    title: '数据删除后不可找回，确定删除吗？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      fishingBoatsDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
const modalOk = () => {
  clearForm();
};
</script>
