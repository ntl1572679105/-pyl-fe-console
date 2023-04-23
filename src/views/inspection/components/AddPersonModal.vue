<template>
  <a-modal
    v-model:visible="visible"
    title="新增巡检人员"
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
      :wrapper-col="{ xs: 24, md: 15 }"
      label-align="right"
    >
      <a-form-item label="巡检人员名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="巡检人员手机号" name="phone">
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
  name: '',
  phone: '',
});
const rules = {
  name: [{ required: true, message: '请输入巡检人员名称' }],
  phone: formRules('cellPhone'),
};
const props = defineProps({
  data: {}
})

const loading = ref(false);
const visible = ref(false);

const show = (item) => {
  visible.value = true;
  // if (item) {
  //   Object.keys(formState).forEach((key) => {
  //     formState[key] = item[key] || undefined;
  //   });
  //   formState.status = item.status || 0;
  // } else {
    Object.keys(formState).forEach((key) => {
      formState[key] = '';
    });
  // }
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
    console.log(data);
    emit('finish', data);
    proxy.$message.success(content);
    visible.value = false;
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
