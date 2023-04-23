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
        :scroll="{ x: 1410 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a
                @click="handleDetail(record)"
                v-permission="
                  proxy.$route.meta.type && proxy.$route.meta.type === 1
                    ? ['operator:jcProductComment:remove']
                    : ['operator:gcProductComment:remove']
                "
                >详情</a
              >
              <a
                @click="noteOrder(record)"
                v-permission="
                  proxy.$route.meta.type && proxy.$route.meta.type === 1
                    ? ['operator:jcProductComment:remove']
                    : ['operator:gcProductComment:remove']
                "
                >备注</a
              >
              <a
                @click="handleDelete(record)"
                v-if="record.status !== 5 && record.status !== 4"
                v-permission="
                  proxy.$route.meta.type && proxy.$route.meta.type === 1
                    ? ['operator:jcProductComment:remove']
                    : ['operator:gcProductComment:remove']
                "
                style="color: orangered"
                >关闭</a
              >
            </a-space>
          </template>
          <template v-if="column.key === 'payAmount'">
            ￥{{ record.orderItem.totalAmount }}
          </template>
          <template v-if="column.key === 'status'">
            {{ textOrderStatus(record.status) }}
          </template>
        </template>
      </a-table>
    </a-card>
    <CommonNoteModal ref="commonNoteModal"></CommonNoteModal>
    <CommonCloseModal ref="commonCloseModal"></CommonCloseModal>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, computed, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import {
  disputeList
} from '@/api/dispute.js';
import CommonNoteModal from './compontens/CommonNoteModal.vue';
import CommonCloseModal from './compontens/CommonCloseModal.vue';
import dayjs from 'dayjs';

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
    title: '前置仓名称',
    dataIndex: 'warehouseName',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    key: 'time',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 135,
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
  userName: undefined,
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
  },
  {
    type: 'select',
    label: '售后状态',
    value: 'status',
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
    type: 'rangedatepickerdisabled',
    label: '提交起讫时间',
    value: 'time',
  },
  {
    type: 'text',
    label: '用户账号',
    value: 'userName',
  },
  {
    type: 'text',
    label: '前置仓名称',
    value: 'warehouseName',
  },
];

const noteOrder = (record) => {
  proxy.$refs.commonNoteModal.show({
    type: 'returnsale',
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

// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  const params = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    },
    formData
  );
  if (params && params.time) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD'),
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD')
    params.time = null
  }
  console.log(params, 'params')
  disputeList(params)
    .then((res) => {
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
  console.log(record);
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: `/cp-disputedOrderManage/${record.id}`})
  } else {
    proxy.$router.push({ path: `/pb2b-disputedOrderManage/${record.id}`})
  }
}

const handleDelete = (record) => {
  proxy.$refs.commonCloseModal.show({
    type: 'returnsale',
    id: record.id,
  });
};

</script>

<style lang="scss"></style>
