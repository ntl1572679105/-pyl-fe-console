t?<template>
  <PageContainer>
    <a-card :border="false">
      <FormSearch
        :formData="formState"
        :formItems="formItems"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button type="primary" @click="AddStore"> 添加新门店 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'id'">
            <span v-if="index > 8"> 0{{index+1}}</span>
            <span v-else>00{{index+1}}</span>
          </template>
          <template v-if="column.key === 'action'">
            <space>
              <a v-if="record.status" style="color: orangered" @click="stop(record)">停用</a>
              <a v-else @click="start(record)">启用</a>
            </space>
            <!-- <a-switch
            v-model:checked="record.status"
            :checkedValue="0"
            :unCheckedValue="1"
            @change="(checked) => changeStatus(checked, record, 1)"
            :loading="record.loading"
            /> -->
          </template>
        </template>
      </a-table>
      <AddStoreModal ref="addStoreModal" :data="data" @finish="storeAdd"></AddStoreModal>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { FormSearch } from '@/components';
import { ref, reactive, onMounted, getCurrentInstance } from 'vue';
import AddStoreModal from './components/AddStoreModal.vue'

const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'text',
    label: '门店ID',
    value: 'id',
  },
  {
    type: 'text',
    label: '门店负责人',
    value: 'name',
    width: '6'
  },
  {
    type: 'text',
    label: '门店分值',
    value: 'score',
    width: '6'
  },
];

const formState = reactive({
  id: '',
  name: '',
  score: '',
});

const columns = [
  {
    title: '门店ID',
    dataIndex: 'id',
  },
  {
    title: '门店名称',
    dataIndex: 'shopName',
  },
  {
    title: '门店负责人',
    dataIndex: 'name',
  },
  {
    title: '负责人手机号',
    dataIndex: 'phone',
  },
  {
    title: '门店分值',
    dataIndex: 'score',
  },
  {
    title: '操作',
    key: 'action',
  },
];

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

const loading = ref([]);

onMounted(() => {
  // searchForm();
  getList();
});

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  // getList();
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  // getList(formData);
};

const getList = () => {
  setTimeout(() => {
    loading.value = false;
    dataSource.list = [
      {
        id: '001',
        shopName: '王记渔获',
        name: '王力平',
        phone: '1569464641467',
        score: '98',
        status: 1
      },
      {
        id: '002',
        shopName: '老李海鲜',
        name: '李园洪',
        phone: '1569464641467',
        score: '100',
        status: 1
      },
      {
        id: '003',
        shopName: '张哥海鲜批发',
        name: '张冀中',
        phone: '1569464641467',
        score: '98',
        status: 1
      },
    ]
  }, 1000);
}

const stop = (record) => {
  proxy.$confirm({
    title: `确认停用该门店?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      // supplierDelete(apiType.value, { id: record.id }).then(() => {
      //   proxy.$message.success('删除成功');
      //   clearForm();
      // });
      record.status = !record.status;
      proxy.$message.success('停用成功');
    },
  })
}

const start = (record) => {
  proxy.$confirm({
    title: `确认启用该门店?`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      // supplierDelete(apiType.value, { id: record.id }).then(() => {
      //   proxy.$message.success('删除成功');
      //   clearForm();
      // });
      record.status = !record.status;
      proxy.$message.success('启用成功');
    },
  })
}

const AddStore = () => {
  proxy.$refs.addStoreModal.show();
}

const storeAdd = (data) => {
  dataSource.list.push({
    shopName: data.shopName,
    name: data.name,
    phone: data.phone,
    score: 100,
    status: 1
  })
}
</script>

<style lang="scss"></style>
