<template>
  <PageContainer>
    <a-card :bordered="false">
      <FormSearch
        :formItems="formItems"
        :formData="formState"
        @searchForm="searchForm"
        @clearForm="clearForm"
        :more-span="8"
      >
        <template #more>
          <a-col>
            <a-form-item label="佣金范围" name="options">
              <a-input-group compact>
                <a-input-number
                  v-model:value="formState.startCommission"
                  :min="0.01"
                  style="width: 100px;"
                  placeholder="最小值"
                />
                <a-form-item-rest>
                  <a-input
                    style="
                      width: 32px;
                      border-left: 0;
                      pointer-events: none;
                      background-color: #fff;
                    "
                    placeholder="~"
                    disabled
                  />
                </a-form-item-rest>
                <a-form-item-rest>
                  <a-input-number
                    v-model:value="formState.endCommission"
                    :min="formState.startCommission"
                    style="width: 100px;border-left: 0;"
                    placeholder="最大值"
                  />
                </a-form-item-rest>
              </a-input-group>
            </a-form-item>
          </a-col>
        </template>
      </FormSearch>

      <a-space style="margin-bottom: 20px">
        <a-button type="primary" @click="inviteChief"> 团长邀请码 </a-button>
        <a-button type="primary" @click="identityMA"> 新增团长 </a-button>
      </a-space>

      <a-table
        ref="table"
        size="default"
        row-key="userId"
        :columns="columns"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="handleDetail(record)">详情</a>
              <!-- <a @click="handleEdit(record)">编辑</a> -->
              <a @click="deleteSub(record, index)" style="color: #ff4d4f">取消团长身份</a>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <span>{{ text === 0 ? '正常' : '停用' }}</span>
          </template>
          <template v-else-if="column.key === 'image'">
            <a-image :width="40" :src="record.avatar || avatar" />
          </template>
          <template v-else-if="column.key === 'sex'">
            <span>{{ sexText(text) }}</span>
          </template>
        </template>
      </a-table>

      <ChiefEditModal ref="chiefEditModal" @finish="modalOk" />
      <ChiefInviteModal ref="chiefInviteModal" @finish="inviteModalOk" />
      <ChiefMAModal ref="chiefMAModal" @finish="maModalOk" />
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, computed, h } from 'vue';
import { FormSearch } from '@/components';
// import { userList, userDetail, userDelete } from '@/api/customer.js';
import { mpUserList, mpUserDelete } from '@/api/regiment.js';
import ChiefEditModal from './components/ChiefEditModal.vue';
import avatar from '/src/assets/images/avatar.jpg';
import ChiefInviteModal from './components/ChiefInviteModal.vue';
import ChiefMAModal from './components/ChiefMAModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '团长编号',
    dataIndex: 'userNo',
    // customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '团长账号',
    dataIndex: 'userName',
  },
  {
    title: '团长头像',
    dataIndex: 'avatar',
    key: 'image',
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
    title: '团长状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '累计佣金',
    dataIndex: 'commission',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
];

const formItems = [
  {
    type: 'text',
    label: '团长编号',
    value: 'userNo',
  },
  {
    type: 'text',
    label: '手机号',
    value: 'phone',
  },
  {
    type: 'select',
    label: '状态',
    value: 'status',
    options: [
      { label: '正常', value: 0 },
      { label: '停用', value: 1 },
    ],
  },
  // {
  //   type: 'text',
  //   label: '佣金范围',
  //   value: 'range',
  //   width: 4,
  // },
];

const formState = reactive({
  userNo: undefined,
  phone: undefined,
  status: undefined,
  startCommission: undefined,
  endCommission: undefined,
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

const sexText = computed(() => {
  return (value) => {
    // 0-未知 1-女 2-男
    if (value === null) return '未知';
    return ['未知', '女', '男'][value];
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
  formState.startCommission = undefined;
  formState.endCommission = undefined;
  searchForm();
};

const getList = (formData) => {
  loading.value = true;
  const requestParameters = Object.assign(
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  if (formState && formState.startCommission && formState.endCommission) {
    requestParameters.startCommission = formState.startCommission;
    requestParameters.endCommission = formState.endCommission;
  } else {
    requestParameters.startCommission = undefined;
    requestParameters.endCommission = undefined;
  }
  console.log(' request parameters:', requestParameters);
  mpUserList(requestParameters)
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleDetail = (record) => {
  proxy.$router.push({
    path: `/customer/chiefDeatil/${record.id}`, query: { id: record.userId },
  });
};
/// 逻辑操作
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

// 删除
const deleteSub = (record, index) => {
  proxy.$confirm({
    title: `确定取消该用户的团长身份吗？`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      mpUserDelete(record.id).then(() => {
        proxy.$message.success('删除成功');
        getList(dataSource.params);
      });
    },
  });
};

const handleEdit = (record) => {
  //   userDetail(record.id).then((res) => {
  proxy.$refs.chiefEditModal.show({ ...record });
  //   });
};
const modalOk = () => {
  clearForm();
};

// 团长邀请码
const inviteChief = () => {
  proxy.$refs.chiefInviteModal.show();
};

const inviteModalOk = (data) => {
  const list = [];
  for (let index = 0; index < data.length; index++) {
    list.push(h('div', data[index]));
  }
  proxy.$success({
    title: '生成成功！',
    content: h('div', {}, list),
    okText: '确定',
  });
};

const randomString = (length = 8) => {
  // 模拟随机字符串库
  const origin = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const max = origin.length; // 字符串t的长度，随机数生成最大值
  let result = '';
  for (let index = 0; index < length; index++) {
    // 随机生成长度为e的随机字符串拼接
    result += origin.charAt(Math.floor(Math.random() * max));
  }
  // 返回随机组合字符串
  return result;
};

// 新增团长
const identityMA = () => {
  proxy.$refs.chiefMAModal.show();
};

const maModalOk = () => {
  getList(dataSource.params);
};
</script>
