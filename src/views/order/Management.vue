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
              <a
                @click="handleDelete(record)"
                v-permission="
                  proxy.$route.meta.type && proxy.$route.meta.type === 1
                    ? ['operator:jcProductComment:remove']
                    : ['operator:gcProductComment:remove']
                "
                style="color: orangered"
                >删除</a
              >
            </a-space>
          </template>
          <template v-if="column.key === 'score'">
            <a-space>
              <a-rate v-model:value="record.score" :disabled="true" />
            </a-space>
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
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { commentList, commentDelete } from '@/api/order.js';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '商品编号',
    dataIndex: 'productNo',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '订单金额',
    dataIndex: 'payAmount',
    customRender: ({ text }) => (text ? `￥${text}` : '￥0'),
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 200,
  },
  {
    title: '评价内容',
    dataIndex: 'content',
    ellipsis: true,
    key: 'tooltip',
  },
  // {
  //   title: '订单类型',
  //   dataIndex: 'ordertype',
  //   key: 'ordertype',
  // },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
    key: 'time',
  },
  {
    title: '操作',
    key: 'action',
    // fixed: 'right',
    width: 80,
    align: 'center',
  },
];
const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  orderNo: undefined,
  productNo: undefined,
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
onMounted(() => {
  getList();
});
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const getList = (formData) => {
  // console.log(formData, 'formData');

  const formDataParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  commentList(apiType.value, formDataParameters)
    .then((res) => {
      loading.value = true;
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};
const formItems = [
  {
    type: 'text',
    label: '订单编号',
    value: 'orderNo',
  },
  {
    type: 'text',
    label: '商品编号',
    value: 'productNo',
  },
];

const handleDelete = (record) => {
  proxy.$confirm({
    title: `确认删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      commentDelete(apiType.value, record.id).then((res) => {
        proxy.$message.success('删除成功');
        getList();
      });
    },
  });
};
</script>
<style lang="less" scoped></style>
