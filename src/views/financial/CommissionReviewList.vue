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
        row-key="id"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1410 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-popconfirm
                title="该提现是否通过?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="auditChange(record.id, 1)"
              >
                <a v-if="record.status === 0">通过</a>
              </a-popconfirm>
              <a-popconfirm
                title="该提现是否拒绝?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="auditChange(record.id, 2)"
              >
                <a v-if="record.status === 0" style="color: #ff4d4f">拒绝</a>
              </a-popconfirm>

              <!-- <a v-if="(record.status === 0)" @click="handleEdit(record)" style="color: #ff4d4f">拒绝</a> -->
              <a @click="handleDetail(record, index)">查看</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ statusText(text) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'updateTime'">
            <span v-if="record.status === 1">{{ text }}</span>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { withdrawList, withdrawAudit } from '@/api/regiment.js';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '编号',
    customRender: ({ index }) => `${index + 1}`,
    width: 100,
  },
  {
    title: '提现编号',
    dataIndex: 'withdrawNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '提现时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '团长名称',
    dataIndex: 'userName',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '团长手机号',
    dataIndex: 'userPhone',
  },
  {
    title: '提现金额',
    dataIndex: 'amount',
  },
  {
    title: '账户名称',
    dataIndex: 'bankUser',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '提现状态',
    dataIndex: 'status',
    key: 'status',
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
    label: '团长名称',
    value: 'userName',
  },
  {
    type: 'text',
    label: '团长手机号码',
    value: 'phone',
  },
  {
    type: 'text',
    label: '提现编号',
    value: 'withdrawNo',
  },
  {
    type: 'select',
    label: '提现状态',
    value: 'status',
    options: [
      { value: 0, label: '待审核' },
      {
        value: 1,
        label: '已提现',
      },
      {
        value: 2,
        label: '已拒绝',
      },
      {
        value: 3,
        label: '已取消',
      },
    ],
  },
];

const formState = reactive({
  userName: '',
  phone: '',
  withdrawNo: '',
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

const statusText = computed(() => {
  return (value) => {
    if (value === null) return '';
    return ['待审核', '已提现', '已拒绝', '已取消'][value];
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
  console.log('loadData request parameters:', requestParameters);
  withdrawList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const auditChange = (id, status) => {
  withdrawAudit({ id, status }).then(() => {
    getList(dataSource.params);
  });
};

const handleDetail = (record) => {
  proxy.$router.push({ path: `/financial/commissionReviewList/${record.id}` });
};
</script>
