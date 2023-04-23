<template>
  <PageContainer>
    <a-card class="box" :bordered="false" v-for="(item, index) in dataSource" :key="index">
      <div class="title1">{{ item.title }}</div>
      <div class="boxcontent flex">
        <div class="item color_fff flex f_column" v-for="(j, k) in item.data" :key="k">
          <div class="name">{{ j.name }}<img :src="imgTool.getAssetsFile(`report-${j.id}@2x.png`)" /></div>
          <div class="value">{{ getNum(j) }}<span v-if="j.type"> /{{ j.type }}</span></div>
        </div>
      </div>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue';
import { summary , Pb2bsummary } from '@/api/report.js';
import imgTool from '@/utils/imgTool';
const { proxy } = getCurrentInstance();
const dataSource = reactive([
  {
    title: '商品信息',
    data: [
      {
        name: '商品数量',
        value: 0,
        id: 'chart1',
        type: '个'
      },
      {
        name: '上架商品数量',
        value: 0,
        id: 'onShelves',
        type: '个'
      },
      {
        name: '下架商品数量',
        value: 0,
        id: 'offShelves',
        type: '个'
      },
    ],
  },
  {
    title: '成交订单',
    data: [
      {
        name: '订单总金额',
        value: 0,
        id: 'rental',
        type: '元'
        // isDouhao: true,
      },
      {
        name: '订单总数',
        value: 0,
        id: 'orderAmount',
        type: '单'
      },
      {
        name: '成交总金额（元）',
        value: 0,
        id: 'safety',
        type: '元',
      },
      {
        name: '成交订单总数',
        value: 0,
        id: 'envelope',
        type: '单'
      },
    ],
  },

  {
    title: '退款订单',
    data: [
      {
        name: '退款总金额（元）',
        value: 0,
        id: 'refund',
        type: '元',
        // isDouhao: true,
      },
      {
        name: '退换商品总量',
        value: 0,
        id: 'refund1',
        type: '个',
        // isDouhao: true,
      },
      {
        name: '退换商品率',
        value: 0,
        unit: '%',
        id: 'chart',
      },
    ],
  },
]);
const getNum = (value) => {
  if (value.type) {
    let number = Number(value.value); //不转数字,"0.0"会转成".0"
    if (number !== 0) {
      //等于0的时候返回0
      let arr = String(number).split('.');
      let num = arr[0];
      let len = Math.ceil(num.length / 3) * 3;
      let result = num.padStart(len, '0').match(/\d{3}/g).join(',').replace(/^0+/, '');
      return arr[1] ? result + '.' + arr[1] : result;
    } else {
      return 0;
    }
  } else if (value.unit) {
    return value.value + value.unit;
  } else {
    return value.value;
  }
};
const getData = () => {
  const api=proxy.$route.meta.type==1?summary:Pb2bsummary
  api().then((res) => {
    dataSource[0].data[0].value = res.productNumber;
    dataSource[0].data[1].value = res.onShelveGoods;
    dataSource[0].data[2].value = res.downShelveGoods;

    dataSource[1].data[0].value = res.orderTotalAmount;
    dataSource[1].data[1].value = res.orderTotalNumber;
    dataSource[1].data[2].value = res.orderAmount;
    dataSource[1].data[3].value = res.orderNumber;

    dataSource[2].data[0].value = res.refundItemAmount;
    dataSource[2].data[1].value = res.refundItemNumber;
    dataSource[2].data[2].value = (res.refundRatio * 100).toFixed(2);

    proxy.$forceUpdate();
  });
};
onMounted(() => {
  getData();
});
</script>
<style scoped lang="less">
.flex {
  display: flex;
  align-items: center;
  justify-content: start;
}
.f_column {
  flex-direction: column;
}
.f_1 {
  flex: 1;
}
// .color_fff {
//   background: #fff;
// }

.title1 {
  font-size: 22px;
  color: #000000d9;
  height: 60px;
  font-family: zihun143-zhengkuchaojihei, zihun143;
  font-weight: 400;
  // line-height: 60px;
}
.box {
  border-radius: 2px;
  margin-bottom: 24px;
  .boxcontent {
    // color: rgb(242, 242, 242);
    // height: 169px;
    .item {
      background-color: #F5F6F8;
      height: 104px;
      border-radius: 2px;
      position: relative;
      width: 266px;
      margin-right: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .name {
        font-size: 14px;
        display: flex;
        color: #00000073;
        justify-content: space-between;
        width: 80%;
      }
      .value {
        font-size: 30px;
        color: #000000d9;
        // font-weight: 800;
        width: 80%;
        line-height: 38px;
        font-family: HelveticaNeue;
        span {
          font-family: PingFangSC;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: #000000d9;
        }
      }
      img {
        max-width: 24.5px;
        max-height: 28px;
      }
    }
  }
}
</style>
