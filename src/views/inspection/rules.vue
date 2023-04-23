<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      ></FormSearch>
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button type="primary" @click="ruleAdd"> 添加规则 </a-button>
      </div>
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
        :dataSource="dataSource.list"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a @click="ruleEdit(record, index)">修改</a>
            <a @click="handleDelete(index)" style="color: orangered; margin-left: 10px">删除</a>
          </template>
          <template v-if="column.dataIndex === 'id'">
            <span v-if="index < 9">0{{ pagination.current - 1 }}{{ index + 1 }}</span>
            <span v-else>0{{ index + 1 }}</span>
          </template>
        </template>
      </a-table>
    </a-card>
    <AddRules
      ref="addRulesModal"
      :data="data"
      @edit="ruleEditModal"
      @finish="ruleAddModal"
    ></AddRules>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { FormSearch } from '@/components';
// import { List, Delete } from '@/api/pb2b/rule.js';
import AddRules from './components/AddRules.vue';
const { proxy } = getCurrentInstance();

const formItems = [
  {
    type: 'text',
    label: '巡检规则',
    value: 'ruleName',
  },
  {
    type: 'text',
    label: '分值',
    value: 'score',
  },
];
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    // ellipsis: true,
    width: 120,
  },
  {
    title: '巡检规则',
    dataIndex: 'ruleName',
    ellipsis: false,
  },
  {
    title: '分值',
    dataIndex: 'score',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];
const formState = reactive({
  id: '',
  ruleName: '',
  score: '',
});
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

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    },
    formData,
  );
  // List(requestParameters)
  // .then((res) => {
  // dataSource.list = res;
  // pagination.total = res.length;
  // })
  // .finally(() => {
  setTimeout(() => {
    dataSource.list = [
      {
        id: '001',
        ruleName: '进场人员随带车辆要在水产城指定的场地随意停放',
        score: '2',
      },
      {
        id: '002',
        ruleName: '交易水产品未严格按品种、规格分类',
        score: '10',
      },
      {
        id: '003',
        ruleName: '以次充好、掺杂使假、缺斤少两',
        score: '10',
      },
      {
        id: '004',
        ruleName: '恶意串通，捏造虚假供求和价格',
        score: '10',
      },
      {
        id: '005',
        ruleName: '故意散布虚假的、容易使人误解的信息',
        score: '10',
      },
      {
        id: '006',
        ruleName: '以势压人、强买强卖、欺行霸市以及敲诈勒索',
        score: '50',
      },
    ];
    loading.value = false;
  }, 1000);
  // });
};
const editId = ref();
const loading = ref(false);
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};
const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  getList();
};

const ruleAddModal = (data) => {
  dataSource.list.push({
    ruleName: data.ruleName,
    score: data.score,
  });
};
const ruleEditModal = (data) => {
  dataSource.list[editId.value] = { ruleName: data.ruleName, score: data.score };
};
const shopAdd = () => {
  proxy.$refs.addShopModal.show();
};
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const ruleAdd = () => {
  proxy.$refs.addRulesModal.show({ title: '新增' });
};

const ruleEdit = (record, index) => {
  editId.value = index;
  proxy.$refs.addRulesModal.show({ title: '修改', ...record, index });
};
const handleDelete = (index) => {
  proxy.$confirm({
    title: `确认删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      // Delete({ id: record.id })
      // .then(() => {
      proxy.$message.success('删除成功');
      dataSource.list.splice(index, 1);
      // searchForm();
      // })
      // .catch((e) => {
      // console.log(e)
      // });
    },
  });
};
</script>
<style lang="less" scoped></style>
