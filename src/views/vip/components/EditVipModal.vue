<template>
  <a-modal
    v-model:visible="visible"
    title="编辑"
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
      name="usermodal"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>
      <a-form-item label="会员账号" name="userNo">
        <a-input v-model:value="formState.userNo" placeholder="请输入" disabled />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <!-- <a-form-item label="会员昵称" name="nickName">
        <a-input v-model:value="formState.nickName" placeholder="请输入" />
      </a-form-item> -->
      <!-- <a-form-item label="会员状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item> -->
      <a-form-item label="会员生日" name="birthday">
        <a-date-picker style="width: 100%" format="YYYY-MM-DD" v-model:value="formState.birthday" />
      </a-form-item>
      <a-form-item label="会员性别" name="sex">
        <a-select
          placeholder="请选择"
          v-model:value="formState.sex"
          style="width: 100%"
          :options="sexList"
        />                    
      </a-form-item>
      <!-- <a-form-item label="会员头像" name="avatar">
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
      </a-form-item> -->

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
import { UpdateB2bVip, GetVipDetail } from '@/api/pb2b/vip';
import { UpdateVip, VipDetail } from '@/api/vip';
import { reactive, ref, getCurrentInstance } from 'vue';
import { formRules } from '@/utils/rules.js';
import { Upload } from '@/api/common.js';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      phone: '',
      userName: '',
      nickName: '',
      // status: 0,
      birthday: undefined,
      sex: undefined,
      avatar: '',
      remark: '',
    });
    const rules = {
      phone: formRules('cellPhone'), // [{ required: true, message: '请输入' }],
      // userNo: [{ required: true, message: '请输入' }],
      // status: [{ required: true, message: '请选择' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const uploading = ref(false);
    const apiType = ref({});
    const sexList = [
      { label: '未知', value: 0 },
      { label: '女', value: 1 },
      { label: '男', value: 2 },
    ];
    const fileList = ref([]);

    const show = (item) => {
      formState.id = item.id;
      formState.userNo = item.userNo;
      apiType.value = item.type;
      visible.value = true;
      getDetail(formState.id)
    };
    const getDetail = (id) => {
      loading.value = true;
      const api = apiType.value === 1 ? VipDetail : GetVipDetail;
      api({id: id})
      .then((res) => {
        Object.keys(formState).forEach((key) => {
          formState[key] = res[key];
        });
        formState.birthday = res.birthday ? dayjs(res.birthday) : '';
      })
      .finally(() => {
        loading.value = false;
      });
    }

    // 图片操作
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
      formState.avatar = '';
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
          formState.avatar = res.fileUrl;
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
        // values.birthday = values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : '';
        const api = apiType.value === 1 ? UpdateVip : UpdateB2bVip;
        console.log(values);
        api(values)
          .then(() => {
            proxy.$message.success('修改成功');
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
      sexList,
      uploading,
      fileList,
      show,
      handleCancel,
      handleOk,
      handleRemove,
      beforeUpload,
      handleUpload,
    };
  },
};
</script>
