<template>
  <a-modal
    v-model:visible="visible"
    title="修改费用"
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

    <div class="content flex" style="display: flex; padding: 10px">
      <div class="f_1" style="flex: 1">
        <div
          class="label"
          style="height: 50px; line-height: 50px; background: #f0f2f5; text-indent: 10px"
        >
          商品合计金额
        </div>
        <div style="height: 50px; line-height: 50px; display: flex; align-items: center">
          <a-input-number
            prefix="￥"
            disabled
            v-model:value="detail.data.totalAmount"
            :precision="2"
            style="width: 80%"
          ></a-input-number>
        </div>
      </div>
      <div class="f_1" style="flex: 1">
        <div
          class="label"
          style="height: 50px; line-height: 50px; background: #f0f2f5; text-indent: 10px"
        >
          运费
        </div>
        <div style="height: 50px; line-height: 50px; display: flex; align-items: center">
          <a-input-number
            placeholder="请输入"
            :precision="2"
            prefix="￥"
            :min="0"
            v-model:value="formData.freightAmount"
            style="width: 80%"
          ></a-input-number>
        </div>
      </div>
      <div class="f_1" style="flex: 1">
        <div
          class="label"
          style="height: 50px; line-height: 50px; background: #f0f2f5; text-indent: 10px"
        >
          折扣金额
        </div>
        <div style="height: 50px; line-height: 50px; display: flex; align-items: center">
          <a-input-number
            placeholder="请输入"
            :precision="2"
            :min="0"
            @change="valChange"
            prefix="￥"
            :max="maxDiscountAmount"
            v-model:value="formData.discountAmount"
            style="width: 80%"
          ></a-input-number>
        </div>
      </div>
      <div class="f_1" style="flex: 1">
        <div
          class="label"
          style="height: 50px; line-height: 50px; background: #f0f2f5; text-indent: 10px"
        >
          积分抵扣
        </div>
        <div style="height: 50px; line-height: 50px; display: flex; align-items: center">
          <a-input-number
            disabled
            :precision="2"
            :min="0"
            prefix="￥"
            v-model:value="detail.data.deductionAmount"
            style="width: 80%"
          ></a-input-number>
        </div>
      </div>
      <div class="f_1" style="flex: 1">
        <div
          class="label"
          style="height: 50px; line-height: 50px; background: #f0f2f5; text-indent: 10px"
        >
          优惠券金额
        </div>
        <div style="height: 50px; line-height: 50px; display: flex; align-items: center">
          <a-input-number
            disabled
            :precision="2"
            :min="0"
            prefix="￥"
            v-model:value="detail.data.couponAmount"
            style="width: 80%"
          ></a-input-number>
        </div>
      </div>
      <div class="f_1" style="flex: 1">
        <div
          class="label"
          style="height: 50px; line-height: 50px; background: #f0f2f5; text-indent: 10px"
        >
          应付款金额
        </div>
        <div style="height: 50px; line-height: 50px; display: flex; align-items: center">
          <a-input-number
            :precision="2"
            prefix="￥"
            disabled
            v-model:value="amount"
            style="width: 80%"
          ></a-input-number>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { updateOrder, personUpdataDatil } from '@/api/order.js';
import { reactive, ref, getCurrentInstance, defineExpose, computed, watch, defineEmits } from 'vue';
const visible = ref(false);
let { proxy } = getCurrentInstance();
const detail = reactive({
  data: {},
});

const loading = ref(false);
const formRef = ref();
const show = (val) => {
  console.log(val);
  visible.value = true;
  // console.log(val, 'val');
  detail.data = val;
  formData.freightAmount = val.freightAmount;
};
const emit = defineEmits(['onfinsh']);
const formData = reactive({
  freightAmount: '', //运费
  discountAmount: '', //折扣金额
});
const amount = computed(() => {
  if (!detail.data.totalAmount) return;
  return (
    detail.data.totalAmount +
    formData.freightAmount -
    formData.discountAmount -
    detail.data.couponAmount -
    detail.data.deductionAmount
  );
});
const maxDiscountAmount = computed(() => {
  const result =
    detail.data.totalAmount + detail.data.couponAmount - detail.data.deductionAmount - 0.01;
  return result > 0 ? result : 0;
});
const handleCancel = () => {
  visible.value = false;
  formData.freightAmount = '';
  formData.discountAmount = '';
};
const rules = {
  close: [{ required: true, message: '请输入' }],
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const valChange = (e) => {
  console.log(e);
  if (e == maxDiscountAmount.value) {
    proxy.$message.warning('已达最大优惠金额');
  }
}
const handleOk = () => {
  const params = { ...formData };
  params.id = detail.data.id;
  updateOrder(apiType.value, params)
    .then((res) => {
      loading.value = true;
      proxy.$message.success('修改成功');
      visible.value = false;
      emit('onfinsh');
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
