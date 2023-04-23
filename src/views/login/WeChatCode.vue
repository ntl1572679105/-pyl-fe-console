<template>
  <a-spin size="large" v-if="!visible" class="spin-box"></a-spin>
  <div class="main" v-if="visible">
    <!-- <div class="title">普渔乐</div> -->
    <img src="@/assets/images/login-logo@2x.png" width="300" alt="" />
    <div class="tips">运营商平台登录绑定</div>
    <a-form
      name="usermodal"
      class="user-layout-login"
      ref="formRef"
      :model="formState"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item name="phone" :rules="[{ required: true, message: '请输入手机号!' }]">
        <a-input
          size="large"
          type="text"
          placeholder="请输入手机号码"
          v-model:value="formState.phone"
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
        <a-input size="large" placeholder="请输入手机验证码" v-model:value="formState.smsCode">
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
          :loading="loading"
        >
          绑定
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { timeFix } from '@/utils/util';
import { WeChatToken, getWxCaptcha, getCaptchaImage, WxBind } from '@/api/login.js';
import storage from 'store';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { MobileOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const visible = ref(false);
const spinFlag = ref(true);

const formState = reactive({
  phone: '',
  code: '',
  smsCode: '',
  bindId: '',
  uuid: ''
});
const formRef = ref();

const isSend = ref(true);
const count = ref(0);
const TIME_COUNT = 60;
const timer = ref(false);

// 对象
const loginState = ref({
  time: 60,
  loginBtn: false,
});
const captchaImageInfo = ref({
  img: null,
  uuid: null,
});
// 表单验证通过
const onFinish = (values) => {
  console.log('success: ', values);
  loginState.value.loginBtn = true;
  handleOk();
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
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    const bindParams = {
      uuid: formState.uuid,
      bindId: formState.bindId,
      code: values.smsCode,
      phone: values.phone,
    };
    WxBind(bindParams)
      .then((res) => {
        storage.set(ACCESS_TOKEN, res.token, 7 * 24 * 60 * 60 * 1000);
        visible.value = false;
        proxy.$message.success('手机号绑定成功！');
        router.push({ path: '/' });
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          proxy.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`,
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
// 获取短信验证码
const sendCode = (formState) => {
  if (formState.phone && phoneVer(formState.phone)) {
    console.log(formState.phone);
    getWxCaptcha({ phone: formState.phone, code: formState.code, uuid: captchaImageInfo.value.uuid, bindId: formState.bindId  }).then((res) => {
      console.log(res);
      formState.uuid = res.uuid;
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

onMounted(() => {
  const { code } = route.query;
  // const json = storage.get('wechat-third');
  console.log(code);
  if (code) {
    // const params = JSON.parse(json);
    WeChatToken({ code, type: 1 })
      .then((res) => {
        spinFlag.value = false;
        console.log(res);
        if (res.bind) {
          storage.set(ACCESS_TOKEN, res.token, 7 * 24 * 60 * 60 * 1000);
          router.push({ path: '/' });
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            proxy.$notification.success({
              message: '欢迎',
              description: `${timeFix()}，欢迎回来`,
            });
          }, 1000);
        } else {
          proxy.$message.warning('当前未绑定手机号!');
          getCaptcha();
          setTimeout(() => {
            visible.value = true;
            formState.bindId = res.bindId;
          }, 500);
        }
        // router.replace({ path: '/cp-orderManage/list' });
      })
      .catch((err) => {
        console.log(err);
        // proxy.$message.error('二维码已失效，正在跳转到登录页面...');
        setTimeout(() => {
          router.replace({ path: '/user/login' });
        }, 1000);
      });
  } else {
    proxy.$message.error('登录失败，请重新登录');
    router.replace({ path: '/user/login' });
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-input-affix-wrapper-lg) {
  height: 40px;
  padding: 0 auto;
}
.main {
  width: 100%;
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
  margin-top: 20px;
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
