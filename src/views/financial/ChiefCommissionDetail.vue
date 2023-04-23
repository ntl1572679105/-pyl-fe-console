<template>
  <PageContainer>
    <div class="container">
      <a-card>
        <div class="box-title">团长信息</div>
        <div class="box-flex">
          <div>团长名称：{{ detailRef.userName }}</div>
          <div>手机号码：{{ detailRef.userPhone }}</div>
          <div>账户信息：{{ detailRef.bankName + detailRef.bankNumber }}</div>
        </div>
      </a-card>
      <a-card style="margin-top: 30px">
        <div class="box-title">提现信息</div>
        <div class="box-flex">
          <div>提现金额：¥{{ detailRef.amount }}</div>
          <div>提现时间：
            <span v-if="detailRef.status == 1">{{ detailRef.updateTime }}</span>
            <span v-else>-</span>
          </div>
          <div>提现状态：{{ statusText(detailRef.status) }}</div>
        </div>
        <div class="box-flex">
          <div>提现次数：{{ detailRef.withdrawTimes || '0' }}</div>
          <div>上次提现时间：{{ detailRef.lastWithdrawTime || '-' }}</div>
          <div>累计提现金额：{{ detailRef.totalWithdraw || '-' }}</div>
        </div>
      </a-card>
      <a-card style="margin-top: 30px">
        <div class="box-title">提现信息</div>
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
          <template v-if="column.key === 'status'">
            <span>{{ statusText(text) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'updateTime'">
            <span v-if="record.status == 1">{{ text }}</span>
            <span v-else>-</span>
          </template>
        </template>
      </a-table>
      </a-card>
    </div>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { withdrawDetail, withdrawList } from '@/api/regiment.js';

defineProps({
  id: String,
});

const { proxy } = getCurrentInstance();
const loading = ref(false);
const detailRef = ref({});
const dataSource = reactive({
  list: []
});
const columns = [
{
    title: '编号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '提现编号',
    dataIndex: 'withdrawNo',
    // ellipsis: true,
  },
  {
    title: '提现时间',
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '提现金额',
    dataIndex: 'amount',
  },
  {
    title: '账户名称',
    dataIndex: 'bankUser',
  },
  {
    title: '提现状态',
    dataIndex: 'status',
    key: 'status',
  },
]

onMounted(() => {
  proxy.id && getDetail(proxy.id);
});
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const getDetail = (id) => {
  loading.value = true;
  withdrawDetail(id)
    .then((res) => {
      detailRef.value = res;
      const requestParameters = Object.assign(
        { pageNum: pagination.current, pageSize: pagination.pageSize },
        { regimentId: res.regimentId }
      );
      withdrawList(requestParameters).then((res) => {
        dataSource.list = res.data;
        pagination.total = res.total;
      })
    })
    .catch((e) => {
      console.log(e);
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

const statusText = computed(() => {
  return (value) => {
    if (value === null) return '';
    return ['待审核', '已提现', '已拒绝', '已取消'][value];
  };
});
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  overflow-y: auto;
  .box-title {
    font-size: 24px;
    font-weight: bold;
    color: #000;
    margin-bottom: 20px;
  }
  .box-flex {
    display: flex;
    margin-top: 20px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    div {
      width: 25%;
    }
  }
}
</style>
