<template>
  <a-modal v-model:visible="visible" title="微信登录" :destroy-on-close="true" :width="600">
    <div class="modal-container">
      <div class="content">
        <div id="wechat-container"></div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();
const visible = ref(false);

const show = () => {
  visible.value = true;
  console.log(1);
  proxy.$nextTick(() => {
    const obj = new WxLogin({
      id: 'wechat-container', // 需要显示的容器id
      appid: import.meta.env.VITE_APP_WX_APPID, // 公众号appid wx*******
      scope: 'snsapi_login', // 网页默认即可
      redirect_uri: encodeURIComponent(import.meta.env.VITE_APP_WX_REDIRECT_URL), // 授权成功后回调的url
      // redirect_uri: encodeURIComponent(`http://web.hobbykit.cn/#/user/dsa`), // 授权成功后回调的url
      state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
      style: 'black', // 提供"black"、"white"可选。二维码的样式
      href: '', // 外部css文件url，需要https
    });
  });
};

onMounted(() => {
  const oScript = document.createElement('script');
  oScript.type = 'text/javascript';
  oScript.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
  document.body.appendChild(oScript);
});

defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.modal-container {
  width: 528px;
  height: 458px;
  padding: 16px;
  // background-color: #fff;
  align-items: flex-end;

  .content {
    display: flex;
    flex-direction: column;
    width: 379px;
    margin: 26px auto;
  }
}
#wechat-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
