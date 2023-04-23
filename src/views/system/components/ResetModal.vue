<template>
  <a-modal
    v-model:visible="visible"
    title="重置密码"
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
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 18 }"
      label-align="right"
    >
      <p style="text-align: center">
        请输入"{{ formState.userName }}"的新的密码
      </p>
      <a-form-item label="编号" name="userId" style="display: none">
        <a-input v-model:value="formState.userId" disabled />
      </a-form-item>

      <a-form-item label="新密码" name="password">
        <a-input v-model:value="formState.password" placeholder="请输入" style="width: 80%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { userReset } from '@/api/user.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      password: '',
      userName: '',
      userId: undefined,
    });
    const rules = {
      password: [{ required: true, message: '请输入' }]
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        userReset(values)
          .then(() => {
            proxy.$message.success('重置成功');
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
      mapRef,
      formState,
      rules,
      loading,
      visible,
      show,
      handleCancel,
      handleOk
    };
  },
};
</script>

<style lang="less" scoped>

</style>
