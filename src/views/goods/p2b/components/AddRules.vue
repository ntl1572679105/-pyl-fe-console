<template>
  <a-modal
    v-model:visible="visible"
    title="新增规则"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
    :z-index="900"
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
      :wrapper-col="{ xs: 24, md: 15 }"
      label-align="right"
    >
      <a-form-item label="规则名称" name="ruleName">
        <a-input v-model:value="formState.ruleName" />
      </a-form-item>
      <a-form-item label="规则说明" name="description">
        <a-input v-model:value="formState.description" />
      </a-form-item>
      <a-form-item label="处理结果" name="result">
        <a-input v-model:value="formState.result" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';
import { Add } from '@/api/pb2b/rule';

const { proxy } = getCurrentInstance();

const emit = defineEmits(['finish']);

const formRef = ref();
const formState = reactive({
  ruleName: undefined,
  description: undefined,
  result: undefined,
});

const loading = ref(false);
const visible = ref(false);
const show = (item) => {
  visible.value = true;
  if (item) {
    Object.keys(formState).forEach((key) => {
      formState[key] = item[key] || undefined;
    });
  }
};

const rules = {
  ruleName: [{ required: true, message: '请输入规则名称' }],
  description: [{ required: true, message: '请输入规则说明' }],
  result: [{ required: true, message: '请输入处理结果' }]
}
// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const params = {
      result: formState.result,
      description: formState.description,
      ruleName: formState.ruleName
    };
    Add(params)
      .then((res) => {
        proxy.$message.success('规则添加成功');
        visible.value = false;
        formRef.value.resetFields();
        emit('finish');
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

<style lang="less" scoped>
</style>
