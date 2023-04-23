<template>
  <a-modal
    v-model:visible="visible"
    title="数据导出"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="800px"
    :footer="null"
    centered
    :bodyStyle="{
      height: '400px',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    }"
  >
    <div class="main">
     
      <div class="btnbox" ref="btnbox" v-if="!showelement">
        <a-button type="primary" @click="downloadFile" style="margin-right: 20px"
          >下载导出文件</a-button
        >
        <a-button type="primary" @click="outputFileManage">导出文件管理</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, defineExpose } from 'vue';
const visible = ref(false);
const defaultPercent = ref(20);
let { proxy } = getCurrentInstance();
const showelement = ref(true);
const style = reactive({
  height: '500px',
  display: 'flex',
});

// defaultPercent.value = 0;
setInterval(() => {
//   defaultPercent.value = defaultPercent.value++;
//   showelement.value = false;
}, 300);

if (defaultPercent.value >= 99) {

  showelement.value = false;
} else {
  showelement.value = true;
}

const show = () => {
  visible.value = true;
};
const  handleCancel=()=>{
  visible.value = false
}
const downloadFile=()=>{

}
const outputFileManage=()=>{

}
defineExpose({
  show,
});
</script>

<style lang="less" scoped>
.product-container {
  display: flex;
  //   height: 800px;
  height: 60vh;

  .list-container {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    .list-tips {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.3);
      line-height: 12px;
      margin-bottom: 18px;
    }
    .list-length {
      color: #1890ff;
      padding: 0 5px;
    }
  }
}
</style>
