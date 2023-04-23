<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
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
      <a-form-item :label="formState.title" name="cancelType">
        <a-textarea
          placeholder="输入内容"
          :maxlength="300"
          :rows="6"
          show-count
          v-model:value="formState.cancelType"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import {
  updateOrder,
  orderList,
  orderListDatil,
  updateorderAfterSales,
  orderAfterSalesDeatil,
  personListDeatil,
  personUpdataDatil,
  personorderAfterSalesList,
  personupdateorderAfterSales,
} from '@/api/order.js';
import {
  reactive,
  ref,
  getCurrentInstance,
  defineExpose,
  onMounted,
  defineProps,
  defineEmits,
} from 'vue';

const visible = ref(false);
const type = ref();
const { proxy } = getCurrentInstance();
const show = (data) => {
  visible.value = true;
  type.value = data.type;
  formState.id = data.id;
  formState.cancelType = ''
  if (data.type == 'returnsale') {
    formState.title = '关闭服务单';
  } else {
    formState.title = '关闭订单'
  }
};
const formRef = ref();
const loading = ref(false);
const formState = reactive({
  id: undefined,
  remark: '',
  cancelType: '',
});
const rules = {
  remark: [{ required: true, message: '请输入备注信息' }],
  cancelType: [{ required: true, message: '请输入关闭信息', trigger: 'change' }],
};
// 重置表单
const handleCancel = () => {
  visible.value = false;
  formRef.value.resetFields();
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type 

// 保存
const handleOk = () => {
  formRef.value
    .validateFields()
    .then((values) => {
      const api = type.value === 'order' ? updateOrder : updateorderAfterSales;
      const params = {
        id: formState.id,
        cancelType: 2,
        status: 5,
        remark: values.cancelType,
      };
      api(apiType.value, params)
        .then((res) => {
          loading.value = true;
          proxy.$message.success(formState.title + '成功');
          proxy.$emit('finish');
        })
        .finally(() => {
          loading.value = false;
        });
      visible.value = false;
    })
    .catch((err) => {
      console.log(err);
    });
};
defineExpose({
  show,
});
</script>
<style lang="less" scoped>
.content {
  display: flex !important;
}

:deep(.ant-modal .label) {
  height: 50px;
  line-height: 50px;
  background: #f0f2f5;
  text-align: center;
}
</style>
