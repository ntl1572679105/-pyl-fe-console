<template>
  <a-modal
    v-model:visible="visible"
    title="物流信息"
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
      <a-button key="back" @click="Cancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ xs: 24, md: 6 }"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <!-- <a-form-item label="发货状态:" name="status">
        <a-select
          placeholder="请选择发货状态"
          v-model:value="formData.status"
          allowClear
          :options="options"
          @change="handleChange"
        />
      </a-form-item> -->

      <a-form-item label="物流公司" name="deliveryCode">
        <!-- <a-input v-model:value="formData.deliveryName" placeholder="填写物流公司" /> -->
        <a-select
          v-model:value="formData.deliveryCode"
          placeholder="选择物流公司"
          show-search
          @change="ChangeDelivery"
          :options="state.data"
          :filter-option="false"
          :not-found-content="state.fetching ? undefined : null"
          @search="fetchCompany"
        >
          <template v-if="state.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="手机号" v-if="formData.deliveryCode === 'SF'" name="receiverPhone">
        <a-input v-model:value="formData.receiverPhone" placeholder="填写手机号" />
      </a-form-item>
      <a-form-item label="物流单号" name="deliveryNo">
        <a-input v-model:value="formData.deliveryNo" placeholder="填写物流单号" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits, watch } from 'vue';
import { updateOrder, personUpdataDatil, logisticsList } from '@/api/order.js';
import { debounce } from 'lodash-es';

const visible = ref(false);
const loading = ref(false);
const { proxy } = getCurrentInstance();
const formRef = ref();
const show = (item) => {
  visible.value = true;
  Object.keys(formData).forEach((key) => {
    formData[key] = item[key] || undefined;
  });
};
const emit = defineEmits(['onfinsh']);
const formData = reactive({
  id: undefined,
  deliveryName: undefined, // 物流公司
  deliveryCode: [], // 物流公司编号
  deliveryNo: undefined, // 物流单号
});
// 下拉
// const handleChange = (val) => {
//   formData.status = val;
// };

const ChangeDelivery = (value, option) => {
  console.log(value, option);
  formData.deliveryName = option.label;
};

let lastFetchId = 0;
const state = reactive({
  data: [],
  fetching: false,
});
const fetchCompany = debounce((value) => {
  console.log('fetching ', value);
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;
  logisticsList({ name: value }).then((res) => {
    if (fetchId !== lastFetchId) {
      // for fetch callback order
      return;
    }
    state.data = res.map((item) => ({ label: item.name, value: item.code }));
    state.fetching = false;
  });
}, 300);
watch(formData.deliveryCode, () => {
  state.data = [];
  state.fetching = false;
});

// 重置表单
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
// const options = [
//   {
//     // 订单状态 0-待支付 1-已支付/待发货 2-已发货/待收货 3-待评价 4-已完成 5-已取消
//     label: '待支付',
//     value: 0,
//   },
//   {
//     label: '已支付/待发货',
//     value: 1,
//   },
//   {
//     label: '已发货/待收货',
//     value: 2,
//   },
//   {
//     label: '待评价',
//     value: 3,
//   },

//   {
//     label: '已完成',
//     value: 4,
//   },

//   {
//     label: '已取消',
//     value: 5,
//   },
// ];
const rules = {
  // status: [{ required: true, message: '请选择发货状态' }],
  receiverPhone: [{ required: true, message: '请输入手机号' }],
  deliveryCode: [{ required: true, message: '请选择物流公司' }],
  deliveryNo: [{ required: true, message: '请填写物流单号' }],
};

const apiType = ref('');
apiType.value = proxy.$route.meta.type;

// 修改物流信息
const handleOk = () => {
  // 表单验证
  // 表单验证通过name来形成keyvalue的形式
  formRef.value.validateFields().then((values) => {
    // console.log(values, 'values');
    updateOrder(apiType.value, formData)
      .then((res) => {
        loading.value = true;
        proxy.$message.success('修改成功');
        emit('onfinsh');
        visible.value = false;
        formRef.value.resetFields();
      })
      .catch(() => {
        // proxy.$message.error();
        // ('修改失败');
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
const Cancel = () => {
  visible.value = false;
};
defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
