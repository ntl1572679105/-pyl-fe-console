<template>
  <PageContainer>
    <a-spin :spinning="spinning">
      <div class="box">
        <div class="one">
          <div class="part">商家信息</div>
          <div class="box">
            <div class="item flex" v-for="(item, index) in shopInfo" :key="index">
              <div class="label f-size">{{ item.name }}：</div>
              <div class="value f-size">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <div class="one">
          <div class="part">提现信息</div>
          <div class="box">
            <div class="item flex" v-for="(item, index) in tixianInfo" :key="index">
              <div class="label f-size">{{ item.name }}：</div>
              <div class="value f-size">{{ item.unit ? item.unit : '' }}{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="one">
          <div class="part">提现记录</div>
          <div class="box">
            <FormSearch
              :formItems="formItems"
              :formData="formState"
              @searchForm="searchForm"
              @clearForm="clearForm"
            ></FormSearch>
            <a-button
              type="primary"
              style="margin-bottom: 20px"
              @click="exportDo"
              :loading="exportLoading"
              >导出</a-button
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
              :scroll="{ x: 700 }"
            >
              <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.key === 'action' && proxy.id != record.id">
                  <a-space>
                    <a @click="handleView(record)">查看</a>
                  </a-space>
                </template>
                <template v-if="column.key === 'time'">
                  <span v-if="record.status == 1">{{ text }}</span
                  ><span v-else>-</span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </a-spin>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { fileDownTable } from '@/utils/tools.js';
import { commissionDetail, commissionList, comissionExport } from '@/api/o2o/commision';
import dayjs from 'dayjs';

defineProps({
  id: String,
});

const { proxy } = getCurrentInstance();
const spinning = ref(true);
const shopInfo = ref([]);
const tixianInfo = ref([]);
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '提现时间',
    dataIndex: 'updateTime',
    key: 'time',
    width: 200,
  },
  {
    title: '提现金额',
    dataIndex: 'amount',
    customRender: ({ text }) => (text ? '￥' + text : '-'),
    width: 180,
  },
  {
    title: '账户名称',
    dataIndex: 'bankUser',
    width: 180,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => ['待审核', '通过', '拒绝'][text],
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
  },
];
const formItems = [
  {
    type: 'rangedatepicker',
    label: '提现时间',
    value: 'time',
  },
];
const formState = reactive({
  time: undefined,
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
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
onMounted(() => {
  getDetail();
});

const getDetail = () => {
  spinning.value = true;
  commissionDetail({ withdrawId: proxy.id })
    .then((res) => {
      shopInfo.value = [
        { name: '商家名称', value: res.shopName },
        { name: '联系人', value: res.bankUser || '-' },
        { name: '店铺地址', value: res.shopAddress || '-' },
        { name: '联系电话', value: res.phone || '-' },
        {
          name: '账户信息',
          value: [res.bankName, res.bankNumber].filter((el) => el != null).join(' '),
        },
      ];
      tixianInfo.value = reactive([
        { name: '提现金额', value: res.amount, unit: '￥' },
        { name: '提现时间', value: res.status == 1 ? res.updateTime : '-' },
        { name: '提现次数', value: res.withdrawTimes },
        { name: '上次提现时间', value: res.lastWithdrawTime || '-' },
        { name: '累计提现金额', value: res.totalWithdraw || '-', unit: '￥' },
        { name: '提现状态', value: ['待审核', '通过', '拒绝'][res.status] },
      ]);
      dataSource.name = res.shopName;
      searchForm();
    })
    .finally(() => {
      spinning.value = false;
    });
};

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const clearForm = () => {
  searchForm({});
};
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      name: dataSource.name,
      // status: 1,
    },
    formData,
  );
  if (formData && formData.time) {
    requestParameters.beginTime = dayjs(formData.time[0]).format('YYYY-MM-DD');
    requestParameters.endTime = dayjs(formData.time[1]).format('YYYY-MM-DD');
    requestParameters.time = undefined;
  }
  commissionList(requestParameters)
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

const handleView = (record) => {
  proxy.$router.push({ path: `/xsh-getMoneyDetail/${record.id}` });
};

const exportLoading = ref(false);
const exportDo = () => {
  exportLoading.value = true;
  // setTimeout(() => {
    const params = {
      beginTime: formState.time ? dayjs(formState.time[0]).format('YYYY-MM-DD') : undefined,
      endTime: formState.time ? dayjs(formState.time[1]).format('YYYY-MM-DD') : undefined,
    }
    comissionExport(params).then((res) => {
      console.log(res);
      fileDownTable('提现记录报表' + '.xls', res.data);
      proxy.$message.success('导出成功');
      getList(dataSource.params);
    }).catch((error) => {
      console.log(error);
      proxy.$message.warning('导出失败，请重试');
    });
    exportLoading.value = false;
  // }, 500);
};
</script>

<style lang="less" scoped>
:deep(.ant-tabs-tab-btn) {
  font-size: 20px;
}
.box {
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
}
.item {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid;
  border-bottom-color: rgba(0, 0, 0, 0.15);
  .label {
    width: 15%;
  }
}
.part {
  font-size: 18px;
  position: relative;
  padding-left: 20px;
}

.part::before {
  position: absolute;
  content: '';
  width: 10px;
  height: 20px;
  background: #1890ff;
  top: 0;
  left: 0px;
  bottom: 0;
  margin: auto;
}

.f-size {
  font-size: 18px;
}
.flex {
  display: flex;
}
</style>
