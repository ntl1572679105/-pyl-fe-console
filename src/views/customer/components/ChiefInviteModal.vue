<template>
  <a-modal
    v-model:visible="visible"
    title="生成邀请码"
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
      name="invitemodal"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 8 }"
      :wrapper-col="{ xs: 24, md: 12 }"
      label-align="right"
    >
      <a-form-item label="请输入生成个数" name="number">
        <a-input-number
          v-model:value="formState.number"
          placeholder="请输入"
          :min="0"
          :max="100"
          style="width: 100%"
        />
        <div>一次最多生成100个</div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { code } from '@/api/regiment.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const formRef = ref();
    const formState = reactive({
      number: '',
    });
    const rules = {
      number: [{ required: true, message: '请输入' }],
    };
    const { proxy } = getCurrentInstance();

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      formState.number = '';
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
      if (!formState.number) {
        proxy.$message.warning("生成个数不能为 0");
        return;
      }
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        visible.value = false;
        

        code({ number: formState.number })
          .then((res) => {
            // proxy.$message.success('修改成功');
            emit('finish', res);
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
