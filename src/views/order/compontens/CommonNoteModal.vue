<template>
  <a-modal
    v-model:visible="visible"
    title="备注订单"
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
      <a-form-item label=" 备注订单" name="remark">
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
import {
  updateOrder,
  personUpdataDatil,
  updateorderAfterSales,
  orderListDatil,
  orderAfterSalesDeatil,
} from '@/api/order.js';
import { reactive, ref, getCurrentInstance, defineExpose} from 'vue';
const visible = ref(false);
const { proxy } = getCurrentInstance();
const type = ref('');
const loading = ref(false);
const formRef = ref();
const show = (data) => {
  visible.value = true;
  type.value = data.type;
  formState.id = data.id;
  getDeatil();
};
const formState = reactive({
  id: undefined,
  remark: '',
});

const rules = {
  remark: [{ required: true, message: '请输入备注信息' }],
};

const handleCancel = () => {
  visible.value = false;
};
const getDeatil = () => {
  loading.value = true;
  const api = type.value === 'order' ? orderListDatil : orderAfterSalesDeatil;

  api(apiType.value, formState.id)
    .then((res) => {
      formState.remark = res.remark;
    })
    .finally(() => {
      loading.value = false;
    });
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    console.log(values);
    const params = {
      id: formState.id,
      remark: values.remark,
    };
    const api = type.value === 'order' ? updateOrder : updateorderAfterSales;
    api(apiType.value, params)
      .then((res) => {
        proxy.$message.success('备注成功');
        visible.value = false;
        proxy.$emit('finish');
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
