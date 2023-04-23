<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :title="formState.title"
      @cancel="handleCancel"
      :destroy-on-close="true"
      :width="600"
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
        :label-col="{ xs: 24, md: 8 }"
        :wrapper-col="{ xs: 24, md: 18 }"
        label-align="right"
      >
        <a-form-item label="编号" name="id" style="display: none">
          <a-input v-model:value="formState.id" disable />
        </a-form-item>
        <a-form-item label="商品编号或者链接" name="link">
          <a-input
            v-model:value="formState.link"
            placeholder="请输入"
            style="width: 80%"
            :maxlength="500"
          />
        </a-form-item>
        <a-form-item label="封面图片" name="imgUrl">
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
        <a-form-item label="排序" name="sort">
          <a-input-number
            placeholder="请输入"
            :precision="0"
            :min="0"
            :max="99999"
            v-model:value="formState.sort"
            style="width: 80%"
          />
        </a-form-item>
      </a-form>
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
import { bannerAdd, bannerEdit } from '@/api/miniapp.js';
import { Upload } from '@/api/common.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { formRules } from '@/utils/rules.js';
export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      imgUrl: '',
      link: '',
      sort: '',
      status: 1,
      id: undefined,
      title: '',
    });
    const rules = {
      link: [{ message: '请输入链接' }],
      imgUrl: [{ required: true, message: '请上传图片' }],
    };
    const previewVisible = ref(false);
    const previewImage = ref('');

    const loading = ref(false);
    const visible = ref(false);
    const uploading = ref(false);

    const fileList = ref([]);

    const show = (item) => {
      visible.value = true;
      Object.assign(formState, { imgUrl: '', link: '', sort: '', status: 1, id: undefined }, item);

      fileList.value = item.imgUrl
        ? [
            {
              status: 'done',
              url: item.imgUrl,
              name: item.imgUrl,
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
      formState.imgUrl = '';
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
          formState.imgUrl = res.fileUrl;
          formRef.value.validateFields();
        })
        .catch(() => {
          uploading.value = false;
          proxy.$message.error('图片上传失败，请重试');
        });
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
        const api = values.id ? bannerEdit : bannerAdd;
        const content = values.id ? '修改成功' : '新增成功';
        api(apiType.value, values)
          .then(() => {
            proxy.$message.success(content);
            emit('finish');
            visible.value = false;
          })
          .finally(() => {
            loading.value = false;
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
