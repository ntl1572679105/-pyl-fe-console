<template>
  <a-modal
    v-model:visible="visible"
    title="新增会员"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="600px"
    centered
    :bodyStyle="{
      height: '200px',
      'align-items': 'center',
      'justify-content': 'center',
    }"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <a-form-item label="手机号" name="phone">
        <a-select
          v-model:value="formState.phone"
          allowClear
          show-search
          placeholder="请选择"
          optionFilterProp="label"
          style="width: 80%"
          :options="userSearch.data"
          @change="handleChange"
          @search="fetchUserList"
        />
      </a-form-item>
      <a-form-item label="会员名称">
        {{ formState.userName || '--待选择手机号--' }}
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { userList } from '@/api/customer.js';
import { VipList, AddVip } from '@/api/vip.js';
import { GetVipList, AddB2bVip } from '@/api/pb2b/vip.js';
import { debounce } from 'lodash-es';

import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';

const visible = ref(false);
const type = ref();
const { proxy } = getCurrentInstance();

const vipListOptions = ref([]);
const show = (data) => {
  visible.value = true;
  type.value = data.type;
  formState.id = data.id;
  formState.cancelType = '';
  fetchUserList();
};
const formRef = ref();
const loading = ref(false);
const formState = reactive({
  id: undefined,
  phone: '',
  userName: '',
});
const rules = {
  phone: [{ required: true, message: '请输入手机号' }],
};

const userSearch = reactive({
  data: [],
  fetching: false,
});

// 获取下拉菜单
var lastFetchId = 0;

const fetchUserList = debounce((value) => {
  console.log('fetching userList: ', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  userList({ phone: value, pageNum: 1, pageSize: 10 }).then((res) => {
    if (fetchId !== lastFetchId) return;
    userSearch.data = res.data.map((item) => ({
      label: item.phone,
        value: item.phone,
        title: item.userName,
    }));
    userSearch.fetching = false;
  });
}, 500);

// 重置表单
const handleCancel = () => {
  visible.value = false;
  formRef.value.resetFields();
};
// const apiType = ref('');
// apiType.value = proxy.$route.meta.type;

// 保存
const handleOk = () => {
  formRef.value
    .validateFields()
    .then((values) => {
      const api = type.value === 1 ? AddVip : AddB2bVip
      console.log(typeof(formState.phone));
      api({ phone: formState.phone })
        .then((res) => {
          loading.value = true;
          proxy.$message.success('会员新增成功');
          proxy.$emit('finish');
        })
        .finally(() => {
          loading.value = false;
        });
      visible.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleChange = (value, index) => {
  formState.phone = index.value;
  formState.userName = index.title;
};
defineExpose({
  show,
});
</script>
<style lang="less" scoped>
.content {
  display: flex !important;
}

:deep(.ant-modal .label) {
  height: 50px;
  line-height: 50px;
  background: #f0f2f5;
  text-align: center;
}
</style>
