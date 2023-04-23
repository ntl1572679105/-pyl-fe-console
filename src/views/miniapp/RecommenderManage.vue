<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button
          type="primary"
          @click="handleAdd"
          v-permission="
            proxy.$route.meta.type == 1
              ? ['operator:jcRecommender:add']
              : ['operator:gcRecommender:add']
          "
        >
          新建推荐内容
        </a-button>
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
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a
                @click="handleEdit(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcRecommender:edit']
                    : ['operator:gcRecommender:edit']
                "
                >编辑</a
              >
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcRecommender:remove']
                    : ['operator:gcRecommender:remove']
                "
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" />
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
    <RecommenderModal ref="recommenderModal" @finish="modelOk" />
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { recommenderList, recommenderDelete } from '@/api/miniapp.js';
import RecommenderModal from './components/RecommenderModal.vue';

defineProps({
  type: String,
});

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '商品编号',
    dataIndex: 'productNo',
    width: '30%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '展示图片',
    dataIndex: 'mainImgUrl',
    key: 'img',
    width: '15%',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '10%',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: '30%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    align: 'center',
  },
];

const loading = ref(false);
const dataSource = reactive({
  list: [],
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
  getProductList();
});
const apiType = ref('');
apiType.value = proxy.$route.meta.type 
// 商品列表
const getProductList = () => {
  loading.value = true;
  const requestParameters = Object.assign({
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    type: proxy.type,
  });
  // console.log('loadData request parameters:', requestParameters);
  recommenderList(apiType.value, requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const clearForm = () => {
  pagination.current = 1;
  getProductList();
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getProductList();
};

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该内容?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      recommenderDelete(apiType.value, record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
// 新增、修改
const handleAdd = () => {
  console.log(proxy.$route.meta, 'proxy.type');
  proxy.$refs.recommenderModal.show({ title: '新增', type: proxy.type, lx: 'add' });
};
const handleEdit = (record) => {
  proxy.$refs.recommenderModal.show({ title: '编辑', ...record, type: proxy.type, lx: 'edit' });
};
const modelOk = () => {
  clearForm();
};
</script>

<style lang="less" scoped></style>
