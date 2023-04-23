<template>
  <a-modal
    v-model:visible="visible"
    title="详情"
    :destroy-on-close="true"
    width="500px"
    centered
    :bodyStyle="{
      height: `600 - 200 * (3-${contractInfo.length})px`,
      maxHeight: '500px',
      'align-items': 'center',
      'overflow-y': 'auto',
      'justify-content': 'center',
    }"
  >
    <template #footer>
      <a-button key="submit" type="primary" :loading="loading" @click="handleClose">关闭</a-button>
    </template>
    <a-spin v-if="contractLoading"></a-spin>
    <div class="six" v-else="!contractLoading">
      <div class="contentbox-x flex" v-if="contractInfo.length" v-for="(item, index) in contractInfo" :key="index">
        <a-card style="width: 100%; margin: 10px 20px; border: 2px solid #f0f2f5">
          <div>合同编号： {{ item.contractNo }}</div>
          <div>合同类型： {{ item.contractType }}</div>
          <div>合同状态： {{ ComputedContractName(item.signStatus) }}</div>
          <!-- {{ contractImages[index] }} -->
          <div>
            合同名称：
            <!-- <a :href="contractImages[index]?.url" target="_blank" -->
            <a href="http://115.236.66.162:9446/onlinePreview?url=YB9jLavIFTS/7SYuih8wda6Qcptp7Fa6iZsPaoUjfzU7dX9L/GR3+UR25Hfu3gyKfaFulmU9ZlWukvgzQO/eTs6GnF+ePX29+DaMOosNlU1kjFGrtbjx21awk/l5Sjnx" target="_blank"
              >{{ item.contractName }} [在新标签页中打开]</a
            >
          </div>
        </a-card>
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits, computed } from 'vue';
import { contractList, contractUrl } from "@/api/pb2b/order.js";

const visible = ref(false);
const emit = defineEmits(['onfinsh']);
const { proxy } = getCurrentInstance();
const contractInfo = ref([]);
const contractImages = ref([]);
const contractLoading = ref(true);

const loading = ref(false);
// 合同签署状态：1：未签署；2：签署中；3：已签署
const ComputedContractName = computed(() => {
  return (value) => {
    return ['', '未签署', '签署中', '已签署'][value];
  };
});
const show = (data) => {
  console.log(data);
  contractInfo.value = [];
  visible.value = true;
  contractList({ userId: data.id }).then((contractResult) => {
    const contractImgUrls = [];
    const arr = [];
    // contractInfo.value = [contractResult];
    contractResult.forEach((item) => {
      contractInfo.value.push({
        contractNo: item.contractCode,
        contractName: item.contractName,
        contractType: item.contractType,
        signStatus: item.signStatus,
      });
    });
    console.log(contractInfo.value);
    // contractResult.forEach((item) => {
    //   arr.push(item.url);
    // })
    // contractImages.value = arr;
    // arr.push(new Promise((resolve, reject) =>  {
    //   contractUrl(contractResult.fileId)
    // }))
    contractResult.map((item) => {
      arr.push(item.fileId);
    });
    arr.forEach((item) => {
      contractImgUrls.push(
        new Promise((resolve) => {
          contractUrl(item).then((res) => {
            resolve(res);
          });
        }),
      );
    });
    Promise.all(contractImgUrls).then((values) => {
      contractLoading.value = false;
      contractImages.value = values;
    });
  });
  contractInfo.value.push({
    contractNo: 788092502727983104,
    contractName: '01.平台产品服务协议（个人）.doc',
    contractType: 12,
    signStatus: 3,
  });
  contractImages.value = 'http://115.236.66.162:9446/onlinePreview?url=YB9jLavIFTS/7SYuih8wda6Qcptp7Fa6iZsPaoUjfzU7dX9L/GR3+UR25Hfu3gyKfaFulmU9ZlWukvgzQO/eTs6GnF+ePX29+DaMOosNlU1kjFGrtbjx21awk/l5Sjnx';
};

const handleClose = () => {
  visible.value = false;
  
};

defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
