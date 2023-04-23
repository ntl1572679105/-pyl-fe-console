<template>
  <a-modal
    v-model:visible="visible"
    title="收货人信息"
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
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 6 }"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <a-form-item label="收货人姓名:" name="name">
        <a-input v-model:value="formState.name" placeholder="填写收货人姓名" />
      </a-form-item>

      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="填写手机号码" />
      </a-form-item>
      <a-form-item label="收货地址" name="address">
        <a-input v-model:value="formState.address" placeholder="填写收货地址" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { updateOrder, personUpdataDatil } from '@/api/order.js';
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';
const visible = ref(false);
let { proxy } = getCurrentInstance();
const detail = reactive({
  data: {},
});
const show = (val) => {
  visible.value = true;
  detail.data = val;
};
const emit = defineEmits(['onfinsh']);
const formRef = ref();
const loading = ref(false);
const formState = reactive({
  name: '',
  phone: '',
  address: '',
});
const rules = {
  name: [{ required: true, message: '请填写收货人姓名' }],
  phone: [
    { required: true, message: '请填写手机号码' },
    {
      pattern: /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  address: [{ required: true, message: '请填写收货地址' }],
};
// 重置表单
const handleCancel = () => {
  visible.value = false;
  formRef.value.resetFields();
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type 

const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    const formaData = { ...values };
    loading.value = true;
    formaData.id = detail.data.id;
    updateOrder(apiType.value, formaData)
      .then((res) => {
        proxy.$message.success('修改成功');
        emit('onfinsh');
        visible.value = false;
        formRef.value.resetFields();
      })
      .catch(() => {})
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
