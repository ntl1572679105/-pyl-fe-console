<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
      >
      </FormSearch>
      <div class="btnbox" style="margin-bottom: 20px">
        <a-button type="primary" @click="addVip"> 添加会员 </a-button>
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
              <!-- 自定义指令 -->
              <!-- <a @click="handleDetail(record)" v-permission="['order:detail']">详情</a> -->
              <a @click="handleDetail(record)">详情</a>

              <a @click="handleEdit(record)">编辑</a>

              <a @click="handleDelete(record)" style="color: orangered">删除</a>
            </a-space>
          </template>
          <template v-if="column.key === 'image'">
            <a-image :width="40" :src="record.avatar || avatar" />
          </template>
          <template v-if="column.key === 'sex'">
            <span>{{ sexText(text) }}</span>
          </template>
          <template v-if="column.key === 'jifen'">
            <span>{{ text || 0 }}</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
  <AddVipModal ref="addVipModal" @finish="clearForm"></AddVipModal>
  <EditVipModal ref="editVipModal" @finish="clearForm"></EditVipModal>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed } from 'vue';
import AddVipModal from './components/AddVipModal.vue';
import EditVipModal from './components/EditVipModal.vue';
import avatar from '/src/assets/images/avatar.jpg';
import { VipList, VipDetail, AddVip, DeleteVip } from '@/api/vip.js';
import { GetVipList, GetVipDetail, AddB2bVip, DeleteB2bVip } from '@/api/pb2b/vip.js';
import dayjs from 'dayjs';

const { proxy } = getCurrentInstance();
const formItems = [
  {
    type: 'text',
    label: '会员编号',
    value: 'userNo',
    width: 6,
  },
  {
    type: 'text',
    label: '手机号',
    value: 'phone',
    width: 5,
  },
  {
    type: 'rangedatepickerdisabled',
    label: '成为会员日期',
    value: 'createTime',
    width: 8,
  },
];
const columns = [
  {
    title: '会员编号',
    dataIndex: 'userNo',
    ellipsis: true,
    // key: 'tooltip',
  },
  {
    title: '会员账号',
    dataIndex: 'userName',
    ellipsis: true,
  },
  {
    title: '会员头像',
    dataIndex: 'avatar',
    key: 'image',
  },
  {
    title: '会员积分',
    dataIndex: 'integral',
    key: 'jifen',
  },
  {
    title: '可用积分',
    dataIndex: 'integral',
    key: 'jifen',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '成为会员时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
    align: 'center',
  },
];
const dataSource = reactive({
  list: [],
  params: {},
});
const formState = reactive({
  orderNo: undefined,
  status: undefined,
  payTime: undefined,
  userPhone: undefined,
  userName: undefined,
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
  getList();
};
// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  if (formData) {
    if (formData.createTime) {
      formData.startTime = dayjs(formData.createTime[0]).format('YYYY-MM-DD');
      formData.endTime = dayjs(formData.createTime[1]).format('YYYY-MM-DD');
    }
  }
  getList(formData);
};

const apiType = ref('');
apiType.value = proxy.$route.meta.type;

// 获得列表数据
const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
    { createTime: null },
  );
  console.log(' request parameters:', requestParameters);
  const api = apiType.value == '1' ? VipList : GetVipList;
  api(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

const loading = ref([]);
// 挂载
onMounted(() => {
  getList();
});

// 分页 逻辑操作
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const addVip = () => {
  proxy.$refs.addVipModal.show({ type: apiType.value });
};
const handleDetail = (record) => {
  if (apiType.value === 1) {
    proxy.$router.push({ path: `/vip/detail/${record.id}`, query: { type: apiType.value } });
  } else {
    proxy.$router.push({ path: `/vip/pb2b-detail/${record.id}`, query: { type: apiType.value } });
  }
};
const handleEdit = (record) => {
  proxy.$refs.editVipModal.show({ id: record.id, userNo: record.userNo, type: apiType.value });
  // const api = apiType.value === 1 ? VipDetail : GetVipDetail;
  // api({id: record.id}).then((res) => {
  //   proxy.$refs.editVipModal.show(res);
  // });
};

// 删除
const handleDelete = (record) => {
  console.log(record);
  proxy.$confirm({
    title: `确认删除该会员?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      const api = apiType.value === 1 ? DeleteVip : DeleteB2bVip;
      api(record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};

const sexText = computed(() => {
  return (value) => {
    // 0-未知 1-女 2-男
    if (value === null) return '未知';
    return ['未知', '女', '男'][value];
  };
});
</script>

<style lang="scss"></style>
