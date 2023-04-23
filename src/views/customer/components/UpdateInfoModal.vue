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
      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" style="width: 100%" />
      </a-form-item>
      <a-form-item label="生日" name="birthday">
        <a-date-picker format="YYYY-MM-DD" style="width: 100%" v-model:value="formState.birthday" />
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-select placeholder="请选择" v-model:value="formState.sex" :options="supplierList">
        </a-select>
      </a-form-item>
      <a-form-item label="用户状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea
          placeholder="输入内容"
          :maxlength="300"
          :rows="4"
          show-count
          v-model:value="formState.remark"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { userDetail, userEdit } from '@/api/customer.js';
import { reactive, ref, getCurrentInstance, defineEmits, defineExpose } from 'vue';
import { formRules } from '@/utils/rules.js';
import dayjs from 'dayjs';
const { proxy } = getCurrentInstance();
const formRef = ref();
const formState = reactive({
  id: undefined,
  phone: '',
  birthday: '',
  sex: '',
  remark: '',
  status: '',
});
const rules = {
  phone: formRules('cellPhone'),
  status: [{ required: true, message: '请选择用户状态' }],
  birthday: [{ required: true, message: '请选择生日' }],
  sex: [{ required: true, message: '请选择性别' }],
};
const emit = defineEmits(['finish']);
const loading = ref(false);
const visible = ref(false);
const uploading = ref(false);

const fileList = ref([]);

const show = (id, data) => {
  visible.value = true;
  formState.id = id;
  getDetail(formState.id);
};
const getDetail = (id) => {
  loading.value = true;
  userDetail(id)
    .then((res) => {
      Object.keys(formState).forEach((key) => {
        formState[key] = res[key];
      });
      formState.birthday = res.birthday ? dayjs(res.birthday) : '';
    })
    .finally(() => {
      loading.value = false;
    });
};
// 0-未知 1-女 2-男
const supplierList = [
  {
    value: 0,
    label: '未知',
  },
  {
    value: 1,
    label: '女',
  },
  {
    value: 2,
    label: '男',
  },
];

// 按钮操作
const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    values.birthday = values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : '';
    console.log(values, 'values');
    userEdit({ ...values })
      .then((res) => {
        proxy.$message.success('修改成功');
        emit('finish')
        visible.value=false
        // console.log(res, 'res');
      })
      .finally(() => {
        loading.value = false;
      });
  });
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
</style>
