<template>
  <a-modal
    v-model:visible="visible"
    title="新增违规"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
    :z-index="900"

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
      :wrapper-col="{ xs: 24, md: 15 }"
      label-align="right"
    >
      <a-form-item label="商品编号" name="productNo">
        <a-select
          v-model:value="formState.productNo"
          :options="violationOptions"
          show-search
        />
      </a-form-item>
      <a-form-item label="违规类型" name="violationId">
        <a-select
          v-model:value="formState.violationId"
          :options="typeOptions"
          @change="handleChange"
        />
      </a-form-item>
      <a-form-item label="处理结果">
        {{ formState.result ? formState.result : '' }}
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, proxyRefs } from 'vue';
import { goodsList } from '@/api/pb2b/goods.js';
import { addViolation } from '@/api/pb2b/violation.js';
import { List } from '@/api/pb2b/rule.js';

const formRef = ref();
const formState = reactive({
  productNo: '',
  violationId: '',
});
const { proxy } = getCurrentInstance();
const violationOptions = ref([]);
const typeOptions = ref([]);
const rules = {
  productNo: [{ required: true, message: '请输入商品编号' }],
  violationId: [{ required: true, message: '请选择违规类型' }],
};

const loading = ref(false);
const visible = ref(false);
const show = (item) => {
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  goodsList().then((res) => {
    let arr = []
    res.data.forEach((item) => {
      if (!item.status) {
        arr.push({
        value: item.productNo,
      });
      }
    });
    violationOptions.value = arr
  });
  List({pageSize: 9999}).then((res) => {
    let arr = []
    res.data.forEach((item) => {
      arr.push({
        label: item.ruleName,
        value: item.id,
        title: item.result
      });
    });
    typeOptions.value = arr
  });
};
// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};

const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const params = { ...formState }
    addViolation(params)
      .then((res) => {
        console.log(res);
        proxy.$message.success('新增成功');
        proxy.$emit('finish');
        visible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });

  });
};
const handleChange = (value, index) => {
  formState.result = index.title;
};
defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
