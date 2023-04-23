<template>
  <a-modal
    v-model:visible="visible"
    title="密码修改"
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
      <a-form-item label="当前密码" name="oldPassword">
        <a-input-password
          v-model:value="formState.oldPassword"
          :max-length="30"
          placeholder="请输入当前密码"
        />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input-password
          :max-length="30"
          oninput="value=value.replace(/[\W]/g,'')"
          onpaste="return false"
          v-model:value="formState.newPassword"
          placeholder="请输入新密码"
        />
      </a-form-item>
      <a-form-item label="确认新密码" name="renewPassword">
        <a-input-password
          oninput="value=value.replace(/[\W]/g,'')"
          onpaste="return false"
          :max-length="30"
          v-model:value="formState.renewPassword"
          placeholder="请再次输入新密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { changePassword } from '@/api/login.js';
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';


export default {
  setup() {
    const formRef = ref();
    let formState = reactive({
      oldPassword: '',
      newPassword: '',
      renewPassword: '',
    });
    
    const router = useRouter();
    const { dispatch } = useStore();

    const validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('请再次输入密码');
      } else if (value !== formState.newPassword) {
        console.log(value, formState.newPassword);
        return Promise.reject('两次密码不一致');
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      oldPassword: [{ required: true, message: '请输入当前密码' }],
      newPassword: [
        { required: true, message: '请输入新密码' },
        //   { validator: this.validatoruserPWD, trigger: 'blur' }
      ],
      renewPassword: [
        { required: true, message: '请再次输入新密码' },
        { validator: validatePass2, trigger: 'blur' },
      ],
    };

    const loading = ref(false);
    const visible = ref(false);

    const show = () => {
      visible.value = true;
    };
    const handleCancel = () => {
      formState = {};
      visible.value = false;
    };
    const handleOk = () => {
      console.log('13');
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        changePassword(values)
          .then(() => {
            message.success('密码修改成功, 请重新登录...');
            setTimeout(() => {
              dispatch('Logout').then(() => {
                router.push({ name: 'login' });
              });
            }, 500);
          })
          .catch(() => {
            loading.value = false;
          });
      });
    };

    return { formRef, formState, rules, loading, visible, show, handleCancel, handleOk };
  },
};
</script>

<style></style>
