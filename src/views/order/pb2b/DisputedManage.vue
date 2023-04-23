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
        :dataSource="dataSource.list"
        :columns="columns"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1410 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleDetail(record)" v-permission="['b2b:orderDispute:detail']">详情</a>
              <!-- <a
                @click="noteOrder(record)"
                >备注</a
              >
              <a
                v-if="record.status !== 5 && record.status !== 4"
                @click="handleDelete(record)"
                style="color: orangered"
                >关闭</a
              > -->
            </a-space>
          </template>
          <template v-if="column.key === 'payAmount'">
            ￥{{ record.orderItem.totalAmount }}
          </template>
          <template v-if="column.key === 'status'">
            {{ textOrderStatus(record.status) }}
          </template>
          <template v-if="column.dataIndex === 'arbitrationStatus'">
            {{ statusName(record.arbitrationStatus) }}
          </template>
        </template>
      </a-table>
    </a-card>
    <Pb2bNoteModal ref="commonNoteModal"></Pb2bNoteModal>
    <Pb2bCloseModal ref="pb2bCloseModal" @finish="clearForm"></Pb2bCloseModal>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, computed, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { List } from '@/api/pb2b/dispute.js';
import dayjs from 'dayjs';
import Pb2bNoteModal from '../compontens/Pb2bNoteModal.vue';
import Pb2bCloseModal from '../compontens/Pb2bCloseModal.vue';

onMounted(() => {
  searchForm();
});
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '服务单号',
    dataIndex: 'afterSalesNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '退换金额',
    dataIndex: 'payAmount',
    key: 'payAmount',
  },
  {
    title: '售后状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
  },
  {
    title: '订单类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '用户账号',
    dataIndex: 'createBy',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '店铺名称',
    dataIndex: 'shopName',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'time',
    width: 200,
  },
  {
    title: '平台仲裁状态',
    dataIndex: 'arbitrationStatus',
    // width: 200,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 100,
    align: 'center',
  },
];
const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  orderNo: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
  warehouseName: undefined,
  createBy: undefined,
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
  pagination.current = 1;
  dataSource.params = {};
  getList();
};

// 表单搜索回调
const searchForm = (formData) => {
  console.log(formData, 'formData');
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
  // proxy.$router.push({name: 'cp-disputedOrderManage-detail'})
};
const formItems = [
  {
    type: 'text',
    label: '订单编号',
    value: 'orderNo',
    width: '6',
  },
  {
    type: 'select',
    label: '售后状态',
    value: 'status',
    width: '6',
    options: [
      { label: '待审核', value: 0 },
      { label: '已审核/待用户发货', value: 1 },
      { label: '售后已收货', value: 2 },
      { label: '确认退款', value: 3 },
      { label: '完成', value: 4 },
      { label: '取消', value: 5 },
      { label: '审批否决', value: 6 },
    ],
  },
  {
    type: 'text',
    label: '店铺名称',
    value: 'shopName',
    width: '6',
  },
  {
    type: 'select',
    label: '平台仲裁状态',
    value: 'arbitrationStatus',
    width: '6',
    options: [
      { label: '全部', value: '' },
      { label: '待仲裁', value: 0 },
      { label: '已退款', value: 1 },
      { label: '拒绝退款', value: 2 },
    ],
  },
  {
    type: 'rangedatepickerdisabled',
    label: '提交起讫时间',
    value: 'time',
  },
  {
    type: 'text',
    label: '用户账号',
    value: 'createBy',
  },
];

const handleDelete = (record) => {
  proxy.$refs.pb2bCloseModal.show({
    id: record.id,
  });
};

const textOrderStatus = computed(() => {
  return (value) => {
    // 状态 0-待审核 1-已审核/待用户发货 2-售后已收货 3-确认退款 4-完成 5-取消 6-审批否决
    return ['待审核', '已审核/待用户发货', '售后已收货', '确认退款', '完成', '取消', '审批否决'][
      value
    ];
  };
});

const statusName = computed(() => {
  return (value) => {
    // 状态 0-待仲裁 1-已退款 2-拒绝退款
    return ['待仲裁', '已退款', '拒绝退款'][value];
  };
});

const noteOrder = (record) => {
  proxy.$refs.commonNoteModal.show({
    id: record.id,
    type: 'returnsale',
  });
};
// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  const params = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  console.log(params, 'params');
  if (params && params.time) {
    (params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD')),
      (params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD'));
    params.time = null;
  }
  List(params)
    .then((res) => {
      console.log(res, 'res');
      pagination.total = res.total;
      dataSource.list = res.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
      dataSource.selectedRowKeys = [];
    });
};

// 分页 逻辑操作
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const handleDetail = (record) => {
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: `/cp-disputedOrderManage/${record.id}` });
  } else {
    proxy.$router.push({ path: `/pb2b-disputedOrderManage/${record.id}` });
  }
};
</script>

<style lang="scss"></style>
