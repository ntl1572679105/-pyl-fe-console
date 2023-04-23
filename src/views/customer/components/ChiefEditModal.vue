<template>
  <a-modal
    v-model:visible="visible"
    title="编辑"
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
      name="usermodal"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>
      <a-form-item label="团长账号" name="userName">
        <a-input disabled v-model:value="formState.userName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input disabled v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="团长状态" name="status">
        <a-switch
          disabled
          v-model:checked="formState.status"
          :checkedValue="0"
          :unCheckedValue="1"
        />
      </a-form-item>
      <a-form-item label="团长性别" name="sex">
        <a-select
          placeholder="请选择"
          v-model:value="formState.sex"
          style="width: 100%"
          :options="sexList"
          disabled
        />
      </a-form-item>

      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="formState.remark"
          :rows="4"
          placeholder="请输入备注信息"
          show-count
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mpUserEdit } from '@/api/regiment.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import { formRules } from '@/utils/rules.js';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      phone: '',
      userName: '',
      status: 0,
      sex: undefined,
      avatar: '',
      remark: '',
    });
    const rules = {
      // phone: formRules('cellPhone'), // [{ required: true, message: '请输入' }],
      // userName: [{ required: true, message: '请输入' }],
      // status: [{ required: true, message: '请选择' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const uploading = ref(false);
    const sexList = [
      { label: '未知', value: 0 },
      { label: '女', value: 1 },
      { label: '男', value: 2 },
    ];

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.status = item.status || 0;
      formState.sex = item.sex || 0;
    };

    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        proxy.$message.success('修改成功');
        emit('finish');
        visible.value = false;
        console.log(values);
        mpUserEdit(values)
          .then(() => {
            proxy.$message.success('修改成功');
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
      sexList,
      show,
      handleCancel,
      handleOk,
      uploading,
    };
  },
};
</script>
