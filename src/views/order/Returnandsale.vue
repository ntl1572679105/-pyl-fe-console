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

      <!-- <div class="table-operator" v-permission="['supplier:order:add']"> -->
      <div class="btnbox" style="margin-bottom: 20px">
        <!-- <a-button type="primary" @click="daochusj" style="margin-right: 10px"> 导出数据 </a-button> -->
      </div>
      <!-- </div> -->

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
              <!-- 自定义指令 -->
              <a
                @click="handleDetail(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcOrderAfterSales:detail']
                    : ['operator:gcOrderAfterSales:detail']
                "
                >详情</a
              >
              <a
                @click="handleBeizhu(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcOrderAfterSales:edit']
                    : ['operator:gcOrderAfterSales:edit']
                "
                >备注</a
              >
              <a
                @click="handleDelete(record)"
                v-if="record.status !== 5 && record.status !== 4"
                style="color: orangered"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcOrderAfterSales:edit']
                    : ['operator:gcOrderAfterSales:edit']
                "
                >关闭</a
              >
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            {{ textOrderStatus(record.status) }}
          </template>
          <template v-if="column.key === 'payAmount'">
            ￥{{ record.orderItem.totalAmount }}
          </template>
          <template v-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>
    <CommonNoteModal ref="commonNoteModal"></CommonNoteModal>
    <CommonCloseModal ref="commonCloseModal" @finish="NoteOrderModalFinsh"></CommonCloseModal>
  </PageContainer>
  <!-- 对话框 数据导出-->
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { orderAfterSalesList, personorderAfterSalesList } from '@/api/order.js';
import dayjs from 'dayjs';
import CommonNoteModal from './compontens/CommonNoteModal.vue';
import CommonCloseModal from './compontens/CommonCloseModal.vue';

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
    // customRender: (text) => {
    //   return text ? '￥' + text : '';
    // },
  },
  {
    title: '售后状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '用户账号',
    dataIndex: 'createBy',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '创建时间	',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    align: 'center',
  },
];
const formItems = [
  {
    type: 'text',
    label: '订单编号',
    value: 'orderNo',
    width: 7,
  },
  {
    type: 'select',
    label: '售后状态',
    value: 'status',
    // int32状态 0-待审核 1-已审核/待用户发货 2-售后已收货 3-确认退款 4-完成 5-取消 6-审批否决

    width: 5,
    options: [
      {
        value: 0,
        label: '待审核',
      },
      {
        value: 1,
        label: '已审核/待用户发货',
      },
      {
        value: 2,
        label: '售后已收货',
      },
      // {
      //   value: 3,
      //   label: '确认退款',
      // },
      {
        value: 4,
        label: '完成',
      },
      {
        value: 5,
        label: '取消',
      },
      {
        value: 6,
        label: '审批否决',
      },
    ],
  },
  {
    type: 'rangedatepicker',
    label: '提交起迄日期',
    value: 'time',
    width: 8,
  },
  // {
  //   type: 'datepicker',
  //   label: '提交时间结束',
  //   value: 'endTime',

  //   // width: 8,
  // },
];
const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
// 查询条件
const formState = reactive({
  orderNo: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
});
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const getList = (formData) => {
  const parameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  if (parameters && parameters.time) {
    parameters.startTime = dayjs(parameters.time[0]).format('YYYY-MM-DD');
    parameters.endTime = dayjs(parameters.time[1]).format('YYYY-MM-DD');
  }
  Object.keys(parameters).forEach((key) => {
    if (key == 'time') {
      delete parameters[key];
    }
  });
  console.log(parameters, 'parameters');
  loading.value = true;
  orderAfterSalesList(apiType.value, parameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  getList();
});
const textOrderStatus = computed(() => {
  return (value) => {
    // 状态 0-待审核 1-已审核/待用户发货 2-售后已收货 3-确认退款 4-完成 5-取消 6-审批否决
    return ['待审核', '已审核/待用户发货', '售后已收货', '确认退款', '完成', '取消', '审批否决'][
      value
    ];
  };
});
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  getList({});
};
// 表单搜索回调
const searchForm = (formData) => {
  dataSource.params = formData;
  pagination.current = 1;
  formData.orderNo = formData.orderNo;
  // console.log(formData, 'formData');
  getList(formData);
};
const NoteOrderModalFinsh = () => {
  getList();
};

const handleDetail = (record) => {
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: `/cp-orderAfterSalesManage/${record.id}` });
  } else {
    proxy.$router.push({ path: `/ip-orderAfterSalesManage/${record.id}` });
  }
};
const handleBeizhu = (record) => {
  proxy.$refs.commonNoteModal.show({
    type: 'returnsale',
    id: record.id,
  });
};
const handleDelete = (record) => {
  proxy.$refs.commonCloseModal.show({
    type: 'returnsale',
    id: record.id,
  });
};
</script>
<style lang="less" scoped></style>
