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
        :scroll="{ x: 1550 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">查看</a>
              <!-- <a @click="handleReview(record, 1)" v-if="!record.status">同意</a>
              <a @click="handleReview(record, 2)" v-if="!record.status" style="color: orangered">拒绝</a> -->
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
import { orderList } from '@/api/o2o/order';
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    ellipsis: true,
    width: 150,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    width: 200,
  },
  {
    title: '商家名称',
    dataIndex: 'shopName',
    ellipsis: true,
    width: 150,
  },
  {
    title: '申请时间',
    dataIndex: 'cancelTime',
    ellipsis: true,
    width: 200,
  },
  {
    title: '退款理由',
    dataIndex: 'reason',
    customRender: ({ text }) => (text ? text : '-'),
    ellipsis: true,
    width: 150,
  },
  {
    title: '订单金额',
    dataIndex: 'payAmount',
    customRender: ({ text }) => (text ? `￥${text}` : '0'),
    width: 150,
  },
  {
    title: '退款状态',
    dataIndex: 'status',
    customRender: ({ text }) => ['待支付', '已支付/待核销', '已核销', '已评价', '已取消', '已退款'][text],
    width: 140,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
  },
];

const formItems = [
  {
    type: 'text',
    label: '订单编号或用户名',
    value: 'queryString',
  },
  {
    type: 'text',
    label: '商家名',
    value: 'name',
  },
];

const formState = reactive({
  queryString: '',
  name: ''
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
  searchForm({});
};
const handleEdit = (record) => {
  proxy.$router.push({
    path: `/xsh-returnOrderDetail/${record.orderNo}`,
  });
};
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize, status: 5 },
    formData,
  );
  orderList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

// const handleReview = (record, statusText) => {
//   const reviewTitle = statusText == 1 ? '通过' : '拒绝';
//   proxy.$confirm({
//     title: `确认${reviewTitle}该提现申请吗?`,
//     okText: '确定',
//     okType: 'danger',
//     cancelText: '取消',
//     onOk: () => {
//       comissionAudit({ id: record.id, status: statusText }).then(() => {
//         proxy.$message.success(`提现已${reviewTitle}`)
//       }).finally(() => {
//         searchForm();
//       });
//     },
//   });
// };

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
</script>
