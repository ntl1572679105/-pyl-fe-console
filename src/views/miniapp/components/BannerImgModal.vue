<template>
  <div>
    <a-modal
      v-model:visible="visible"
      title="管理"
      @cancel="handleCancel"
      :destroy-on-close="true"
      :width="900"
      :z-index="988"
      centered
      @ok="handleOk"
    >
      <template #footer>
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
      </template>
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ xs: 18, md: 15 }"
        :wrapper-col="{ xs: 18, md: 18 }"
        label-align="right"
        layout="inline"
      >
        <a-form-item label="编号" name="id" style="display: none">
          <a-input v-model:value="formState.id" disable />
        </a-form-item>
        <a-form-item label="效果图" name="mainImgUrl">
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
        <a-form-item label="实例样图" name="status">
          <img src="@/assets/images/demo-banner.png" @click="handleView" style="cursor: pointer;height: 150px;" >
        </a-form-item>
        <a-form-item label="所在位置" name="sort">
          <img src="@/assets/images/demo-position.png" @click="handleView" style="cursor: pointer;height: 200px;" >
        </a-form-item>
      </a-form>
      <a-card :bordered="false" style="margin-left: 40px;color: #828181">
        备注: <br />
        1. 规格尺寸: 1125px * 1440 px。<br />
        2. 支持格式: 显示内容UI提供后, 产品原型对应修改。<br />
      </a-card>
    </a-modal>
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
  </div>
</template>

<script>
import { bgDeployEdit } from '@/api/miniapp.js';
import { Upload } from '@/api/common.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      mainImgUrl: '',
      link: '',
      sort: '',
      status: 1,
      id: undefined,
      title: '',
    });
    const rules = {
      link: [{ message: '请输入链接' }],
      mainImgUrl: [{ required: true, message: '请上传图片' }],
    };
    const previewVisible = ref(false);
    const previewImage = ref('');

    const loading = ref(false);
    const visible = ref(false);
    const uploading = ref(false);

    const fileList = ref([]);

    const show = (item) => {
      formState.mainImgUrl = item || '';
      visible.value = true;
      fileList.value = item
        ? [
            {
              status: 'done',
              url: item,
            },
          ]
        : [];
    };

    // 图片操作
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
      formState.mainImgUrl = '';
    };
    // // 预览图片  @preview="handlePreview"

    const handlePreview = (file) => {
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };
    const handleView = (file) => {
      console.log(file);
      previewImage.value = file.srcElement.currentSrc;
      previewVisible.value = true;
    }
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

    const handleUpload = ({ file }) => {
      console.log(file);
      const formData = new FormData();
      formData.append('file', file);
      uploading.value = true;
      Upload(formData)
        .then((res) => {
          fileList.value = [
            {
              status: 'done',
              url: res.fileUrl,
              name: res.fileName,
            },
          ];
          uploading.value = false;
          formState.mainImgUrl = res.fileUrl;
          formRef.value.validateFields();
        })
        .catch(() => {
          uploading.value = false;
          proxy.$message.error('图片上传失败，请重试');
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
        proxy.$confirm({
          title: '提示',
          content: '点击确认后，该效果图将替代原有效果图并展示在小程序上，是否确认修改？',
          onOk: () => {
            bgDeployEdit({ id: 9, mainImgUrl: values.mainImgUrl })
              .then(() => {
                proxy.$message.success('修改成功');
                emit('finish');
                visible.value = false;
              })
              .finally(() => {
                loading.value = false;
              });
          },
          onCancel: () => {
            loading.value = false;
          }
        });
      });
    };

    return {
      formRef,
      formState,
      rules,
      loading,
      visible,
      uploading,
      fileList,
      previewVisible,
      previewImage,
      show,
      handleCancel,
      handleOk,
      handleRemove,
      beforeUpload,
      handleUpload,
      handlePreview,
      handleCancelImg,
      handleView
    };
  },
};
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
</style>
