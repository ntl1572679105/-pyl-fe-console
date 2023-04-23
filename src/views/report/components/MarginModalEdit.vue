<template>
  <a-modal
    v-model:visible="visible"
    title="保证金"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ xs: 24, md: 6 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
      :rules="rules"
    >
      <a-form-item label="类型" name="type">
        <a-radio-group name="radioGroup" v-model:value="formState.type">
          <a-radio :value="1">缴纳保证金</a-radio>
          <a-radio :value="0">使用保证金</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="金额" name="amount">
        <a-input-number
          style="width: 100%"
          :min="1"
          v-model:value="formState.amount"
        />
      </a-form-item>
      <a-form-item label="添加说明" name="remark">
        <a-input v-model:value="formState.remark" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted, defineExpose } from 'vue';
import { AddMargin, UpdateMargin } from '@/api/pb2b/margin.js'
const { proxy } = getCurrentInstance();
const formRef = ref();
const loading = ref(false);
const visible = ref(false);

const show = (item) => {
  visible.value = true;
  formState.id = item.id;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
};
const marginFlag = ref()
const params = ref({})

const rules = {
  type: [{ required: true, message: '请选择' }],
  amount: [{ required: true, message: '请输入金额' }],
  remark: [{ required: true, message: '请输入说明' }],
};

onMounted(() => {
  getDetail();
});

const formState = reactive({
  addMargin: 0,
  useMargin: 0,
  remark: '',
  id: undefined,
});
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

const getDetail = (id) => {
  console.log(id);
  // supplierDetail(apiType.value, { id }).then((res) => {
  //   Object.keys(formState).forEach((key) => {
  //     formState[key] = res[key] || undefined;
  //   });
  //   formState.status = res.status || 0;
  // });
};

// 按钮操作
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    console.log(formState, values, 'values', 'formState');
    if (values.type) {
      params.value = {
        addMargin: values.amount,
        remark: values.remark,
        shopId: formState.id
      }
    } else {
      params.value = {
        useMargin: values.amount,
        remark: values.remark,
        shopId: formState.id
      }
    }
    AddMargin(params.value)
      .then((res) => {
        console.log(res);
        visible.value = false;
        proxy.$message.success('提交成功！')
        proxy.$emit('finish')
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const securityEdit = () => {
  console.log('securityEdit');
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
