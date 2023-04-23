<template>
  <PageContainer>
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="小程序商城"><BannerList channelType="1" /></a-tab-pane>
        <a-tab-pane key="2" tab="pc商城"><BannerList channelType="2" /></a-tab-pane>
      </a-tabs>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue';
import BannerList from './BannerList.vue';

const activeKey = ref('1');
</script>
