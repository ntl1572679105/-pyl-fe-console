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
        style="margin-top: 50px; border-radius: 10px"
        headStyle="font-weight: bolder;background-color: #f9f9f9;border-radius: 10px 10px 0 0;"
        :title="
          proxy.$route.meta.type === 1
            ? '渔需物资' + proxy.$route.meta.title
            : '渔获物资' + proxy.$route.meta.title
        "
      >
        <my-charts :xData="xAxis" :yData="yAxis"></my-charts>
      </a-card>
    </a-card>
  </PageContainer>
</template>

<script setup>
import MyCharts from './components/MyChart.vue';
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { OrderOption, SalesOption, shopList } from '@/api/pb2b/report';
import { getOrderOption, getSalesOption, warehouseList } from '@/api/report';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const paramsId = proxy.$route.meta.type === 1 ? 'warehouseId' : 'shopId';
const paramsNameList = ref([])
const formItems = reactive([
  {
    type: 'selectText',
    label: proxy.$route.meta.type === 1 ? '前置仓名称' : '店铺名称',
    value: paramsId,
    options: paramsNameList
  },
  {
    type: 'rangedatepicker',
    value: 'time',
    label: '选择日期',
  },
]);
const xAxis = ref({});
const yAxis = ref({});

onMounted(() => {
  searchForm();
  const nameApi = proxy.$route.meta.type === 1 ? warehouseList : shopList
  nameApi().then((res) => {
    res.data.forEach((item) => {
      paramsNameList.value.push({
        label: item.name,
        value: item.id
      })
    })
  })
});
const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  time: '',
});

const clearForm = () => {
  dataSource.params = {};
  getList();
};

const getList = (formData) => {
  const params = {
    startTime: dataSource.params?.time ? dayjs(dataSource.params.time[0]).format('YYYY-MM-DD') : null,
    endTime: dataSource.params?.time ? dayjs(dataSource.params.time[1]).format('YYYY-MM-DD') : null,
    ...formData,
    time: undefined
  }
  if (proxy.$route.meta.title === '商品销售') {
    const api = proxy.$route.meta.type === 1 ? getSalesOption : SalesOption
    api(params).then((res) => {
      if (!res.length) {
        proxy.$message.error('暂无数据！')
      }
      let xData = [];
      let yData = [];
      res.forEach((item) => {
        if (xData.length === 0) {
          xData = item.list.map((el) => dayjs(el.time).format('YYYY-MM-DD'));
        }
        let series = {
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 9,
          itemStyle: {
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          // stack: 'Total',
          smooth: true,
          areaStyle: {
            opacity: 0.4,
          },
          lineStyle: {
            width: 3,
          },
          name: item.categoryName,
          data: item.list.map((el) => el.count),
        };
        yData.push(series);
      });
      xAxis.value = xData;
      yAxis.value = yData;
    })
  } else {
    const api = proxy.$route.meta.type === 1 ? getOrderOption : OrderOption
    api(params).then((res) => {
      if (!res.length) {
        proxy.$message.error('暂无数据！')
      }
      let xData = [];
      let yData = [];
      let yData1 = [];
      let yData2 = [];
      res.forEach((item) => {
        xData.push(dayjs(item.monthTime).format('YYYY-MM-DD'));
        yData1.push(item.orderNumber);
        yData2.push(item.orderTotalNumber);
      });
      yData = [
        {
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 9,
          itemStyle: {
            color: '#0099ff',
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 2,
            shadowColor: 'rgb(0, 153, 255)',
            shadowBlur: 12,
          },
          // stack: 'Total',
          areaStyle: {
            opacity: 0.4,
          },
          lineStyle: {
            width: 3,
          },
          name: '订单数量',
          data: yData2,
        },
        {
          type: 'line',
          symbol: 'circle',
          showSymbol: false,
          symbolSize: 9,
          itemStyle: {
            color: '#f68090',
            borderColor: '#ffffff',
            borderWidth: 2,
            shadowColor: 'rgba(246, 128, 144, 0.5)',
            shadowBlur: 12,
          },
          // stack: 'Total',
          areaStyle: {
            opacity: 0.4,
          },
          lineStyle: {
            width: 3,
          },
          name: '成交订单',
          data: yData1,
        },
      ];
      xAxis.value = xData;
      yAxis.value = yData;
    });
  }
};

// 表单搜索回调
const searchForm = (formData) => {
  dataSource.params = formData;
  getList(dataSource.params);
};
</script>
<style lang="less" scoped></style>
