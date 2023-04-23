<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
        :more-span="proxy.$route.meta.type === 1 ? 8 : 24"
      >
      <template #more v-if="proxy.$route.meta.type === 1">
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
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button
          v-if="proxy.$route.meta.type === 1"
          :disabled="!hasSelected"
          v-permission="['operator:jcOrder:edit']"
          type="primary"
          @click="fenpeidd"
        >
          分配订单
        </a-button>
        <!-- <a-button v-else v-permission="['operator:gcOrder:edit']" type="primary" @click="fenpeidd">
          分配订单
        </a-button> -->
        <a-button
          style="margin-left: 30px"
          v-if="proxy.$route.meta.type === 1"
          type="primary"
          @click="orderOuput"
        >
          订单导出
        </a-button>
        <a-button
          style="margin-left: 30px"
          :disabled="!hasSelected"
          v-if="proxy.$route.meta.type === 1"
          type="primary"
          @click="arrivedFronthouse"
        >
          已到前置仓
        </a-button>
        <a-button
          style="margin-left: 30px"
          :disabled="!hasSelected"
          v-if="proxy.$route.meta.type === 1"
          type="primary"
          @click="orderWritten"
        >
          订单已核销
        </a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :row-selection="
          proxy.$route.meta.type === 1
            ? {
                selectedRowKeys: dataSource.selectedRowKeys,
                onChange: orderChange,
                hideSelectAll: false,
              }
            : undefined
        "
        :scroll="{ x: 1680 }"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <!-- 自定义指令 -->
              <!-- <a @click="handleDetail(record)" v-permission="['order:detail']">详情</a> -->
              <a
                @click="handleDetail(record)"
                v-permission="
                  proxy.$route.meta.type === 1
                    ? ['operator:jcOrder:detail']
                    : ['operator:gcOrder:detail']
                "
                >详情</a
              >

              <a
                @click="handleBeizhu(record)"
                v-permission="
                  proxy.$route.meta.type === 1
                    ? ['operator:jcOrder:edit']
                    : ['operator:gcOrder:edit']
                "
                >备注</a
              >

              <a
                v-if="!record.status && record.payType == 1"
                v-permission="
                  proxy.$route.meta.type === 1
                    ? ['operator:jcOrder:edit']
                    : ['operator:gcOrder:edit']
                "
                @click="handleDelete(record)"
                style="color: orangered"
                >关闭</a
              >
            </a-space>
          </template>
          <!-- 订单状态 -->
          <template v-if="column.key === 'status'">
            {{ textOrderStatus(text) }}
          </template>
          <template v-if="column.key === 'payType'">
            {{ payTypeText(text) }}
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
    <AllocateOrdersModal ref="AllocateOrders" @finish="modalOk"></AllocateOrdersModal>
    <CommonNoteModal ref="commonNoteModal"></CommonNoteModal>
    <CommonCloseModal ref="commonCloseModal" @onfinsh="NoteOrderModalFinsh"></CommonCloseModal>
  </PageContainer>
  <!-- 对话框 数据导出-->
</template>

<script setup>
import {
  orderList,
  updateOrder,
  orderOutPut,
  arrivedFront,
  orderWriteOff,
  orderAssign,
} from '@/api/order.js';
import { supplierList, personsupplierList } from '@/api/goods.js';
import AllocateOrdersModal from './compontens/AllocateOrdersModal.vue';
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import dayjs from 'dayjs';
import { fileDownTable } from '@/utils/tools.js';
import CommonCloseModal from './compontens/CommonCloseModal.vue';
import CommonNoteModal from './compontens/CommonNoteModal.vue';
import { debounce } from 'lodash-es';
// orderOuput
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    key: 'tooltip',
    // key: 'orderNo',
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '手机号',
    dataIndex: 'userPhone',
    ellipsis: true,
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    // width: 110,
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    key: 'payType',
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    width: 200,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    // fixed: 'right',
    width: 180,
    align: 'center',
  },
];


const formItems = ref([
  {
    type: 'text',
    label: '订单编号',
    value: 'orderNo',
    width: 8,
  },
  {
    type: 'text',
    label: '手机号',
    value: 'userPhone',
    width: 8,
  },
  {
    type: 'text',
    label: '用户名称',
    value: 'userName',
    width: 8,
  },

  {
    type: 'select',
    label: '订单状态',
    value: 'status',
    width: 8,
    // 订单状态 0- 1-已支付/待发货 2-已发货/待收货 3-待评价 4-已完成 5-已取消
    options: [
      {
        value: 0,
        label: '待支付',
      },
      {
        value: 1,
        label: '已支付/待发货',
      },
      {
        value: 2,
        label: '已发货/待收货',
      },
      {
        value: 3,
        label: '待评价',
      },
      {
        value: 4,
        label: '已完成',
      },
      {
        value: 5,
        label: '已取消',
      },
    ],
  },
  {
    type: 'datepicker',
    label: '支付时间',
    value: 'payTime',
    width: 8,
  },
]);

if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
  columns.splice(7, 0, {
    title: '供应商',
    dataIndex: 'supplierName',
  });
}
const hasSelected = computed(() => dataSource.selectedRowKeys.length > 0);
const dataSource = reactive({
  list: [],
  params: {},
  selectedRowKeys: [],
  supplierList: [],
});
const formState = reactive({
  orderNo: undefined,
  status: undefined,
  payTime: undefined,
  userPhone: undefined,
  userName: undefined,
  deliveryNo: undefined,
  supplierId: undefined
});


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


const textOrderStatus = computed(() => {
  //  订单状态 0-待支付 1-已支付/待发货 2-已发货/待收货 3-待评价 4-已完成 5-已取消
  return (value) => {
    return ['待支付', '已支付/待发货', '已发货/待收货', '待评价', '已完成', '已取消'][value];
  };
});

const payTypeText = computed(() => {
  // 1-微信支付 2-白条支付
  return (value) => {
    if (!value) return '-';
    return ['-', '微信支付', '白条支付'][value];
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

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  formState.supplierId = undefined;
  getList();
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};
const loading = ref([]);
// 挂载
onMounted(() => {
  if (proxy.$route.meta.type === 2) {
    columns.splice(6, 0, {
      title: '物流单号',
      dataIndex: 'deliveryNo',
      ellipsis: true,
      key: 'tooltip',
    });

    formItems.value.push({
      type: 'text',
      label: '物流单号',
      value: 'deliveryNo',
      width: 8,
    });
  }

  getSupplierList();
  getList();
});
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (requestParameters.payTime) {
    requestParameters.payTime = dayjs(formData.payTime).format('YYYY-MM-DD');
  }
  if (formState.supplierId) {
    requestParameters.supplierId = formState.supplierId;
  }
  orderList(apiType.value, requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const getSupplierList = () => {
  personsupplierList(apiType.value, { pageNum: 1, pageSize: 999 }).then((res) => {
    dataSource.supplierList = res.data.map((item) => ({ label: item.name, value: item.id }));
  });
};

// 分页 逻辑操作
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

// 列表已选择
const orderChange = (selectedRowKeys, selectedRows) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
  dataSource.selectedRowKeys = selectedRowKeys;
};
const fenpeidd = () => {
  // console.log(dataSource.selectedRowKeys);
  proxy.$refs.AllocateOrders.show({ ids: dataSource.selectedRowKeys }, dataSource.supplierList);
  getList(dataSource.params);
};
const orderOuput = () => {
  const ids = [];
  Object.values(dataSource.selectedRowKeys).forEach((item) => {
    ids.push(item);
  });
  loading.value = true;
  const requestParameters = Object.assign({ ids: ids.join() }, dataSource.params);
  console.log(requestParameters, 'requestParameters');
  orderOutPut(requestParameters)
    .then((res) => {
      // console.log(res);
      fileDownTable('订单表格' + '.xls', res.data);
      getList(dataSource.params);
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
      getList(dataSource.params);
      dataSource.selectedRowKeys = [];
    });
};
// 已到前置仓
const arrivedFronthouse = () => {
  proxy.$confirm({
    title: `是否将选中订单标记为已到货?订单状态更改后不可撤销！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const ids = [];
      Object.values(dataSource.selectedRowKeys).forEach((item) => {
        ids.push(item);
      });
      arrivedFront({ ids })
        .then((res) => {
          proxy.$message.success('操作成功');
          getList(dataSource.params);
        })
        .catch(() => {})
        .finally(() => {
          getList(dataSource.params);
          dataSource.selectedRowKeys = [];
        });
    },
  });
};
// 订单核销
const orderWritten = () => {
  proxy.$confirm({
    title: `是否将选中订单标记为已核销?订单状态更改后不可撤销！
`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const ids = [];
      Object.values(dataSource.selectedRowKeys).forEach((item) => {
        ids.push(item);
      });
      orderWriteOff({ ids })
        .then((res) => {
          proxy.$message.success('操作成功');
          getList(dataSource.params);
        })
        .catch(() => {})
        .finally(() => {
          getList(dataSource.params);
          dataSource.selectedRowKeys = [];
        });
    },
  });
};

// 弹窗
const handleDetail = (record) => {
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: `/cp-order-detail/${record.id}` });
  } else {
    proxy.$router.push({ path: `/ip-order-detail/${record.id}` });
  }
};

const handleBeizhu = (record) => {
  proxy.$refs.commonNoteModal.show({
    type: 'order',
    id: record.id,
  });
};
const handleDelete = (record) => {
  proxy.$refs.commonCloseModal.show({
    type: 'order',
    id: record.id,
  });
};
const NoteOrderModalFinsh = () => {
  getList();
};

const modalOk = () => {
  dataSource.selectedRowKeys = [];
  getList(dataSource.params);
};
</script>
<style lang="less" scoped></style>
