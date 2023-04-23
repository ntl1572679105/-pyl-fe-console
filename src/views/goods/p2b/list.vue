<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        v-if="productCategoryList.length > 0"
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
        :more-span="-1"
      >
        <template #prefix>
          <a-col :span="8">
            <a-form-item name="shopType" label="商品模块">
              <a-select
                v-model:value="formState.shopType"
                :default-value="{ value: '3', label: '供应链金融' }"
                placeholder="请选择"
                @change="shopTypeChange"
                :options="[
                  { value: '3', label: '供应链金融' },
                  { value: '4', label: '顶级渔获' },
                ]"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item name="category" label="类目">
              <a-cascader
                v-model:value="formState.categoryIds"
                placeholder="请选择"
                :options="productCategoryList"
              >
              </a-cascader>
            </a-form-item>
          </a-col>
        </template>
      </FormSearch>
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button
          type="primary"
          @click="goodsOutput"
          :loading="goodsOutputTimeout"
          :disabled="goodsOutputTimeout"
          v-permission="['b2b:shop:add']"
          style="margin-right: 10px"
        >
          商品一键导出
        </a-button>
        <a-button
          v-show="topCatchFlag"
          type="primary"
          @click="bulkShelvesChange(1)"
          v-permission="['b2b:shop:add']"
          style="margin-right: 10px"
          :disabled="!hasSelected"
        >
          批量上架
        </a-button>
        <a-button
          v-show="topCatchFlag"
          type="primary"
          @click="bulkShelvesChange(2)"
          v-permission="['b2b:shop:add']"
          style="margin-right: 10px"
          :disabled="!hasSelected"
        >
          批量下架
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
        :scroll="{ x: 1740 }"
        @change="tableChange"
        :rowSelection="{
          selectedRowKeys: dataSource.selectedRowKeys,
          onChange: goodsChange,
          hideSelectAll: false,
          getCheckboxProps: (record) => ({ disabled: record.id ? false : true }),
        }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space v-if="record.isChild !== true">
              <a @click="handleEditor(record)">详情</a>
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
          <template v-else-if="column.key === 'guige'">
            <div v-for="(item, index) in record.skus" :key="index">
              <span>
                <span>{{ item.key }}:&nbsp;{{ item.value }}</span
                ><br />
              </span>
            </div>
          </template>
          <template v-else-if="record.isChild !== true && column.key === 'score'">
            <a-space>
              <a-rate v-model:value="record.score" :disabled="true" />
            </a-space>
          </template>
          <template v-else-if="record.isChild !== true && column.key === 'status'">
            <a-space>
              <a-switch
                :disabled="record.shopType === 3"
                v-model:checked="record.status"
                :unCheckedValue="1"
                :checkedValue="0"
                @change="(checked) => changeStatus(record, checked)"
              />
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, watch, computed } from 'vue';
import { FormSearch } from '@/components';
import { fileDownTable } from '@/utils/tools.js';
import { goodsList, categoryList, productOutput, updateGoodsStatus } from '@/api/pb2b/goods.js';

const tabChange = reactive({
  flag: false,
  params: {},
});
const formState = reactive({
  productNo: '',
  name: '',
  categoryList: [], // pb2b整个类目列表
  shopType: undefined,
  categoryIds: '',
});
const shopTypeFlag = ref(true);

const productCategoryList = ref([]);
const { proxy } = getCurrentInstance();

const formItems = reactive([
  {
    type: 'text',
    label: '商品名称',
    value: 'name',
  },
  {
    type: 'text',
    label: '商品编号',
    value: 'productNo',
  },
  {
    type: 'text',
    label: '规格',
    value: 'sku',
  },
]);

const shopTypeChange = () => {
  formState.categoryIds = '';
  categoryList({ shopType: formState.shopType }).then((res) => {
    const list = [];
    transformData(res, list);
    productCategoryList.value = list;
  });
};
const changeStatus = (record, checked) => {
  updateGoodsStatus({
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

const columns = [
  {
    title: '商品编号',
    dataIndex: 'productNo',
    width: 250
  },
  {
    title: '商品图片',
    dataIndex: 'pcMainImgUrl',
    width: 120,
    key: 'img',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 250
  },
  {
    title: '类目',
    key: 'category',
    width: 300
  },
  {
    title: '规格',
    key: 'guige',
    width: 200
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 100,
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
  },
  {
    title: '库存数量',
    dataIndex: 'stock',
    width: 100
  },
  {
    title: '销量',
    dataIndex: 'sales',
    width: 100
  },
  {
    title: '是否上下架',
    dataIndex: 'status',
    width: 150,
    key: 'status',
  },
  {
    title: '评分',
    dataSource: 'score',
    width: 250,
    key: 'score',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
    align: 'center',
  },
];

const dataSource = reactive({
  list: [],
  params: {},
  selectedRowKeys: [],
});
const hasSelected = computed(() => dataSource.selectedRowKeys.length > 0);
const topCatchFlag = ref(false);

// 列表已选择
const goodsChange = (selectedRowKeys, selectedRows) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
  dataSource.selectedRowKeys = selectedRowKeys;
  console.log(...dataSource.selectedRowKeys);
};
// 批量上下架
const bulkShelvesChange = (num) => {
  const statusNum = Number(num - 1);
  console.log(statusNum);
  let arr = [];
  const tempArr = [];
  arr = [...dataSource.selectedRowKeys].filter(Boolean);
  arr.forEach((item) => {
    tempArr.push(
      new Promise((resolve) => {
        updateGoodsStatus({ id: item, status: statusNum }).then((res) => {
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
const goodsOutputTimeout = ref(false);
const goodsOutput = () => {
  const primaryCategoryId = [];
  goodsOutputTimeout.value = true;
  dataSource.selectedRowKeys.forEach((item) => {
    primaryCategoryId.push(item);
  });
  const params = Object.assign(
    { ids: primaryCategoryId.join(), shopType: topCatchFlag.value ? 4 : 3 },
    dataSource.params,
  );
  productOutput(params)
    .then((res) => {
      console.log(res);
      proxy.$message.success('导出成功');
      goodsOutputTimeout.value = false;
      fileDownTable('商品列表' + '.xls', res.data);
      getList(dataSource.params);
    })
    .catch((e) => {
      console.log(e);
      goodsOutputTimeout.value = false;
      proxy.$message.error('导出失败 请重试');
    });
};
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const clearForm = (formData) => {
  console.log(formData);
  pagination.current = 1;
  dataSource.params = {};
  tabChange.params = {};
  tabChange.flag = false;
  shopTypeFlag.value = false;
  formState.categoryIds = null;
  formState.shopType = '3';
  getList();
};

onMounted(() => {
  if (proxy.$route.query && proxy.$route.query.state == 'open') {
    tabChange.flag = true;
    tabChange.params = proxy.$route.query;
    // formState.shopType = proxy.$route.query.shopType;
    formState.shopType = proxy.$route.query.shopType;
    proxy.$route.query = {};

    const { primaryCategoryId, secondaryCategoryId, thirdlyCategoryId } = tabChange.params;
    const categoryIds = [
      primaryCategoryId ? Number(primaryCategoryId) : undefined,
      secondaryCategoryId ? Number(secondaryCategoryId) : undefined,
      thirdlyCategoryId ? Number(thirdlyCategoryId) : undefined,
    ];
    formState.categoryIds = categoryIds.filter((item) => item);
  }
  // else {
  // defVal.value = false;
  // formState.shopType = 3;
  // }
  searchForm();
  getCategoryList();
});

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

const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const getCategoryList = () => {
  loading.value = true;
  if (tabChange.flag) {
    categoryList({ shopType: formState.shopType })
      .then((res) => {
        const list = [];
        transformData(res, list);
        productCategoryList.value = list;
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    categoryList({ shopType: 3 })
      .then((res) => {
        const list = [];
        transformData(res, list);
        productCategoryList.value = list;
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const getList = (formData) => {
  loading.value = true;
  const params = {};
  if (tabChange.flag) {
    params.value = tabChange.params;
  } else {
    params.value = '';
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
  // if (!tabChange.flag && formData) {
  //   if (formData.shopType) {
  //     requestParameters.shopType = formData.shopType;
  //   } else {
  //     requestParameters.shopType = 3;
  //   }
  // } else if (tabChange.flag) {
  //   if (formData && formData.shopType) {
  //     requestParameters.shopType = formData.shopType;
  //   } else {
  //     requestParameters.shopType = formState.shopType;
  //   }
  // } else if (formState.shopType == '') {
  //   requestParameters.shopType = ''
  // } else {
  //   requestParameters.shopType = 3
  // }
  if (formState.shopType) {
    requestParameters.shopType = formState.shopType;
    if (formState.shopType == 4) {
      topCatchFlag.value = true;
    } else {
      topCatchFlag.value = false;
    }
  } else if (shopTypeFlag.value) {
    requestParameters.shopType = 3;
  } else {
    requestParameters.shopType = undefined;
  }

  if (formState.categoryIds != null) {
    requestParameters.primaryCategoryId = formState.categoryIds[0] || '';
    requestParameters.secondaryCategoryId = formState.categoryIds[1] || '';
    requestParameters.thirdlyCategoryId = formState.categoryIds[2] || '';
  }

  console.log(requestParameters, params);
  goodsList(requestParameters)
    .then((res) => {
      res.data.forEach((item) => {
        if (item.skuList && item.skuList.length > 0) {
          item.children = item.skuList.map((sku) => ({
            productNo: sku.skuNo,
            pcMainImgUrl: sku.pcMainImgUrl,
            price: sku.price,
            stock: sku.stock,
            skus: sku.skus,
            sales: sku.sales,
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
  // if (formData) {
  // if (formData.categoryIds != null) {
  //   formData.primaryCategoryId = formData.categoryIds[0] || '';
  //   formData.secondaryCategoryId = formData.categoryIds[1] || '';
  //   formData.thirdlyCategoryId = formData.categoryIds[2] || '';
  //   tabChange.params = {};
  // }
  // }
  dataSource.params = formData;
  getList(formData);
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
  proxy.$router.push({ path: `/pb2b-goodsDeatil/${record.id}` });
};
</script>
<style lang="less" scoped></style>
