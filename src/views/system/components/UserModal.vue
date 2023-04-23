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
      name="usermodal"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="userId" style="display: none">
        <a-input v-model:value="formState.userId" disabled />
      </a-form-item>

      <a-form-item label="手机号码" name="phone">
        <a-input v-model:value="formState.phone" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户名称" name="userName">
        <a-input v-model:value="formState.userName" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户密码" name="password" v-if="!formState.userId">
        <a-input-password v-model:value="formState.password" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="用户状态" name="status">
        <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
      </a-form-item>
      <a-form-item label="角色类型" name="roleIdList">
        <a-select
          mode="multiple"
          placeholder="请选择"
          v-model:value="formState.roleIdList"
          style="width: 100%"
        >
          <a-select-option v-for="(item, index) in roleOptions" :key="index" :value="item.roleId">
            {{ item.roleName }}
          </a-select-option>
        </a-select>
      </a-form-item>
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
import { userAdd, userEdit } from '@/api/user.js';
// import { roleList } from '@/api/common.js';
import { roleList } from '@/api/role';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue';
import { formRules } from '@/utils/rules.js';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const mapRef = ref(null);
    const formState = reactive({
      title: '',
      userId: undefined,
      phone: '',
      userName: '',
      status: 0,
      roleIdList: [],
      remark: '',
    });
    const rules = {
      phone: formRules('cellPhone'), // [{ required: true, message: '请输入' }],
      userName: [{ required: true, message: '请输入' }],
      status: [{ required: true, message: '请选择' }],
      password: [{ required: true, message: '请输入' }],
      roleIdList: [{ required: true, message: '请选择' }],
    };

    const loading = ref(false);
    const visible = ref(false);
    const roleOptions = ref([]);

    const show = (item) => {
      console.log(item);
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.status = item.status || 0;
    };

    onMounted(() => {
      getRoleList();
    });
    const getRoleList = () => {
      roleList().then((res) => {
        roleOptions.value = res.data;
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
        const api = values.userId ? userEdit : userAdd;
        const content = values.userId ? '修改成功' : '新增成功';
        api(values)
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
      mapRef,
      formState,
      rules,
      loading,
      visible,
      roleOptions,
      show,
      handleCancel,
      handleOk,
    };
  },
};
</script>
