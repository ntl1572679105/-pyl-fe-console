<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script>
// import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zhCN');

export default {
  data() {
    return {
      locale: zhCN,
    };
  },
};
</script>
<style lang="less">
.ant-input[disabled] {
  background-color: #ffffff !important;
  color: #595959 !important;
}
</style>
