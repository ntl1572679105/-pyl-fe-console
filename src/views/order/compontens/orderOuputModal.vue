<template>
  <a-modal
    v-model:visible="visible"
    title="数据导出"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="500"
    :style="{
      height: 500,
    }"
    :footer="null"
    centered
    @ok="handleOk"
  >
    <div class="ms" v-if="loading">批量{{ num }}导出数据，正在生成导出文件</div>
    <div class="btn">
      <a-button key="submit" type="primary" :loading="loading" @click="downLoadNum"
        >下载导出文件</a-button
      >
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, onMounted } from 'vue';
import { preWarehouseAdd, preWarehouseEdit } from '@/api/goods.js';
import TMapView from '@/components/TMap/index.vue';
import { formRules } from '@/utils/rules.js';
const { proxy } = getCurrentInstance();
const formRef = ref();
const loading = ref(false);
const visible = ref(false);
const num = ref();
const show = (item) => {
  visible.value = true;
};
onMounted(() => {});
const getList = () => {
  loading.value = true;
};
const downLoadNum = () => {
  visible.value = false;
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type

// 按钮操作
const handleCancel = () => {
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
  });
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.changeAddress {
  margin-left: 50px;
  color: red;
}
</style>
