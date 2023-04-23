<template>
<PageContainer>
      <div class="main">
    <div class="one">
      <div class="item">
        <div class="mrms">今日订单数量(笔)</div>
        <div class="numbox">
          <div class="num">{{ dd.num }}</div>
          <div class="bfb">{{ dd.bfb }}</div>
          <div class="echarts" ref="ddline"></div>
        </div>
      </div>
    </div>
    <div class="two">
      <div class="title">快捷操作</div>
    </div>
  </div>
</PageContainer>

</template>

<script>
import { reactive, defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const dd = reactive({
      num: 2000,
      bfb: 15.9,
    });
    return {
      dd,
    };
  },
});
</script>
<style  lang="less"   scoped>
.one {
  display: flex;
}
.echarts {
  height: 60%;
}
</style>