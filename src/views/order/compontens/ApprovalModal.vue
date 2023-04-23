<template>
  <a-modal
    v-model:visible="visible"
    :title="type.data === 1 ? '审批通过' : type.data === 2 ? '审批否决' : ''"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="600px"
    centered
    :bodyStyle="{
      height: `${350 / type.data}px`,
      minHeight: '200px',
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
      :label-col="{ xs: 24, md: 4 }"
      :wrapper-col="{ xs: 24, md: 18 }"
      label-align="right"
      v-if="type.data == 1"
    >
      <div class="pass">
        <a-form-item label="收货地址" name="address">
          <a-input v-model:value="formState.address" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item label="联系姓名" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input v-model:value="formState.phone" placeholder="请输入"></a-input>
        </a-form-item>
        <a-form-item label="备注内容" name="auditRemark">
          <a-textarea
            placeholder="输入内容"
            :maxlength="300"
            :rows="4"
            show-count
            v-model:value="formState.auditRemark"
          />
        </a-form-item>
      </div>
    </a-form>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 10 }"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
      v-else
    >
      <div class="pass">
        <a-form-item label="否决订单，需要填写否决原因" name="auditRemark">
          <a-textarea
            placeholder="请填写否决订单原因"
            :maxlength="300"
            :rows="6"
            show-count
            v-model:value="formState.auditRemark"
          />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
<script setup>
import { updateorderAfterSales, getLast } from '@/api/order.js';
import { reactive, ref, getCurrentInstance, defineExpose, watch, defineEmits } from 'vue';

const visible = ref(false);
const { proxy } = getCurrentInstance();
// 1 审批通过 2 审批否决
const type = reactive({
  data: null,
});
const title = reactive({
  data: null,
});
const formState = reactive({
  id: undefined,
  auditRemark: '',
  address: '',
  name: '',
  phone: '',
});
const emit = defineEmits(['onfinsh']);
const formRef = ref();
const detail = ref();

const rules = {
  auditRemark: [{ required: true, max: 300, message: '请输入备注内容' }],
};

const show = (val, data) => {
  visible.value = true;
  type.data = val;
  formState.id = data;
  if (val === 1) {
    getLast(apiType.value).then((res) => {
      formState.auditRemark = res?.auditRemark;
      formState.address = res?.address;
      formState.name = res?.name;
      formState.phone = res?.phone;
    });
  }
};

const loading = ref(false);

const apiType = ref('');
apiType.value = proxy.$route.meta.type;

// 保存
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    // loading.value = true;
    const params = {
      status: type.data === 1 ? 1 : 6,
      // ...values,
      id: formState.id,
    };
    if (values.auditRemark.length > 300) {
      proxy.$message.warning("备注超出最大长度");
      return;
    }
    Object.keys(values).forEach((key) => {
      params[key] = values[key] || undefined;
    });
    updateorderAfterSales(apiType.value, params)
      .then((res) => {
        proxy.$message.success(type.data === 1 ? '审批通过' : '审批否决通过');
        visible.value = false;
        emit('onfinsh');
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

// 取消
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
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
