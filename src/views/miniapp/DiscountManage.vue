<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button
          type="primary"
          @click="handleAdd"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcCoupon:add'] : ['operator:gcCoupon:add']
          "
        >
          新增优惠券
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
        :scroll="{ x: 1300 }"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a
                @click="handleEdit(record)"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcCoupon:edit']
                    : ['operator:gcCoupon:edit']
                "
                >编辑</a
              >
              <a
                @click="deleteSub(record)"
                style="color: #ff4d4f"
                v-permission="
                  proxy.$route.meta.type == 1
                    ? ['operator:jcCoupon:remove']
                    : ['operator:jcCoupon:remove']
                "
                >删除</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'type'">
            <span>{{ typeName(record.type) }}</span>
          </template>
          <template v-else-if="column.key === 'categoryNames'">
            <a-space v-if="record.categoryNames">
              <span>{{ record.categoryNames.map((item) => item.name).join('、') }}</span>
              <!-- <span v-for="(item, index) in record.categoryNames" :key="index">
                <span style="white-space: nowrap">
                  {{ item.name }}
                </span>
                &nbsp;
              </span> -->
            </a-space>
            <a-space v-else>
              <span>全部商品</span>
            </a-space>
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'time'">
            <span>{{ record.beginTime }}--</span>
            <span>{{ record.endTime }}</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { couponList, couponDelete } from '@/api/miniapp.js';
import RecommenderModal from './components/RecommenderModal.vue';
import { values } from 'store/storages/all';

defineProps({
  type: String,
});

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '优惠券名称',
    dataIndex: 'name',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '优惠券类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: '使用范围',
    dataIndex: 'categoryNames',
    key: 'categoryNames',
    width: 200,
  },
  {
    title: '有效期',
    dataIndex: '',
    key: 'time',
    width: 350,
  },
  {
    title: '发放数量',
    dataIndex: 'totalNum',
    width: 100,
  },

  {
    title: '领取数量',
    dataIndex: 'getNum',
    align: 'center',
    width: 100,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    align: 'center',
    width: 150,
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
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
const typeName = computed(() => {
  // 优惠券类型 1-金额券 2-折扣券\
  return (values) => {
    if (values) {
      return ['', '金额券', '折扣券'][values];
    }
  };
});
onMounted(() => {
  getProductList();
});
// 商品列表
const getProductList = () => {
  loading.value = true;
  const requestParameters = Object.assign({
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
  });
  couponList(requestParameters, proxy.$route.meta.type)
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
    title: `确认删除该优惠券?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      couponDelete(record.id, proxy.$route.meta.type).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};

// 新增、修改
const handleAdd = () => {
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({
      path: '/cp-miniapp/discountManage/add',
    });
  } else {
    proxy.$router.push({
      path: '/ip-miniapp/discountManage/add',
    });
  }
};
const handleEdit = (record) => {
  // const
  if (proxy.$route.meta.type && proxy.$route.meta.type == 1) {
    proxy.$router.push({ path: `/cp-miniapp/discountManage/update/${record.id}` });
  } else {
    proxy.$router.push({ path: `/ip-miniapp/discountManage/update/${record.id}` });
  }
};
</script>

<style lang="less" scoped></style>
