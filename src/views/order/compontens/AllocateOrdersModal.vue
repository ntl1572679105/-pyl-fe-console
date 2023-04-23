<template>
  <a-modal
    v-model:visible="visible"
    title="分配订单"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="600px"
    centered
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 4 }"
      :wrapper-col="{ xs: 24, md: 18 }"
      label-align="right"
    >
      <a-form-item label="编号" name="ids" style="display: none">
        <a-select v-model:value="formState.ids" disabled></a-select>
      </a-form-item>
      <a-form-item label="接收人员" name="supplierId">
        <a-select
          placeholder="请选择"
          v-model:value="formState.supplierId"
          :options="supplierList"
        ></a-select>
      </a-form-item>
      <a-form-item label="备注信息" name="remark">
        <a-textarea
          placeholder="输入内容"
          :maxlength="100"
          :rows="4"
          show-count
          v-model:value="formState.remark"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';
import { updateOrder, personUpdataDatil, orderAssign } from '@/api/order.js';

const formRef = ref();
const visible = ref(false);
const loading = ref(false);
const { proxy } = getCurrentInstance();

const supplierList = ref([]);
const formState = reactive({
  ids: [],
  supplierId: undefined,
  remark: '',
});
const rules = {
  supplierId: [{ required: true, message: '请选择' }],
  remark: [{ required: true, message: '请输入' }],
};

const emit = defineEmits(['finish']);

const show = (item, list) => {
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  supplierList.value = list;
  console.log(formState);
  visible.value = true;
};

const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;

    if (proxy.$route.meta.type == 1) {
      orderAssign(values)
        .then(() => {
          proxy.$message.success('分配订单成功');
          emit('finish');
          visible.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      updateOrder('ip', values)
        .then(() => {
          proxy.$message.success('分配订单成功');
          emit('finish');
          visible.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
