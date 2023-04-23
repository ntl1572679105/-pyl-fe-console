<template>
  <a-modal
    v-model:visible="visible"
    title="备注说明"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="800px"
    centered
    :bodyStyle="{
      height: '200px',
      'align-items': 'center',
      'justify-content': 'center',
    }"
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
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <a-form-item label=" 备注说明" name="remark">
        <a-textarea
          placeholder="输入内容"
          :maxlength="300"
          :rows="6"
          show-count
          v-model:value="formState.remark"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { Update, Detail } from '@/api/pb2b/rule.js';
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';

const visible = ref(false);
const emit = defineEmits(['finish']);
const { proxy } = getCurrentInstance();
const loading = ref(false);
const formRef = ref();

const show = (data) => {
  console.log(data);
  visible.value = true;
  formState.id = data.id;
  getDetail();
};

const formState = reactive({
  id: undefined,
  remark: '',
  description: undefined,
  result: undefined,
  ruleName: undefined,
});

const rules = {
  remark: [{ required: true, message: '请输入备注信息' }],
};

const handleCancel = () => {
  visible.value = false;
};
const getDetail = () => {
  loading.value = true;
  Detail(formState.id)
    .then((res) => {
      formState.remark = res.remark;
      formState.description = res.description;
      formState.result = res.result;
      formState.ruleName = res.ruleName;
    })
    .finally(() => {
      loading.value = false;
    });
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    console.log(values);
    const params = {
      id: formState.id,
      remark: values.remark,
      description: formState.description,
      result: formState.result,
      ruleName: formState.ruleName,
    };
    Update(params)
      .then(() => {
        proxy.$message.success('备注成功');
        visible.value = false;
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
<style lang="less" scoped></style>
