<template>
  <a-modal
    v-model:visible="visible"
    title="详情"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 关闭 </a-button>
    </template>
    <a-form
      :model="formState"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="反馈类型">
        <span>{{ formState.type }}</span>
      </a-form-item>
      <a-form-item label="反馈信息">
        <span>{{ formState.info }}</span>
      </a-form-item>
      <a-form-item label="图片">
        <a-image-preview-group v-if="formState.imgUrls">
          <a-image
            v-for="(item, index) in formState.imgUrls"
            :key="index"
            :src="item"
            style="margin-right: 15px"
          />
        </a-image-preview-group>
      </a-form-item>
      <a-form-item label="状态">
        <span>{{ ['待解决', '已完成', '已关闭'][formState.status] }}</span>
      </a-form-item>
      <a-form-item label="联系方式">
        <span>{{ formState.contact }}</span>
      </a-form-item>
      <a-form-item label="备注">
        <span>{{ formState.remark }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue';

export default {
  setup() {
    const formState = reactive({
      type: '',
      info: '',
      imgUrls: [],
      status: 0,
      contact: '',
      createTime: '',
      remark: '',
    });

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

    return {
      formState,
      visible,
      show,
      handleCancel,
    };
  },
};
</script>
