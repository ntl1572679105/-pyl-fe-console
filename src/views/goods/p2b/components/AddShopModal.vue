<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
    :z-index="900"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 6 }"
      :wrapper-col="{ xs: 24, md: 15 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" />
      </a-form-item>
      <a-form-item label="统一社会信用代码" name="unifiedCreditCode">
        <a-input v-model:value="formState.unifiedCreditCode" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="店铺名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="联系人" name="linkman">
        <a-input v-model:value="formState.linkman" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="联系方式" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item v-if="formState.title === '新增店铺'" label="密码" name="password">
        <a-input-password v-model:value="formState.password" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="省份" name="province" style="display: none">
        <a-input v-model:value="formState.province" />
      </a-form-item>
      <a-form-item label="市" name="city" style="display: none">
        <a-input v-model:value="formState.city" />
      </a-form-item>
      <a-form-item label="区" name="district" style="display: none">
        <a-input v-model:value="formState.district" />
      </a-form-item>
      <a-form-item label="纬度" name="latitude" style="display: none">
        <a-input v-model:value="formState.latitude" />
      </a-form-item>
      <a-form-item label="经度" name="longitude" style="display: none">
        <a-input v-model:value="formState.longitude" />
      </a-form-item>
      <a-form-item label="详细地址" name="address">
        <a-input v-model:value="formState.address" disabled />
      </a-form-item>
      <span class="changeAddress">点击地图更换定位地址或者输入地址搜索位置</span>
      <TMapView @finish="choose"></TMapView>
      <a-form-item label="详细介绍" name="detailIntroduction">
        <a-input v-model:value="formState.detailIntroduction" />
      </a-form-item>
      <a-form-item label="店铺logo" name="logo">
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
      <a-form-item label="简介" name="briefIntroduction">
        <a-input v-model:value="formState.briefIntroduction" />
      </a-form-item>
      <a-form-item label="简介图片列表" name="introImgUrls">
        <ImageUpload
          v-if="detailLoading"
          :max="9"
          :multiple="true"
          v-model:imageUrls="formState.introImgUrls"
          :originUrls="formState.introImgUrls"
          @nrpreView="handlePreview"
          @draggableChange="tzdragChange"
          @formValidate="refreshFormValidate"
          @finish="changeIntroImages"
        ></ImageUpload>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
    </a-form>
    <!-- 预览图片 -->
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancelImg"
      centered
      width="500px"
      :z-index="999"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';
import { shopUpdate, shopAdd } from '@/api/pb2b/goods.js';
import TMapView from '@/components/TMap/index.vue';
import { formRules } from '@/utils/rules.js';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { Upload } from '@/api/common.js';
import ImageUpload from '@/components/UploadCustom/index.vue';

const { proxy } = getCurrentInstance();
const formRef = ref();
const formState = reactive({
  title: '',
  id: undefined,
  unifiedCreditCode: '',
  name: '',
  linkman: '',
  phone: '',

  province: '',
  district: '',
  city: '',
  address: '',
  latitude: '',
  longitude: '',

  detailIntroduction: '',
  briefIntroduction: '',
  introImgUrls: [],
  status: 0,
  logo: '',
  password: '',
});
const rules = {
  name: [{ required: true, message: '请输入店铺名称' }],
  unifiedCreditCode: formRules('unifiedCreditCodeRequired'),
  linkman: [{ required: true, message: '请输入店铺联系人' }],
  address: [{ required: true, message: '请输入详细地址', trigger: ['change', 'blur'] }],
  briefIntroduction: [{ required: true, message: '请输入简介' }],
  detailIntroduction: [{ required: true, message: '请输入详细介绍' }],
  logo: [{ required: true, message: '请上传店铺logo' }],
  introImgUrls: [{ required: true, message: '请上传店铺图片简介' }],
  password: [{ required: true, message: '请输入密码' }],
  phone: formRules('cellPhone'),
};

const loading = ref(false);
const visible = ref(false);
const previewVisible = ref(false);
const previewImage = ref('');
const uploading = ref(false);
const imgchange = ref();
const fileList = ref([]);
const introImgUrls = ref([]);
const detailLoading = ref(false);
const show = (item) => {
  visible.value = true;
  detailLoading.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  fileList.value = [];
  if (item.logo) {
    fileList.value.push({
      status: 'done',
      url: item.logo,
    });
  }

  introImgUrls.value = [];
  formState.status = item.status || 0;
};
// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const tzdragChange = (value) => {
  imgchange.value = value;
};
// // 预览图片  @preview="handlePreview"

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
const handleRemove = (file) => {
  fileList.value = [];

  formState.logo = '';
};
// 回调函数
const handleUpload = ({ file }) => {
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
// 重新触发表单验证
const refreshFormValidate = () => {
  formRef.value.validateFields();
};
const changeIntroImages = (images) => {
  formState.introImgUrls = images;
};


const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;

    const api = values.id ? shopUpdate : shopAdd;
    const content = values.id ? '修改成功' : '新增成功';
    const params = { ...values };
    if (imgchange.value) {
      // 交换顺序
      const imgArr = values.introImgUrls;
      const { oldIndex } = imgchange.value.moved;
      const { newIndex } = imgchange.value.moved;
      const newArr = [];
      imgArr[oldIndex] = imgArr.splice(newIndex, 1, imgArr[oldIndex])[0];
      params.introImgUrls = imgArr;
    }
    // console.log(values);
    api(params)
      .then(() => {
        console.log(params);
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
  formRef.value.validateFields(['address']);
  console.log(formState);
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
