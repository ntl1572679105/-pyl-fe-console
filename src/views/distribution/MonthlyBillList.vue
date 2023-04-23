<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <a-card
        style="margin-top: 20px; border-radius: 10px"
        :title="dataSource.monthTitle"
        :headStyle="{
          'font-weight': 'blod',
          'background-color': '#f9f9f9',
          'border-radius': '10px 10px 0 0',
        }"
      >
        <div class="top-box">
          <div>
            <span>提现总金额</span>
            <span>{{ dataSource.detail.accumulateCount ?? 0 }}元</span>
          </div>
          <div>
            <span>订单总数</span>
            <span>{{ dataSource.detail.orderCount ?? 0 }}个</span>
          </div>
        </div>
      </a-card>
      <a-card
        style="margin-top: 20px; border-radius: 10px"
        title="账单详情"
        :headStyle="{
          'font-weight': 'blod',
          'background-color': '#f9f9f9',
          'border-radius': '10px 10px 0 0',
        }"
      >
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
            <template v-if="column.key === 'status'">
              {{ statusText(text) }}
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
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import dayjs from 'dayjs';
import { monthBill, distributionDetail } from '@/api/regiment.js';

const { proxy } = getCurrentInstance();
const formItems = reactive([
  {
    type: 'datepicker',
    value: 'startTime',
    label: '时间',
    picker: 'month',
  },
]);

const loading = ref(true);

onMounted(() => {
  getList(dataSource.params);
  getDetail();
  dataSource.monthTitle = `${dayjs().format('YYYY年MM月')} 月账单`;
});
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '提现编号',
    dataIndex: 'withdrawNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '提现时间',
    dataIndex: 'createTime',
  },
  {
    title: '团长名称',
    dataIndex: ['mpUser', 'userName'],
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '团长手机号',
    dataIndex: ['mpUser', 'phone'],
  },
  {
    title: '提现金额',
    dataIndex: 'amount',
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
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
];
const dataSource = reactive({
  list: [],
  params: { startTime: dayjs() },
  detail: {},
  monthTitle: '',
});

const formState = reactive({
  startTime: '',
});

const statusText = computed(() => {
  return (value) => {
    if (!value) return '-';
    return ['待审核', '已提现', '已拒绝'][value];
  };
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const getList = (formData) => {
  loading.value = true;
  const requestParameters = { pageNum: pagination.current, pageSize: pagination.pageSize };
  if (formData && formData.startTime) {
    requestParameters.startTime = formData.startTime.format('YYYY-MM');
  }
  distributionDetail(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const getDetail = () => {
  monthBill({ startTime: dayjs(dataSource.params.startTime).format('YYYY-MM') }).then((res) => {
    dataSource.detail = res;
  });
};

// 表单搜索回调
const searchForm = (formData) => {
  console.log(formData);
  if (formData && formData.startTime) {
    dataSource.params = { startTime: dayjs(formData.startTime) };
  } else {
    dataSource.params = { startTime: dayjs() };
  }
  dataSource.monthTitle = `${dataSource.params.startTime.format('YYYY年MM月')} 月账单`;
  getList(dataSource.params);
  getDetail();
};

const clearForm = () => {
  dataSource.params = { startTime: dayjs() };
  dataSource.monthTitle = `${dataSource.params.startTime.format('YYYY年MM月')} 月账单`;
  getList(dataSource.params);
  getDetail();
};

// 分页 逻辑操作
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
</script>
<style lang="less" scoped>
.top-box {
  display: flex;
  align-items: center;
  gap: 20px;
  div {
    width: 25%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f0f2f5;
    border-radius: 5px;
    span:nth-child(1) {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 24px;
    }
    span:nth-child(2) {
      font-size: 30px;
      font-weight: bold;
      color: #000;
    }
  }
}
</style>
