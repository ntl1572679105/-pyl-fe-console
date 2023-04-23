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
      <a-button key="submit" type="primary" :loading="loading" @click="handleCancel">关闭</a-button>
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
      <a-form-item label="巡检日期">
        {{ formState.time }}
      </a-form-item>
      <a-form-item label="巡检人员">
        {{ formState.person }}
      </a-form-item>
      <a-form-item label="扣分事项">
        {{ formState.deductEvent }}
      </a-form-item>
      <a-form-item label="扣分分值">
        {{ formState.deductPoint }}
      </a-form-item>
      <a-form-item label="发起店铺">
        {{ formState.shopName }}
      </a-form-item>
      <a-form-item label="发起时间">
        {{formState.createTime}}
      </a-form-item>
      <a-form-item label="申诉状态">
        {{inpectionStatus(formState.status)}}
      </a-form-item>
      <a-form-item label="内容描述">
        {{'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, sed qui. Soluta delectus, quibusdam omnis saepe sequi ipsam reiciendis quaerat non itaque quia quae consectetur dolores sint veritatis quisquam voluptatibus.'}}
      </a-form-item>
      <a-form-item label="图片说明">
        <a-upload
          v-model:file-list="fileList"
          :customRequest="handleUpload"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          accept="image/png, image/jpeg, image/jpg"
          :before-upload="beforeUpload"
          @preview="handlePreview"
        >
          <div v-if="fileList.length < 1">
            <loading-outlined v-if="uploading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>

            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
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
import { reactive, ref, getCurrentInstance, defineExpose, computed } from 'vue';
import { Upload } from '@/api/common.js';

const { proxy } = getCurrentInstance();
const formRef = ref();
const formState = reactive({
  id: '',
  time: '',
  title: '',
  person: '',
  shopName: '',
  createTime: '',
  description: '',
  status: '',
  deductEvent: '',
  deductPoint: '',
});

const loading = ref(false);
const visible = ref(false);
const previewVisible = ref(false);
const previewImage = ref('');
const uploading = ref(false);
const imgchange = ref();
const fileList = ref([]);
const show = (item) => {
  console.log(item);
  visible.value = true;
  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] || undefined;
  });
  fileList.value = [];
  fileList.value.push({url: 'https://public-biz.oss-cn-hangzhou.aliyuncs.com/pyl/docker/ff75390995db45c6a8d3639b629862d4.png'})
  fileList.value.push({url: 'https://public-biz.oss-cn-hangzhou.aliyuncs.com/pyl/docker/a7a18be423fe4bfb95ce951c0ee5507e.jpg'})
  
  // introImgUrls.value = [];
  formState.status = item.status || 0;
  formState.deductEvent = '门口有垃圾';
  formState.deductPoint = 2;
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
// const changeIntroImages = (images) => {
//   formState.introImgUrls = images;
// };

const inpectionStatus = computed(() => {
  // 巡检人员状态 0-待审核 1-审核中 2-审核通过 3-已驳回
  return (value) => {
    return ['待审核', '审核中', '审核通过', '已驳回'][value];
  };
});

const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;

    const api = values.id ? shopUpdate : shopAdd;
    const params = { ...values };
    if (imgchange.value) {
      // 交换顺序
      // const imgArr = values.introImgUrls;
      const { oldIndex } = imgchange.value.moved;
      const { newIndex } = imgchange.value.moved;
      const newArr = [];
      imgArr[oldIndex] = imgArr.splice(newIndex, 1, imgArr[oldIndex])[0];
      // params.introImgUrls = imgArr;
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
