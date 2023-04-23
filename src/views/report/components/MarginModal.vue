<template>
  <a-modal v-model:visible="visible" title="保证金" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-button key="edit" type="primary" :loading="loading" @click="marginEdit"
        >编辑保证金</a-button
      >
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="保证金金额" name="remainMargin">
        <span v-if="formState?.remainMargin">{{ formState.remainMargin }} 元</span>
      </a-form-item>
      <a-form-item label="保证金记录" name="record"> </a-form-item>
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :data-source="dataSource.list"
        :pagination="pagination"
        :loading="loading"
        @change="tableChange"
        bordered
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'createTime'">
            {{ dayjs(text).format('YYYYMMDD') }}
          </template>
          <template v-if="column.dataIndex === 'addMargin'">
            <span v-if="record.addMargin > 0">+{{ record.addMargin }}元</span>
            <span v-else>-{{ record.useMargin }}元</span>
          </template>
          <template v-if="column.dataIndex === 'remainMargin'"> {{ text }}元 </template>
        </template>
      </a-table>
    </a-form>
  </a-modal>
  <MarginModalEdit ref="marignModalEdit" @finish="searchForm"></MarginModalEdit>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, defineExpose } from 'vue';
import MarginModalEdit from './MarginModalEdit.vue';
import { MarginDetail, MarginList } from '@/api/pb2b/margin.js';
import dayjs from 'dayjs';
const { proxy } = getCurrentInstance();
const formRef = ref();
const loading = ref(false);
const visible = ref(false);

const show = (item) => {
  console.log(item);
  formState.id = item.id;
  formState.shopId = item.shopId;
  formState.remainMargin = item.remainMargin;
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  formState.status = item.status || 0;
  getList();
};

const formState = reactive({
  id: undefined,
  remainMargin: undefined,
  addMargin: undefined,
  useMargin: undefined,
  shopId: undefined,
});
const columns = [
  {
    title: '日期',
    dataIndex: 'createTime',
  },
  {
    title: '保证金',
    dataIndex: 'addMargin',
  },
  {
    title: '剩余保证金',
    dataIndex: 'remainMargin',
  },
  {
    title: '说明',
    dataIndex: 'remark',
    ellipsis: true,
  },
];

const dataSource = reactive({
  list: [],
  params: {},
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 5,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const getList = (data) => {
  const params = {
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    ...data
  };
  MarginList(params, formState.id).then((res) => {
    dataSource.list = res.data;
    pagination.total = res.total;
  });
}

const marginEdit = () => {
  visible.value = false;
  proxy.$refs.marignModalEdit.show({ title: '编辑保证金', id: formState.id });
};

const searchForm = () => {
  visible.value = false;
  proxy.$emit('finish');
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
