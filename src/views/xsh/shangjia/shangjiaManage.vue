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
        <a-button type="primary" @click="handleAdd">添加</a-button>
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
        :scroll="{ x: 1230 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'shopCategory'">
            {{ record.shopCategory?.name }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a @click="handleEdit(record)">修改</a>
              <a @click="handleDelete(record)" style="color: orangered">删除</a>
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :loading="record.loading"
              @change="(checked) => statusChange(record, checked)"
              :checkedValue="0"
              :unCheckedValue="1"
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
import { shangjiaList, shangjiaDelete, cateList, shangjiaEdit } from '@/api/o2o/shangjia.js';
import cascaderOptions, { DivisionUtil } from '@pansy/china-division';
import dayjs from 'dayjs';

const divisionUtil = new DivisionUtil(cascaderOptions);
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '商家编号',
    dataIndex: 'shopNo',
    ellipsis: true,
    width: 200,
  },
  {
    title: '商家名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 150,
  },
  {
    title: '地区',
    dataIndex: 'address',
    ellipsis: true,
    width: 150,
  },
  {
    title: '商家分类',
    dataIndex: 'shopCategory',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
];
const shopCategoryOptions = ref([]);

const formItems = [
  {
    type: 'text',
    label: '商家编号',
    value: 'shopNo',
  },
  {
    type: 'select',
    label: '商家分类',
    value: 'shopCategoryId',
    options: shopCategoryOptions,
  },
  {
    type: 'rangedatepicker',
    label: '创建时间',
    value: 'createTime',
  },
  {
    type: 'text',
    label: '名称',
    value: 'name',
    width: 6,
  },
  {
    type: 'cascader',
    label: '所在地区',
    value: 'location',
    options: divisionUtil.getSourceData(),
  },
  {
    type: 'select',
    label: '状态',
    width: 6,
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '封禁', value: 1 },
    ],
  },
];
const rules = reactive([]);
const formState = reactive({
  shopNo: '',
  createTime: undefined,
  name: '',
  shopCategoryId: undefined,
  location: undefined,
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
  cateList().then((res) => {
    res.data.forEach((item) => {
      shopCategoryOptions.value.push({
        label: item.name,
        value: item.id,
      });
    });
  });
});

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
const handleView = (record) => {
  proxy.$router.push({
    path: `/xsh-shangjiaManageView/${record.id}`,
  });
};
const handleEdit = (record) => {
  proxy.$router.push({
    path: `/xsh-shangjiaManageDetail/${record.id}`,
  });
};
const handleAdd = () => {
  proxy.$router.push({
    path: `/xsh-shangjiaManageAdd`,
  });
};

// 切换显示状态
const statusChange = (record, checked) => {
  record.loading = true;
  shangjiaEdit({ id: record.id, status: record.status })
    .then(() => {
      proxy.$message.success('操作成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      record.status = checked ? 0 : 1;
      proxy.$message.warning('切换状态失败，请重试');
    })
    .finally(() => {
      record.loading = false;
    });
};

const getList = (formData) => {
  loading.value = true;
  const requestformData = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (formData && formData.createTime) {
    requestformData.beginTime = dayjs(formData.createTime[0]).format('YYYY-MM-DD');
    requestformData.endTime = dayjs(formData.createTime[1]).format('YYYY-MM-DD');
    requestformData.createTime = null;
  }
  if (formData && formData.location && formData.location.length > 2) {
    const province = divisionUtil.getNameByCode(formData.location[0]);
    const city = divisionUtil.getNameByCode(formData.location[1]);
    const district = divisionUtil.getNameByCode(formData.location[2]);
    if (city === '市辖区' || city === '县' || city === '省直辖县级行政区划') {
      requestformData.city = province;
      requestformData.district = district;
    } else {
      requestformData.province = province;
      requestformData.city = city;
      requestformData.district = district;
    }
    requestformData.location = null;
  }
  shangjiaList(requestformData)
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
    title: `确认解除该商家吗?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      shangjiaDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        getList(dataSource.params);
      });
    },
  });
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const modalOk = () => {
  getList(dataSource.params);
};
</script>
<style lang="less" scoped>
:deep(.table-page-search-submitButtons) {
  justify-content: flex-start !important;
}
</style>
