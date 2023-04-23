<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <div class="table-operator">
        <a-button type="primary" @click="gotoAdd">添加</a-button>
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
        :scroll="{ x: 1500 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">修改</a>
              <a @click="handleDelete(record)" style="color: red">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ dayjs(text).format('YYYY-MM-DD') }}
          </template>
        </template>
      </a-table>
      <AddGoods ref="addGoodsModal" @finish="modalOk"></AddGoods>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import AddGoods from './components/addGoods.vue';
import { goodsList, delGoods, typeList, goodsDetail } from '@/api/o2o/goods.js';
import { shangjiaList } from '@/api/o2o/shangjia.js';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '商品编号',
    dataIndex: 'productNo',
    width: 180,
    ellipsis: true,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 180,
  },
  {
    title: '所属商家',
    dataIndex: 'shopName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '商品说明',
    dataIndex: 'introduction',
    ellipsis: true,
    width: 180,
  },
  {
    title: '商品分类',
    dataIndex: 'categoryName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => ['已上架', '已下架'][text],
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: '商品库存',
    dataIndex: 'stock',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
  },
];

const formItems = ref([
  {
    type: 'text',
    label: '商品编号',
    value: 'productNo',
  },
  {
    type: 'select',
    label: '商品分类',
    value: 'productCategoryId',
    options: [],
  },
  {
    type: 'rangedatepicker',
    label: '有效期',
    value: 'time',
    format: 'YYYY-MM-DD',
  },
  {
    type: 'text',
    label: '商品名称',
    value: 'name',
  },
  {
    type: 'select',
    label: '所属商家',
    value: 'shopId',
    options: [],
  },
  {
    type: 'datepicker',
    label: '创建时间',
    value: 'createTime',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '已上架', value: 0 },
      { label: '已下架', value: 1 },
    ],
  },
]);

const formState = reactive({
  productNo: '',
  select: undefined,
  time: undefined,
  name: '',
  shopId: undefined,
  createTime: undefined,
  status: undefined,
});

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
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
  searchForm();
  getGoodsTypeList();
  getShopList();
});

// 获取 商品分类、商家列表数据
const getGoodsTypeList = () => {
  typeList({ pageNum: 1, pageSize: 999 }).then((res) => {
    const options = res.data.map((item) => ({ label: item.name, value: item.id }));
    formItems.value[1].options = options;
  });
};
const getShopList = () => {
  shangjiaList({ pageNum: 1, pageSize: 999 }).then((res) => {
    const options = res.data.map((item) => ({ label: item.name, value: item.id }));
    formItems.value[4].options = options;
  });
};

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  searchForm();
};
const handleEdit = (record) => {
  goodsDetail(record.id).then((res) => {
    proxy.$refs.addGoodsModal.show(res, formItems.value[1].options, formItems.value[4].options);
  });
};
const gotoAdd = () => {
  proxy.$refs.addGoodsModal.show({}, formItems.value[1].options, formItems.value[4].options);
};
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (formData && formData.time) {
    requestParameters.validStartTime = dayjs(formData.time[0]).format('YYYY-MM-DD') + ' 00:00:00';
    requestParameters.validEndTime = dayjs(formData.time[1]).format('YYYY-MM-DD') + ' 23:59:59';
    requestParameters.time = null;
  }
  console.log('loadData request parameters:', requestParameters);
  goodsList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleDelete = (record) => {
  proxy.$confirm({
    title: `确认删除该商品?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      delGoods(record.id).then((res) => {
        proxy.$message.success('删除成功');
        getList(dataSource.params);
      });
    },
  });
};

const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const modalOk = () => {
  getList(dataSource.params);
};
</script>
