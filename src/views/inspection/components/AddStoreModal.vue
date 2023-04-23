<template>
  <a-modal
    v-model:visible="visible"
    title="新增门店"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    centered
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 7 }"
      :wrapper-col="{ xs: 24, md: 16 }"
      label-align="right"
    >
      <a-form-item label="门店名称" name="shopName">
        <a-input v-model:value="formState.shopName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="门店负责人" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="门店负责人手机号" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';
import { formRules } from '@/utils/rules.js';
const { proxy } = getCurrentInstance();
const formRef = ref();
const emit = defineEmits(['finish'])
const formState = reactive({
  shopName: '',
  name: '',
  phone: '',
});
const rules = {
  shopName: [{ required: true, message: '请输入门店名称' }],
  name: [{ required: true, message: '请输入负责人名称' }],
  phone:  formRules('cellPhone'),
};

const loading = ref(false);
const visible = ref(false);

const show = (item) => {
  visible.value = true;
  // Object.keys(formState).forEach((key) => {
  //   formState[key] = item[key] || undefined;
  // });
  // formState.status = item.status || 0;
};

// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const api = values.id ? '' : '';
    const content = '新增成功';
    // api(formState)
      // .then(() => {
        let data = values;
        proxy.$message.success(content);
        emit('finish', data);
        visible.value = false;
        formRef.value.resetFields();
      // })
      // .finally(() => {
        loading.value = false;
      // });
  });
};
defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.changeAddress {
  margin-left: 50px;
  color: red;
}
</style>
