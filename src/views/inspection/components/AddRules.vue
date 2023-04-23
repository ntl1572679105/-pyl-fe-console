<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title + '巡检规则'"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    centered
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
      <a-form-item label="巡检规则" name="ruleName">
        <a-textarea
          placeholder="输入内容"
          :maxlength="200"
          :rows="5"
          show-count
          v-model:value="formState.ruleName"
        />
      </a-form-item>
      <a-form-item label="对应分值" name="score">
        <a-input-number :max="100" :min="1" v-model:value="formState.score" style="width: 120px" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';
// import { Add } from '@/api/pb2b/rule';

const { proxy } = getCurrentInstance();

const emit = defineEmits(['finish']);

const formRef = ref();
const formState = reactive({
  title: '',
  ruleName: undefined,
  score: undefined,
});

const loading = ref(false);
const visible = ref(false);
const show = (item) => {
  console.log(item);
  // if (item.query) {
  //   console.log(item.query);
  //   formState.ruleName = item.query.ruleName;
  //   formState.score = item.query.score;
  // }
  formState.title = item.title;
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
};

const rules = {
  ruleName: [{ required: true, message: '请输入规则名称' }],
  score: [{ required: true, message: '请输入处理结果' }],
};
// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const content = formState.title === '新增' ? '规则添加成功' : '规则修改成功';
    // const params = {
    //   score: formState.score,
    //   ruleName: formState.ruleName
    // };
    // Add(params)
    visible.value = false;
    formRef.value.resetFields();
    proxy.$message.success(content);
    // .then((res) => {
    let data = values;
    if (formState.title === '新增') {
      emit('finish', data);
    } else {
      emit('edit', data);
    }

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

<style lang="less" scoped></style>
