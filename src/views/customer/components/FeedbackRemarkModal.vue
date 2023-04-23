<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="600px"
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
      :label-col="{ xs: 24, md: 6 }"
      layout="vertical"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id"></a-input>
      </a-form-item>
      <a-form-item label="状态" name="status" style="display: none">
        <a-input v-model:value="formState.status"></a-input>
      </a-form-item>
      <a-form-item :label="formState.tips" name="remark">
        <a-textarea
          placeholder="输入内容"
          :maxlength="300"
          :rows="4"
          show-count
          v-model:value="formState.remark"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';
import { feedbackEdit } from '@/api/customer.js';

const formRef = ref();
const visible = ref(false);
const loading = ref(false);
const { proxy } = getCurrentInstance();
const emit = defineEmits(['finish']);

const show = (item) => {
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
};
const formState = reactive({
  id: undefined,
  status: undefined,
  remark: '',
  title: '',
  tips: '',
});

const rules = {
  remark: [{ required: true, message: '请输入' }],
};

const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};

const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    feedbackEdit(values)
      .then(() => {
        proxy.$message.success('操作成功');
        emit('finish', { status: values.status });
        visible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
