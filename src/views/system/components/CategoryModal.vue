<template>
  <a-modal
    v-model:visible="visible"
    :title="type === 1 ? '新增一级目录' : type === 2 ? '新增二级目录' : '新增三级目录'"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
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
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 18 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disable />
      </a-form-item>

      <a-form-item label="名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" style="width: 80%" />
      </a-form-item>
      <a-form-item
      v-if="type===3"
        label="所属二级目录"
        name="parentId"
      >
        <a-select
          v-model:value="formState.parentId"
          allowClear
          placeholder="请选择"
          :options="options"
          style="width: 80%"
        />
      </a-form-item>
      <a-form-item label="展示图片" name="imgUrl">
        <a-upload
          v-model:file-list="fileList"
          :customRequest="handleUpload"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          accept="image/png, image/jpeg, image/jpg"
          :before-upload="beforeUpload"
          @remove="handleRemove"
        >
          <div v-if="fileList.length < 1">
            <loading-outlined v-if="uploading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>

            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

const { proxy } = getCurrentInstance();
const formRef = ref();
const formState = reactive({
  imgUrl: '',
  name: '',
  sort: '',
  status: 1,
  type: undefined,
  parentId: undefined,
  id: undefined,
  title: '',
});
const rules = {
  name: [{ required: true, message: '请输入名称' }],
  imgUrl: [{ required: true, message: '请上传图片' }],
};

const loading = ref(false);
const visible = ref(false);
const uploading = ref(false);
const options = ref([]);
const type = ref();
const fileList = ref([]);

const show = (val) => {
  visible.value = true;
  // val 是1 为一级目录 2 为2及目录 3为三级目录
  type.value = val;
};
defineExpose({ show });

// 图片操作
const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
  formState.imgUrl = '';
};

const beforeUpload = (file) => {
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    proxy.$message.error('图片不能大于20MB!');
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
  apiType.value = proxy.$route.meta.type 

// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    const api = values.id ? categoryEdit : categoryAdd;
    const content = values.id ? '修改成功' : '新增成功';
    api(apiType.value ,values)
      .then(() => {
        proxy.$message.success(content);
        emit('finish', { type: formState.type });
        visible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  });
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
