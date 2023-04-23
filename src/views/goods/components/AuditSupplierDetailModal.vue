<template>
  <a-modal v-model:visible="visible" title="详情" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-button type="primary" @click="handleDone">关闭</a-button>
    </template>
    <a-card>
      <div style="margin-bottom: 20px">
        <a-form
          ref="formRef"
          :model="formState"
          :label-col="{ xs: 24, md: 6 }"
          :wrapper-col="{ xs: 24, md: 15 }"
          label-align="right"
        >
          <a-form-item label="供应商名称" name="name">
            <span>{{ formState.name }}</span>
          </a-form-item>
          <a-form-item label="供应商类型" name="type">
            <span>{{ formState.type }}</span>
          </a-form-item>
          <a-form-item label="联系人" name="linkman">
            <span>{{ formState.linkman }}</span>
          </a-form-item>
          <a-form-item label="联系方式" name="phone">
            <span>{{ formState.phone }}</span>
          </a-form-item>
          <a-form-item label="详细地址" name="address">
            <span>{{ formState.address }}</span>
          </a-form-item>
          <a-form-item label="供应商logo" name="logo">
            <a-image :width="40" :src="formState.logo" />
          </a-form-item>
        </a-form>
      </div>
      <a-card>
        <div v-if="formState.auditStatus === 0">
          审核状态：{{ auditStatusText(formState.auditStatus) }}
        </div>
        <template v-else>
          <div>审核人：超级管理员</div>
          <div>审核结果：{{ auditStatusText(formState.auditStatus) }}</div>
          <div>审核时间：{{ formState.auditTime || '-' }}</div>
        </template>
      </a-card>
    </a-card>
  </a-modal>
</template>

<script setup>
import { ref, reactive, defineExpose, computed } from 'vue';

const visible = ref(false);

const formState = reactive({
  id: undefined,
  name: '',
  type: '',
  linkman: '',
  phone: '',
  address: '',
  logo: '',
  auditTime: '',
  auditStatus: 0,
});

const auditStatusText = computed(() => {
  return (value) => {
    if (value === null || value === undefined) return '-';
    return ['待审核', '已通过', '未通过'][value];
  };
});

const show = (item) => {
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  formState.auditStatus = item.auditStatus || 0;
};

const handleDone = () => {
  visible.value = false;
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped></style>
