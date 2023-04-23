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

      <a-table
        ref="table"
        size="default"
        :loading="loading"
        row-key="id"
        :dataSource="dataSource.list"
        :columns="columns"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1500 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleDetail(record)">查看</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, computed, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { orderList } from '@/api/o2o/order.js';

onMounted(() => {
  searchForm();
});
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    width: 200,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '数量',
    dataIndex: 'productNum',
    width: 120,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '实付金额',
    dataIndex: 'payAmount',
    customRender: ({ text }) => (text ? '￥' + text : '-'),
    width: 150,
  },
  {
    title: '所属商家',
    dataIndex: 'shopName',
    ellipsis: true,
    width: 150,
  },
  {
    title: '核销时间',
    dataIndex: 'verificationTime',
    customRender: ({ text }) => (text ? text : '-'),
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
    align: 'center',
  },
];
const dataSource = reactive({
  list: [],
  params: {},
});

const formItems = [
  {
    type: 'text',
    label: '订单编号或用户名查询',
    width: 8,
    value: 'queryString',
  },
  {
    type: 'text',
    label: '商家名',
    width: 6,
    value: 'name',
  },
];
const formState = reactive({
  queryString: '',
  name: '',
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

const clearForm = () => {
  searchForm({});
};

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  const params = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      status: 2,
    },
    formData,
  );
  orderList(params)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleDetail = (record) => {
  proxy.$router.push({
    path: `/xsh-writeOffDetail/${record.orderNo}`,
  });
};

// 分页 逻辑操作
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
</script>

<style lang="scss"></style>
