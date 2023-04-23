<template>
  <a-modal
    v-model:visible="visible"
    :title="type.data === 1 ? '审批通过' : type.data === 2 ? '审批否决' : ''"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="600px"
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
      :label-col="{ xs: 24, md: 10 }"
      :wrapper-col="{ xs: 24, md: 24 }"
      label-align="right"
    >
      <div class="pass">
        <a-form-item
          :label="
            type.data === 1 ? '备注内容' : type.data === 2 ? '否决订单，需要填写否决原因' : ''
          "
          name="auditRemark"
        >
          <a-textarea
            :placeholder="
              type.data === 1 ? '输入内容' : type.data === 2 ? '请填写否决订单原因' : ''
            "
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
import {
  Edit
} from '@/api/pb2b/dispute.js';
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
});
const emit = defineEmits(['onfinsh']);
const formRef = ref();
const detail = ref();
const show = (val, data) => {
  visible.value = true;
  type.data = val;
  formState.id = data;
};

const loading = ref(false);
// 保存
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const params = {
      status: type.data === 1 ? 1 : 6,
      ...values,
      id: formState.id,
    };
    Edit(params)
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
const rules = {
  auditRemark: [{ required: true, message: '请输入内容' }],
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
