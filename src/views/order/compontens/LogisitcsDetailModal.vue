<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button type="primary" @click="handleOk">关闭</a-button>
    </template>
    <a-timeline>
      <a-timeline-item v-for="(item, index) in formState.list" :key="index">
        <div class="list-item">
          <span><span v-if="item.opDesc">【{{ item.opDesc }}】</span>{{ item.opMessage }}</span>
          <span>{{ item.opTime }}</span>
        </div>
      </a-timeline-item>
    </a-timeline>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue';
//   import dayjs from 'dayjs';

export default {
  setup() {
    const formState = reactive({
      list: [],
    });

    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      formState.list = item;
    };

    const handleOk = () => {
      visible.value = false;
    };

    return {
      formState,
      visible,
      show,
      handleOk,
    };
  },
};
</script>

<style lang="less" scoped>
.list-item {
  display: flex;
  flex-direction: column;
  span:nth-child(1) {
    font-size: 16px;
    color: #000;
    line-height: 20px;
  }
  span:nth-child(2) {
    font-size: 12px;
    color: gray;
    margin-top: 12px;
  }
}
</style>
