<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <div class="btn" style="margin: 10px">
        <div class="box flex">
          <div class="item flex">
            <div class="label f_1">销售总金额</div>
            <div class="value f_1">{{ totalAmount(dataSource.state.salesTotalAmount) }}</div>
          </div>
          <div class="item flex">
            <div class="label f_1">销售总数</div>
            <div class="value f_1">{{ dataSource.state.salesNumber }}个</div>
          </div>
        </div>
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
        :scroll="{ x: 920 }"
      >
        <template #bodyCell="{ column, record, index, text }"> </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { salesReport, dataReport } from '@/api/o2o/report';
import dayjs from 'dayjs';
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '所属商家',
    dataIndex: 'shopName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '总销售量',
    dataIndex: 'salesTotalNumber',
    width: 150,
  },
  {
    title: '总销售金额',
    dataIndex: 'salesTotalAmount',
    customRender: ({ text }) => (text ? '￥' + text : '-'),
    width: 150,
  },
  {
    title: '所选时间销售量',
    dataIndex: 'salesSectionNumber',
    customRender: ({ text }) => (text ? text : '-'),
    width: 180,
  },
  {
    title: '所选时间销售金额',
    customRender: ({ text }) => (text ? '￥' + text : '-'),
    dataIndex: 'salesSectionAmount',
    width: 180,
  },
];

const formItems = [
  {
    type: 'text',
    label: '商家名称',
    value: 'name',
  },
  {
    type: 'rangedatepicker',
    label: '下单时间',
    value: 'time',
  },
];

// 金额
const totalAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0';
  };
});

const formState = reactive({
  name: '',
  time: undefined,
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
  state: {},
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
  searchForm({});
});

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
  getDetail(formData);
};

const clearForm = () => {
  searchForm({});
};

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (formData && formData.time) {
    requestParameters.beginTime = dayjs(formData.time[0]).format('YYYY-MM-DD');
    requestParameters.endTime = dayjs(formData.time[1]).format('YYYY-MM-DD');
    requestParameters.time = undefined;
  }
  salesReport(requestParameters)
    .then((res) => {
      pagination.total = res.total;
      dataSource.list = res.data;
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

const getDetail = (formData) => {
  const requestParameters = { name: formData.name };
  if (formData && formData.time) {
    requestParameters.beginTime = dayjs(formData.time[0]).format('YYYY-MM-DD');
    requestParameters.endTime = dayjs(formData.time[1]).format('YYYY-MM-DD');
  }
  dataReport(requestParameters).then((res) => {
    Object.keys(res).forEach((key) => {
      dataSource.state[key] = res[key];
    });
  });
};
</script>
<style lang="less" scoped>
.btn {
  //   display: flex;
  width: 100%;
  box-sizing: border-box;
  .box {
    width: 100%;
  }
  .item {
    width: 50% !important;
    text-align: center;
    > div {
      height: 50px;
      line-height: 50px;
    }
    .label,
    .value {
      background: #f0f2f5;
      font-size: 18px;
      //   width: 25%;
      border: 1px solid;
      border-color: rgba(0, 0, 0, 0.15);
    }
  }
}
.flex {
  display: flex;
}
.f_1 {
  flex: 1;
}
</style>
