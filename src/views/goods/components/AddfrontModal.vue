<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" />
      </a-form-item>
      <a-form-item label="仓库名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="仓库类型" name="type">
        <a-input v-model:value="formState.type" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="详细地址" name="address">
        <a-input v-model:value="formState.address" placeholder="请输入" disabled />
      </a-form-item>
      <span class="changeAddress">点击地图更换定位地址或者输入地址搜索位置</span>
      <TMapView @finish="choose"></TMapView>
      <a-form-item label="管理员">
        <a-input v-model:value="formState.manager" />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <a-form-item label="前置仓logo" name="logo">
        <a-upload
          v-model:file-list="fileList"
          :customRequest="handleUpload"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          accept="image/png, image/jpeg, image/jpg"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 1">
            <loading-outlined v-if="uploading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>

            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="启用状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
    </a-form>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancelImg"
      centered
      width="500px"
      :z-index="1001"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';
import { preWarehouseAdd, preWarehouseEdit } from '@/api/goods.js';
import TMapView from '@/components/TMap/index.vue';
import { formRules } from '@/utils/rules.js';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { Upload } from '@/api/common.js';

const { proxy } = getCurrentInstance();
const formRef = ref();
const formState = reactive({
  title: '',
  id: undefined,
  name: '',
  type: '',
  address: '',
  latitude: '',
  longitude: '',
  province: '',
  city: '',
  manager: '',
  phone: '',
  status: 0,
  logo: '',
});
const rules = {
  name: [{ required: true, message: '请输入仓库名称' }],
  type: [{ required: true, message: '请输入仓库类型' }],
  address: [{ required: true, message: '请输入地址' }],
  logo: [{ required: true, message: '请上传前置仓logo' }],
  phone: formRules('cellPhone'),
};

const loading = ref(false);
const uploading = ref(false);
const visible = ref(false);
const fileList = ref([]);
const previewVisible = ref(false);
const previewImage = ref('');

const show = (item) => {
  console.log(item);
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  formState.status = item.status || 0;
  fileList.value = [];
  if (item) {
    if (item.logo) {
      fileList.value.push({
        status: 'done',
        url: item.logo,
      });
    }
  }
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;

// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const api = values.id ? preWarehouseEdit : preWarehouseAdd;
    const content = values.id ? '修改成功' : '新增成功';
    api(apiType.value, formState)
      .then(() => {
        proxy.$message.success(content);
        proxy.$emit('finish');
        visible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
const choose = (result) => {
  Object.assign(formState, result);
};
const handleRemove = (file) => {
  fileList.value = [];

  formState.logo = '';
};
// 回调函数
const handleUpload = ({ file }) => {
  console.log(file);
  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  Upload(formData)
    .then((res) => {
      uploading.value = false;
      fileList.value = [];
      fileList.value.push({
        status: 'done',
        name: res.fileName,
        url: res.fileUrl,
      });
      formState.logo = res.fileUrl;
      refreshFormValidate();
    })
    .catch(() => {
      uploading.value = true;
      handleRemove(file);
      refreshFormValidate();
      proxy.$message.error('图片上传失败，请重试');
    });
};

const refreshFormValidate = () => {
  formRef.value.validateFields();
};

const handlePreview = (file) => {
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};
const handleCancelImg = () => {
  previewVisible.value = false;
};

const beforeUpload = (file) => {
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    proxy.$message.error('文件不能大于20MB!');
  }
  return isLt20M;
};

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
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
