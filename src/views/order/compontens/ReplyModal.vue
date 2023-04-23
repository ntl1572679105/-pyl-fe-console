<template>
  <a-modal
    v-model:visible="visible"
    title="回复评价"
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
      :label-col="{ xs: 24, md: 4 }"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <a-form-item label="回复评价" name="replyRemark">
        <a-textarea
          placeholder="输入内容"
          :maxlength="300"
          :rows="6"
          show-count
          v-model:value="formState.replyRemark"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { UpdateComment, CommentUpdate } from '@/api/order.js';
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';

const visible = ref(false);
const emit = defineEmits(['onfinsh']);
const { proxy } = getCurrentInstance();

const loading = ref(false);
const formRef = ref();
const show = (data) => {
  console.log(data);
  visible.value = true;
  formState.id = data;
};
const formState = reactive({
  id: undefined,
  replyRemark: '',
});

const rules = {
  replyRemark: [{ required: true, message: '请输入评价信息' }],
};

const handleCancel = () => {
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    const api = proxy.$route.meta.type != null ? CommentUpdate : UpdateComment;
    const params = {
      id: formState.id,
      replyRemark: values.replyRemark,
    };
    api(proxy.$route.meta.type ? proxy.$route.meta.type : undefined, params)
      .then(() => {
        proxy.$message.success('留言回复成功');
        visible.value = false;
        emit('onfinsh');
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
