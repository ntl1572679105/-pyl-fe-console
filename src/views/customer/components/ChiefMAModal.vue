<template>
  <a-modal
    v-model:visible="visible"
    title="新增团长"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      name="mamodal"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 8 }"
      :wrapper-col="{ xs: 24, md: 12 }"
      label-align="right"
    >
      <a-form-item label="请输入用户编号或手机号" name="keyword">
        <a-input v-model:value="formState.keyword" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mpUserAdd } from '@/api/regiment.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const { proxy } = getCurrentInstance();
    const formState = reactive({
      keyword: '',
    });
    const rules = {
      keyword: [{ required: true, message: '请输入' }],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      formState.keyword = '';
      //   Object.keys(formState).forEach((key) => {
      //     formState[key] = item[key] || undefined;
      //   });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        emit('finish');
        visible.value = false;
        mpUserAdd({number: formState.keyword})
          .then(() => {
            proxy.$message.success('设置成功');
            emit('finish');
            visible.value = false;
          })
          .finally(() => {
            loading.value = false;
          });
      });
    };

    return {
      formRef,
      formState,
      rules,
      loading,
      visible,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
