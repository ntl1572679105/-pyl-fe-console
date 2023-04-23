<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        v-if="productCategoryList.length > 0"
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
        :more-span="proxy.$route.meta.type === 1 ? 0 : 24"
      >
        <template #more v-if="proxy.$route.meta.type === 2">
          <a-col :span="8">
            <a-form-item name="supplierId" label="供应商">
              <a-select
                v-model:value="formState.supplierId"
                placeholder="请选择"
                allowClear
                show-search
                :filter-option="false"
                :not-found-content="supplierState.fetching ? undefined : null"
                :options="supplierState.data"
                @search="fetchShop"
              >
                <template v-if="supplierState.fetching" #notFoundContent>
                  <a-spin size="small" />
                </template>
              </a-select>
            </a-form-item>
          </a-col>
        </template>
      </FormSearch>

      <!-- <div class="table-operator" v-permission="['supplier:order:add']"> -->
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button
          type="primary"
          v-show="proxy.$route.meta.type == 1"
          @click="addGoods"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcProduct:add'] : ['operator:gcProduct:add']
          "
          style="margin-right: 10px"
        >
          新增商品
        </a-button>
        <a-button
          type="primary"
          @click="goodsOutput"
          :loading="goodsOutputTimeout"
          :disabled="goodsOutputTimeout"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcProduct:add'] : ['operator:gcProduct:add']
          "
          style="margin-right: 10px"
        >
          商品一键导出
        </a-button>
        <a-button
          type="primary"
          v-show="proxy.$route.meta.type == 1"
          @click="goodsImport"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcProduct:add'] : ['operator:gcProduct:add']
          "
          style="margin-right: 10px"
        >
          批量导入商品
        </a-button>
        <a-button
          type="primary"
          @click="bulkShelvesChange(1)"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcProduct:add'] : ['operator:gcProduct:add']
          "
          style="margin-right: 10px"
          :disabled="!hasSelected"
        >
          批量上架
        </a-button>
        <a-button
          type="primary"
          @click="bulkShelvesChange(2)"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcProduct:add'] : ['operator:gcProduct:add']
          "
          style="margin-right: 10px"
          :disabled="!hasSelected"
        >
          批量下架
        </a-button>
        <a-button
          type="primary"
          @click="bulkPriceChange()"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcProduct:add'] : ['operator:gcProduct:add']
          "
          style="margin-right: 10px"
          :disabled="!hasSelected"
        >
          批量改价
        </a-button>
      </div>
      <ImportFileModal ref="importFileModal" @finished="importFinished" />
      <ImportErrModal ref="importErrModal" @finished="importErrFinished" />
      <PriceChangeModal ref="priceChangeModal" @finish="importErrFinished" />
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
        :rowSelection="{
          selectedRowKeys: dataSource.selectedRowKeys,
          onChange: goodsChange,
          hideSelectAll: false,
          getCheckboxProps: (record) => {
            return { disabled: record.id ? false : true };
          },
        }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space v-if="record.isChild !== true">
              <a
                @click="handleEditor(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcProduct:edit']
                    : ['operator:gcProduct:edit']
                "
                >编辑</a
              >
              <a
                @click="handleDelete(record)"
                style="color: orangered"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcProduct:remove']
                    : ['operator:jgcProduct:remove']
                "
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" />
          </template>
          <template v-else-if="column.key === 'category'">
            <span v-if="!record.isChild"
              >{{ record.primaryCategoryName || ''
              }}{{ record.secondaryCategoryName ? '/' + record.secondaryCategoryName : ''
              }}{{ record.thirdlyCategoryName ? '/' + record.thirdlyCategoryName : '' }}</span
            >
          </template>
          <!--          todo-->
          <template v-else-if="column.key === 'guige'">
            <div v-for="(item, index) in record.skus" :key="index">
              <span>
                <span>{{ item.key }}:&nbsp;{{ item.value }}</span
                ><br />
              </span>
            </div>
          </template>
          <template v-else-if="record.isChild !== true && column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :unCheckedValue="1"
              :checkedValue="0"
              @change="(checked) => changeStatus(record, checked)"
            />
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import {
  goodsList,
  deletGoods,
  updateGoods,
  productOutput,
  updateGoodsStatus,
  updateStatus,
  importError,
  importGoods,
  supplierList
} from '@/api/goods.js';
import { fileDownTable } from '@/utils/tools.js';
import { categoryList } from '@/api/system.js';
import ImportFileModal from '@/components/ImportModal/ImportFileModal.vue';
import ImportErrModal from '@/components/ImportModal/ImportErrModal.vue';
import PriceChangeModal from './components/PriceChangeModal.vue';
import { debounce } from 'lodash-es';

const { proxy } = getCurrentInstance();
const productCategoryList = ref([]);
const goodsOutputTimeout = ref(false);
const tabChange = reactive({
  flag: false,
  params: {},
});

const formItems = reactive([
  {
    type: 'text',
    label: '商品编号',
    value: 'productNo',
  },
  {
    type: 'cascaderSelect',
    label: '类目',
    value: 'categoryIds',
    options: productCategoryList,
  },
  {
    type: 'text',
    label: '规格',
    value: 'sku',
  },
  // {
  //   type: 'select',
  //   label: '排序依据',
  //   value: 'orderByColumn',
  //   width: proxy.$route.meta.type === 1 ? 6 : 8,
  //   options: [{ value: 'create_time', label: '创建时间(默认)' }, { value: 'price', label: '价格' }]
  // },
  // {
  //   type: 'select',
  //   label: '排序',
  //   value: 'isAsc',
  //   width: proxy.$route.meta.type === 1 ? 6 : 8,
  //   options: [{ value: 'desc', label: '倒序(默认)' }, { value: 'asc', label: '正序' }]
  // }
]);

if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
  formItems.splice(1, 0, {
    type: 'text',
    label: '商品名称',
    value: 'name',
  });
}
const columns = [
  {
    title: '商品编号',
    dataIndex: 'productNo',
    ellipsis: true,
  },
  {
    title: '商品图片',
    dataIndex: 'mainImgUrl',
    key: 'img',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
  },
  {
    title: '类目',
    key: 'category',
  },
  // todo
  {
    title: '规格',
    key: 'guige',
  },
  {
    title: '价格',
    dataIndex: 'price',
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
  },
  {
    title: '库存数量',
    dataIndex: 'stock',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
  {
    title: '上下架',
    dataIndex: 'status',
    key: 'status',
  },
];

if (proxy.$route.meta.type && proxy.$route.meta.type == 2) {
  columns.splice(7, 0, {
    title: '供应商',
    dataIndex: 'supplierName',
  });
}

let lastFetchId = 0;
const supplierState = reactive({
  data: [],
  fetching: false,
});

const fetchShop = debounce((value) => {
  console.log('fetching product: ', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  supplierState.data = [];
  supplierState.fetching = true;
  supplierList(apiType.value, { name: value, pageNum: 1, pageSize: 20 }).then((res) => {
    if (fetchId !== lastFetchId) return;
    supplierState.data = res.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    supplierState.fetching = false;
  });
}, 300);

const dataSource = reactive({
  list: [],
  params: {},
  selectedRowKeys: [],
});
const formState = reactive({
  productNo: '',
  name: '',
  categoryIds: undefined,
  sku: '',
  supplierId: undefined
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const getCategoryList = () => {
  categoryList(apiType.value).then((res) => {
    console.log(res, 'categoryList');
    const list = [];
    transformData(res, list);
    productCategoryList.value = list;
  });
};

const changeStatus = (record, checked) => {
  const api = proxy.$route.meta.type === 1 ? updateStatus : updateGoodsStatus;
  api({
    id: record.id,
    status: checked ? 1 : 0,
  })
    .then((res) => {
      proxy.$message.success('状态修改成功');
      // 把值重新赋值回去
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.error('状态修改失败');
      record.status = checked ? 0 : 1;
    });
};

// 转换类目结构
const transformData = (list, result) => {
  if (list && list.length > 0) {
    list.forEach((item) => {
      const child = { label: item.name, value: item.id, children: [] };
      transformData(item.children, child.children);
      if (child.children.length <= 0) {
        delete child.children;
      }
      result.push(child);
    });
  }
};
const hasSelected = computed(() => dataSource.selectedRowKeys.length > 0);
// 列表已选择
const goodsChange = (selectedRowKeys, selectedRows) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
  dataSource.selectedRowKeys = selectedRowKeys;
  console.log(...dataSource.selectedRowKeys);
};
const importErrFinished = () => {
  setTimeout(() => {
    searchForm();
  }, 500);
};
const importFinished = (res) => {
  console.log(res, 'xxxx');
  const { errNum, totalNum, uuid } = res;
  if (errNum > 0) {
    proxy.$refs.importErrModal.show({
      title: '注意',
      total: totalNum,
      success: totalNum - errNum,
      error: errNum,
      uuid,
    });
  } else {
    proxy.$message.success('导入成功');
    searchForm();
  }
};
const goodsImport = () => {
  // proxy.$refs.importErrModal.show({title:'注意',total:100,success:88,error:12,fileUrl:''})
  proxy.$refs.importFileModal.show({ title: '导入', uploadName: 'file', accept: '.xls,.xlsx' });
};
// 批量上下架
const bulkShelvesChange = (num) => {
  const statusNum = Number(num - 1);
  console.log(statusNum);
  let arr = [];
  const tempArr = [];
  arr = [...dataSource.selectedRowKeys].filter(Boolean);
  const api = proxy.$route.meta.type == 1 ? updateStatus : updateGoodsStatus;
  arr.forEach((item) => {
    tempArr.push(
      new Promise((resolve) => {
        api({ id: item, status: statusNum }).then((res) => {
          resolve(res);
        });
      }),
    );
  });
  Promise.all(tempArr).then((values) => {
    console.log(values);
    proxy.$message.success(num === 1 ? '批量上架成功' : '批量下架成功');
    searchForm();
  });
};

const bulkPriceChange = () => {
  let arr = [];
  // const tempArr = [];
  arr = [...dataSource.selectedRowKeys].filter(Boolean);
  console.log(arr);
  proxy.$refs.priceChangeModal.show({ arr, list: dataSource.list });
};

const goodsOutput = () => {
  const primaryCategoryId = [];
  goodsOutputTimeout.value = true;
  dataSource.selectedRowKeys.forEach((item) => {
    primaryCategoryId.push(item);
  });
  const params = Object.assign({ ids: primaryCategoryId.join() }, dataSource.params);
  productOutput(apiType.value, params)
    .then((res) => {
      console.log(res);
      proxy.$message.success('导出成功');
      goodsOutputTimeout.value = false;
      fileDownTable('商品列表' + '.xls', res.data);
      getList(dataSource.params);
    })
    .catch(() => {
      goodsOutputTimeout.value = false;
      proxy.$message.error('导出失败 请重试');
    });
};
const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  tabChange.params = {};
  formState.supplierId = undefined;
  tabChange.flag = false;
  getList();
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

onMounted(() => {
  if (proxy.$route.query) {
    tabChange.flag = true;
    tabChange.params = proxy.$route.query;
    proxy.$route.query = {};
    const { primaryCategoryId, secondaryCategoryId, thirdlyCategoryId } = tabChange.params;
    const categoryIds = [
      primaryCategoryId ? Number(primaryCategoryId) : undefined,
      secondaryCategoryId ? Number(secondaryCategoryId) : undefined,
      thirdlyCategoryId ? Number(thirdlyCategoryId) : undefined,
    ];
    formState.categoryIds = categoryIds.filter((item) => item);
  }
  searchForm();
  getCategoryList();
});
const getList = (formData) => {
  loading.value = true;
  const params = {};
  if (tabChange.flag) {
    params.value = tabChange.params;
  }
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
    {
      categoryIds: null,
    },
    params.value,
  );
  if (formState.supplierId) {
    requestParameters.supplierId = formState.supplierId;
  }
  goodsList(apiType.value, requestParameters)
    .then((res) => {
      res.data.forEach((item) => {
        if (item.skuList && item.skuList.length > 0) {
          item.children = item.skuList.map((sku) => ({
            productNo: sku.skuNo,
            mainImgUrl: sku.mainImgUrl,
            price: sku.price,
            stock: sku.stock,
            skus: sku.skus,
            isChild: true,
          }));
        }
      });
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
      params.value = {};
    });
};
const loading = ref(false);
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  if (formData) {
    if (formData.categoryIds != null) {
      formData.primaryCategoryId = formData.categoryIds[0] || '';
      formData.secondaryCategoryId = formData.categoryIds[1] || '';
      formData.thirdlyCategoryId = formData.categoryIds[2] || '';
      tabChange.params = {};
    }
  }
  dataSource.params = formData;
  getList(formData);
};

const addGoods = () => {
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: '/cp-goodsManage/add' });
  } else {
    proxy.$router.push({ path: '/ip-goodsManage/add' });
  }
};

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  if (!tabChange.flag) {
    getList(dataSource.params);
  } else {
    getList(tabChange.params);
  }
};
// 编辑
const handleEditor = (record) => {
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: `/cp-goodsManage/editor/${record.id}` });
  } else {
    proxy.$router.push({ path: `/ip-goodsManage/editor/${record.id}` });
  }
};

const handleDelete = (record) => {
  proxy.$confirm({
    title: `确认删除该商品?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      deletGoods(apiType.value, record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
</script>
<style lang="less" scoped></style>
