<template>
  <div class="main">
    <div class="title">
      重置密码
      <a-button
      size="large"
      class="back-button"
      :loading="loginState.loginBtn"
      :disabled="loginState.loginBtn"
      @click="login"
      type="text"
    >
      返回账号登录
    </a-button>
    </div>
    <a-form
      class="user-layout-login"
      ref="formRef"
      :model="formState"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item name="loginName" :rules="[{ required: true, message: '请输入手机号!' }]">
        <a-input
          size="large"
          type="text"
          placeholder="手机号码"
          v-model:value="formState.loginName"
        >
          <template #prefix>
            <mobile-outlined :style="{ color: '#1890FF', width: '16px' }" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码!' }]">
        <a-input
          class="login-form-input"
          size="large"
          type="text"
          placeholder="请输入右侧校验码"
          v-model:value="formState.code"
        >
          <template #prefix>
            <safety-certificate-outlined :style="{ color: '#1890FF', width: '16px' }" />
          </template>
          <template #suffix>
            <img class="code-img" :src="captchaImageInfo.img" alt="" @click="getCaptcha" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="smsCode" :rules="[{ required: true, message: '请输入手机验证码!' }]">
        <a-input size="large" placeholder="手机验证码" v-model:value="formState.smsCode">
          <template #prefix>
            <mail-outlined :style="{ color: '#1890FF', width: '16px' }" />
          </template>
          <template #suffix>
            <a-button class="code-msg" @click="sendCode(formState)" v-if="isSend" type="primary"
              >获取验证码</a-button
            ><a-button class="code-msg" v-if="!isSend" disabled>{{ count }}s </a-button>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password" :rules="[{ required: true, min: 6, max: 20, message: '请设置6~20位登录密码!' }]">
        <a-input
          size="large"
          type="text"
          placeholder="请设置6~20位登录密码"
          v-model:value="formState.password"
        >
          <template #prefix>
            <lock-outlined :style="{ color: '#1890FF', width: '16px' }" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="confirmPassword" :rules="[{ required: true, min: 6, max: 20, message: '请设置6~20位登录密码!' }]">
        <a-input
          size="large"
          type="text"
          placeholder="请再次输入新的登录密码"
          v-model:value="formState.confirmPassword"
        >
          <template #prefix>
            <lock-outlined :style="{ color: '#1890FF', width: '16px' }" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item style="margin: 50px 0">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginState.loginBtn"
          :disabled="loginState.loginBtn"
        >
          确定
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { timeFix } from '@/utils/util';
import { getCaptchaImage, getSendSmsCaptcha, resetPwd } from '@/api/login.js';
import {
  MobileOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    MobileOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    LockOutlined,
  },
  setup() {
    // store/router/实例对象 操作
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const formRef = ref();

    // form表单关联
    const formState = reactive({
      loginName: '',
      code: '',
      smsCode: '',
      password: '',
      confirmPassword: '',
    });

    // 对象
    const loginState = ref({
      time: 60,
      loginBtn: false,
    });
    const captchaImageInfo = ref({
      img: null,
      uuid: null,
    });

    const isSend = ref(true);
    const count = ref(0);
    const TIME_COUNT = 60;
    const timer = ref(false);

    // 表单验证通过
    const onFinish = (values) => {
      console.log('success: ', values);
      loginState.value.loginBtn = true;
      const loginParams = {
        ...values,
        userType: 0,
        uuid: captchaImageInfo.value.uuid,
        type: 1,
      };
      if (values.password !== values.confirmPassword) {
        proxy.$message.warning('两次输入密码不一致！')
        loginState.value.loginBtn = false;
        return
      }
      resetPwd(loginParams).then((res) => {
        console.log(res);
        proxy.$message.success('密码重置成功，正在跳转到登录页面...')
        formRef.value.resetFields();
        setTimeout(() => {
          router.replace({path: `/user/login`})
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        loginState.value.loginBtn = false;
      })
      // dispatch('Login', loginParams)
      //   .then(() => {
      //     router.push({ path: '/' });
      //     // 延迟 1 秒显示欢迎信息
      //     setTimeout(() => {
      //       proxy.$notification.success({
      //         message: '欢迎',
      //         description: `${timeFix()}，欢迎回来`,
      //       });
      //     }, 1000);
      //   })
      //   .catch((err) => getCaptcha(err))
      //   .finally(() => {
      //     loginState.value.loginBtn = false;
      //   });
    };
    // 表单验证失败
    const onFinishFailed = (errorInfo) => {
      console.log('error: ', errorInfo);
    };

    // 获取验证码
    const getCaptcha = () => {
      getCaptchaImage({}).then((res) => {
        captchaImageInfo.value = { img: `data:image/png;base64,${res.img}`, uuid: res.uuid };
      });
    };

    // 获取短信验证码
    const sendCode = (formState) => {
      if (formState.loginName && phoneVer(formState.loginName)) {
        console.log(formState.loginName);
        getSendSmsCaptcha({ phone: formState.loginName }).then((res) => {
          console.log(res);
          proxy.$message.warning('验证码已发送到您的手机，请留意您的短信');
          if (!timer.value) {
            count.value = TIME_COUNT;
            isSend.value = false;
            timer.value = setInterval(() => {
              if (count.value > 0 && count.value <= TIME_COUNT) {
                count.value--;
              } else {
                isSend.value = true;
                clearInterval(timer.value);
                timer.value = null;
              }
            }, 1000);
          }
        })
        .catch((e) => {
          console.log(e);
        })
      } else {
        proxy.$message.error('请正确输入手机号!');
      }
    };

    const phoneVer = (tel) => {
      var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      if (strTemp.test(tel)) {
        return true;
      }
      return false;
    };

    const login = () => {
      router.replace({path: `/user/login`})
    }

    // 组件加载后处理
    onMounted(() => {
      getCaptcha();
    });

    // 返回操作对象
    return {
      loginState,
      captchaImageInfo,
      formState,
      isSend,
      formRef,
      count,
      timer,
      onFinish,
      onFinishFailed,
      getCaptcha,
      sendCode,
      login
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.ant-input-affix-wrapper-lg) {
  height: 40px;
  padding: 0 auto;
}
.main {
  width: 66%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: 20px;
  .title {
    font-size: 22px;
    width: 80%;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    line-height: 30px;
    padding-top: 35px;
    float: left;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    
    button {
      color: #409eff;
      border: 0;
    }
  }
  .tips {
    margin-top: 13px;
    font-size: 40px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    margin-bottom: 35px;
  }
  .change-login {
    padding: 20px 0 56px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    .wechat-img {
      margin-left: 16px;
      cursor: pointer;
    }
  }
  .forgot {
    padding: 20px 0 56px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1890ff;
    line-height: 22px;
    cursor: pointer;
  }
}
.user-layout-login {
  flex: 1;
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .code-img {
    width: auto;
    height: 40px;
    cursor: pointer;
    transform: translate(12px, 0);
  }
  .code-msg {
    width: 100px;
    height: 40px;
    transform: translate(12px, 0);
  }
}

</style>
