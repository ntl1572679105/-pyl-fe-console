<template>
  <a-modal v-model:visible="visible" title="审核" :destroy-on-close="true" :width="600">
    <template #footer>
      <a-space v-if="formState.auditStatus === 0 && isAdmin">
        <a-button type="primary" :loading="loading" @click="handleDone(1)">审批通过</a-button>
        <a-button key="edit" type="primary" :loading="loading" @click="handleDone(2)"
          >审批不通过</a-button
        >
      </a-space>
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
          <a-form-item label="统一社会信用代码" name="unifiedCreditCode">
            <span>{{ formState.unifiedCreditCode }}</span>
          </a-form-item>
          <a-form-item label="店铺名称" name="name">
            <span>{{ formState.name }}</span>
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
          <a-form-item label="详细介绍" name="detailIntroduction">
            <span>{{ formState.detailIntroduction }}</span>
          </a-form-item>
          <a-form-item label="店铺logo" name="logo">
            <img :src="formState.logo" class="image-item" @click="handlePreview(formState.logo)" />
          </a-form-item>
          <a-form-item label="简介" name="briefIntroduction">
            <span>{{ formState.briefIntroduction }}</span>
          </a-form-item>
          <a-form-item label="简介图片列表" name="introImgUrls">
            <div class="image-box">
              <img
                @click="handlePreview(url)"
                class="image-item"
                v-for="(url, index) in formState.introImgUrls"
                :key="index"
                :src="url"
              />
            </div>
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
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancelImg"
      centered
      width="500px"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-modal>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, defineExpose, computed } from 'vue';
import { shopAudit } from '@/api/pb2b/goods.js';
import dayjs from 'dayjs';
import store from '@/store';

const { proxy } = getCurrentInstance();
// 是否是超管
const isAdmin = computed(() => {
  return store.getters.userInfo.admin;
});

const loading = ref(false);
const visible = ref(false);

const previewVisible = ref(false);
const previewImage = ref('');

const formState = reactive({
  id: undefined,
  name: '',
  briefIntroduction: '',
  unifiedCreditCode: '',
  linkman: '',
  phone: '',
  address: '',
  detailIntroduction: '',
  logo: '',
  introImgUrls: [],
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
  loading.value = false;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  formState.auditStatus = item.auditStatus || 0;
};

const handleDone = (auditStatus) => {
  loading.value = true;
  shopAudit({ auditStatus, id: formState.id })
    .then(() => {
      visible.value = false;
      proxy.$emit('finish');
    })
    .finally(() => {
      loading.value = false;
    });
};

// 预览图片

const handlePreview = (url) => {
  if (!url) return;
  previewImage.value = url;
  previewVisible.value = true;
};
const handleCancelImg = () => {
  previewVisible.value = false;
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.image-item {
  object-fit: cover;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.image-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
