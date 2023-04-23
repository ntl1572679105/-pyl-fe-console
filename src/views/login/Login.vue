<template>
  <div class="main">
    <!-- <div class="title">普渔乐</div> -->
    <img src="@/assets/images/login-logo@2x.png" width="243" alt="" />
    <div class="tips">运营商平台登录</div>
    <a-tabs v-model:activeKey="activeKey" @tabClick="tabClick">
      <a-tab-pane key="1" tab="账号密码登录"
        ><a-form
          class="user-layout-login"
          :model="formState"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item name="loginName" :rules="[{ required: true, message: '请输入账号!' }]">
            <a-input
              size="large"
              type="text"
              placeholder="请输入账号"
              v-model:value="formState.loginName"
            >
              <template #prefix>
                <!-- <img src="@/assets/images/login-user.png" alt="tips" /> -->
                <user-outlined :style="{ color: '#1890FF', width: '16px' }" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password
              size="large"
              placeholder="请输入密码"
              v-model:value="formState.password"
            >
              <template #prefix>
                <!-- <img src="@/assets/images/login-password.png" alt="tips" /> -->
                <lock-outlined :style="{ color: '#1890FF', width: '16px' }" />
              </template>
            </a-input-password>
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

          <a-form-item style="margin-top: 16px">
            <a-button
              size="large"
              type="primary"
              html-type="submit"
              class="login-button"
              :loading="loginState.loginBtn"
              :disabled="loginState.loginBtn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form></a-tab-pane
      >
      <a-tab-pane key="2" tab="手机快捷登录" force-render
        ><a-form
          class="user-layout-login"
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

          <a-form-item name="phoneCode" :rules="[{ required: true, message: '请输入手机验证码!' }]">
            <a-input size="large" placeholder="手机验证码" v-model:value="formState.phoneCode">
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
          <a-form-item style="margin: 50px 0">
            <a-button
              size="large"
              type="primary"
              html-type="submit"
              class="login-button"
              :loading="loginState.loginBtn"
              :disabled="loginState.loginBtn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
    <WeChatModal ref="wechatModal"></WeChatModal>
    <div style="display: flex; justify-content: space-between; flex-direction: row; width: 320px">
      <div class="change-login">
        其他登录方式
        <img class="wechat-img" @click="loginWechat" src="@/assets/images/wechat.png" width="24" alt="" />
      </div>
      <div class="forgot" @click="forgot">忘记密码</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { timeFix } from '@/utils/util';
import { getCaptchaImage, getSendSmsCaptcha } from '@/api/login.js';
import WeChatModal from './components/WeChatModal.vue';
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
    WeChatModal,
  },
  setup() {
    // store/router/实例对象 操作
    const activeKey = ref('1');
    const { dispatch } = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    // form表单关联
    const formState = reactive({
      loginName: '',
      password: '',
      code: '',
      phoneCode: '',
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
        type: parseInt(activeKey.value),
      };
      dispatch('Login', loginParams)
        .then(() => {
          router.push({ path: '/' });
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            proxy.$notification.success({
              message: '欢迎',
              description: `${timeFix()}，欢迎回来`,
            });
          }, 1000);
        })
        .catch((err) => getCaptcha(err))
        .finally(() => {
          loginState.value.loginBtn = false;
        });
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

    // forgot
    const forgot = () => {
      // proxy.$info({
      //   closable: true,
      //   title: '忘记密码了？',
      //   content: '请联系管理员 电话0571-8699999',
      // });
      router.push({ path: `./reset` });
    };

    const tabClick = () => {
      Object.keys(formState).forEach((key) => {
        formState[key] = '';
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
        });
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

    // 组件加载后处理
    onMounted(() => {
      getCaptcha();
    });

    const loginWechat = () => {
      proxy.$refs.wechatModal.show();
    }

    // 返回操作对象
    return {
      loginState,
      captchaImageInfo,
      formState,
      isSend,
      count,
      timer,
      activeKey,
      onFinish,
      onFinishFailed,
      getCaptcha,
      forgot,
      tabClick,
      sendCode,
      loginWechat
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
  .title {
    font-size: 22px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    line-height: 30px;
    padding-top: 35px;
  }
  .tips {
    margin-top: 13px;
    font-size: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 20px;
    margin-bottom: 35px;
    letter-spacing: 15px;
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
