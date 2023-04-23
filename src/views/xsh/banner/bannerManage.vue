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
        <a-button type="primary" @click="handleAdd"> 新建banner </a-button>
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
              <a @click="handleEdit(record)">编辑</a>
              <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text || avatar" />
          </template>
          <template v-else-if="column.dataIndex === 'bizType'">
            <span>{{ text == 1 ? '首页' : '活动' }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'linkType'">
            <span>{{ text == 1 ? '外部链接' : '商品详情' }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              :checkedValue="0"
              :unCheckedValue="1"
              @change="(checked) => changeStatus(checked, record)"
              :loading="record.loading"
            />
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{
                record.linkType === 1 ? record.link : record.product?.productNo
              }}</template>
              {{ record.linkType === 1 ? record.link : record.product?.productNo }}
            </a-tooltip>
          </template>
        </template>
      </a-table>

      <BannerModal ref="bannerModal" @finish="modelOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
import { getBannerList, bannerEdit, bannerDel } from '@/api/o2o/banner.js';
import BannerModal from './components/BannerModal.vue';
import avatar from '/src/assets/images/avatar.jpg';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '业务类别',
    dataIndex: 'bizType',
    width: '10%',
  },
  {
    title: '封面图片',
    dataIndex: 'imgUrl',
    key: 'img',
    width: '15%',
  },
  {
    title: '跳转链接类型',
    dataIndex: 'linkType',
    width: '15%',
  },
  {
    title: '跳转内容',
    // dataIndex: 'link',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '10%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: '10%',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    align: 'center',
  },
];

const formItems = [
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      {
        value: 0,
        label: '正常',
      },
      {
        value: 1,
        label: '停用',
      },
    ],
  },
];

const formState = reactive({
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

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    {},
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  getBannerList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  console.log(page);
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};
// 修改状态
const changeStatus = (checked, record) => {
  record.loading = true;
  bannerEdit({ ...record, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
    .finally(() => {
      record.loading = false;
    });
};

// 删除
const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该banner?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      bannerDel(record.id).then(() => {
        proxy.$message.success('删除成功');
        getList(dataSource.params);
      });
    },
  });
};
// 新增、修改
const handleAdd = () => {
  proxy.$refs.bannerModal.show({ title: '新增' });
};
const handleEdit = (record) => {
  proxy.$refs.bannerModal.show({ title: '编辑', ...record });
};
const modelOk = () => {
  getList(dataSource.params);
};
</script>
