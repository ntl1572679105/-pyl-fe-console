<template>
  <PageContainer>
    <a-card :bordered="false">
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
            <a @click="handleNotes(record)">备注</a>
            <a @click="handleDelete(record)" style="color: orangered; margin-left: 10px">删除</a>
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" />
          </template>
          <template v-else-if="column.dataIndex === 'approvalStatus'"> 审核通过 </template>
          <template v-else-if="column.key === 'status'">
            <a-space>
              <a-switch
                v-model:checked="record.status"
                :unCheckedValue="1"
                :checkedValue="0"
                @change="(checked) => changeStatus(checked, record)"
                :loading="record.loading"
              />
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <CommonNoteModal ref="noteModal" @finish="searchForm"></CommonNoteModal>
    <AddRules ref="addRulesModal" @finish="searchForm"></AddRules>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import CommonNoteModal from './components/CommonNoteModal.vue';
import { List, Delete } from '@/api/pb2b/rule.js';
import AddRules from './components/AddRules.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    ellipsis: true,
  },
  {
    title: '规则说明',
    dataIndex: 'description',
    ellipsis: true,
  },
  {
    title: '处理结果',
    dataIndex: 'result',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
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
  List(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};
const loading = ref(false);

const searchForm = () => {
  getList(dataSource.params);
};

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const handleNotes = (record) => {
  proxy.$refs.noteModal.show({ id: record.id });
};

const ruleAdd = () => {
  proxy.$refs.addRulesModal.show();
};

const handleDelete = (record) => {
  proxy.$confirm({
    title: `确认删除?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      Delete({ id: record.id })
        .then(() => {
          proxy.$message.success('删除成功');
          searchForm();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  });
};
</script>
<style lang="less" scoped></style>
