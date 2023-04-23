<template>
  <a-modal
    v-model:visible="visible"
    title="企业审核"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="reject" type="primary" :loading="loading" @click="handleOk(1)"
        >审核拒绝</a-button
      >
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk(2)"
        >审核通过</a-button
      >
    </template>
    <a-form
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.ids" disabled />
      </a-form-item>

      <a-form-item label="企业名称" name="companyName">
        <a-input v-model:value="formState.companyName" disabled />
      </a-form-item>
      <a-form-item label="统一信用代码" name="unifiedCreditCode">
        <a-input v-model:value="formState.unifiedCreditCode" disabled />
      </a-form-item>
      <a-form-item label="营业执照附件" name="businessLicenseUrls">
        <a-image-preview-group v-if="formState.businessLicenseUrls">
          <a-image
            :width="80"
            v-for="(item, index) in formState.businessLicenseUrls"
            :key="index"
            :src="item"
          />
        </a-image-preview-group>
      </a-form-item>
      <a-form-item label="法人姓名" name="legalName">
        <a-input v-model:value="formState.legalName" disabled />
      </a-form-item>
      <a-form-item label="法人手机" name="legalPhone">
        <a-input v-model:value="formState.legalPhone" disabled />
      </a-form-item>
      <a-form-item label="法人身份证" name="legalIdNo">
        <a-input v-model:value="formState.legalIdNo" disabled />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="formState.remark"
          :rows="4"
          placeholder="请输入备注信息"
          show-count
          :maxlength="300"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { companyVerifyUpdate } from '@/api/pb2b/goods.js';
import { reactive, ref, getCurrentInstance } from 'vue';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();

    const formState = reactive({
      id: '',
      companyName: '',
      unifiedCreditCode: '',
      businessLicenseUrls: [],
      legalName: '',
      legalPhone: '',
      legalIdNo: '',
      remark: '',
    });

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
    };

    // 按钮操作
    const handleCancel = () => {
      visible.value = false;
    };
    const handleOk = (status) => {
      loading.value = true;
      companyVerifyUpdate({ id: formState.id, remark: formState.remark, status })
        .then(() => {
          proxy.$message.success('审核成功');
          emit('finish');
          visible.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    };

    return {
      formState,
      loading,
      visible,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
