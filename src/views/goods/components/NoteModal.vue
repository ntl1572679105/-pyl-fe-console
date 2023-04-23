<template>
  <a-modal
    v-model:visible="visible"
    title="备注订单"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
    :z-index="900"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 6 }"
      :wrapper-col="{ xs: 24, md: 15 }"
      label-align="right"
    >
      <a-form-item label="备注内容" name="notes">
        <a-input v-model:value="formState.notes" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';

const formRef = ref();
const formState = reactive({
  notes: ''
});
const rules = {
  notes: [{ required: true, message: '请输入备注' }],
};

const loading = ref(false);
const visible = ref(false);
const show = (item) => {
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  if (item.logo) {
    fileList.value.push({
      status: 'done',
      url: item.logo,
    });
  }

};
// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
  });
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
</style>
