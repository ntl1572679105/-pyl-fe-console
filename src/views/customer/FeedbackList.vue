<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>

      <a-table
        ref="table"
        size="default"
        row-key="userId"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :scroll="{ x: 1410 }"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <template v-if="record.status === 0">
                <a @click="handleEdit(record, 1)" v-permission="['operator:mpFeedback:edit']"
                  >完成</a
                >
                <a
                  @click="handleEdit(record, 2)"
                  style="color: #ff4d4f"
                  v-permission="['operator:mpFeedback:edit']"
                  >关闭</a
                >
              </template>
              <a v-else @click="handleDetail(record)" v-permission="['operator:mpFeedback:detail']"
                >详情</a
              >
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ statusText(text) }}</span>
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'imgUrls'">
            <template v-if="text && text.length > 0">
              <a-image :width="40" :src="text[0]" />
            </template>
          </template>
        </template>
      </a-table>

      <FeedbackDetailModal ref="feedbackDetailModal" />
      <FeedbackRemarkModal ref="feedbackRemarkModal" @finish="modalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import { FormSearch } from '@/components';
import { feedbackList, feedbackDetail } from '@/api/customer.js';
import FeedbackDetailModal from './components/FeedbackDetailModal.vue';
import FeedbackRemarkModal from './components/FeedbackRemarkModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '编号',
    customRender: ({ index }) => `${index + 1}`,
    width: 80,
  },
  {
    title: '反馈类型',
    dataIndex: 'type',
    width: 100,
  },
  {
    title: '反馈信息',
    dataIndex: 'info',
    // ellipsis: true,
    // key: 'tooltip',
  },
  {
    title: '图片',
    dataIndex: 'imgUrls',
    key: 'imgUrls',
    width: 80,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: '联系方式',
    dataIndex: 'contact',
    width: 140,
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 130,
    fixed: 'right',
  },
];

const formItems = [
  {
    type: 'text',
    label: '联系方式',
    value: 'contact',
    width: 6,
  },
  {
    type: 'select',
    label: '状态',
    width: 6,
    value: 'status',
    options: [
      { label: '待解决', value: 0 },
      { label: '已完成', value: 1 },
      { label: '已关闭', value: 2 },
    ],
  },
];

const formState = reactive({
  contact: '',
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

const statusText = computed(() => {
  return (value) => {
    // 0-待解决 1-已完成 2-已关闭
    if (value === null) return '';
    return ['待解决', '已完成', '已关闭'][value];
  };
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
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  // console.log('loadData request parameters:', requestParameters);
  feedbackList(requestParameters)
    .then((res) => {
      console.log(res, 'res');
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
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const handleDetail = (record) => {
  feedbackDetail(record.id).then((res) => {
    proxy.$refs.feedbackDetailModal.show(res);
  });
};
const handleEdit = (record, type) => {
  const title = type === 1 ? '完成' : '关闭';
  const tips = type === 1 ? '备注内容' : '关闭原因';
  proxy.$refs.feedbackRemarkModal.show({ id: record.id, status: type, title, tips });
};
const modalOk = () => {
  getList(dataSource.params);
};
</script>
