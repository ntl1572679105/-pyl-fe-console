<template>
  <PageContainer>
    <a-card title="快捷入口" bordered>
      <div class="action-box">
        <div
          class="action-item"
          v-for="(item, index) in actions"
          :key="index"
          @click="$router.push(item.path)"
        >
          <img :src="item.image" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </a-card>
    <a-card :loading="loading" title="数据总览" bordered style="margin-top: 20px">
      <a-card class="box" :bordered="false" v-for="(item, index) in dataSource" :key="index">
        <div class="title1">{{ item.title }}</div>
        <div class="boxcontent flex">
          <div class="item color_fff flex f_column" v-for="(j, k) in item.data" :key="k">
            <div class="name">{{ j.name }}<img :src="imgTool.getAssetsFile(`report-${j.id}@2x.png`)" /></div>
            <div class="value">{{ getNum(j) }}<span v-if="j.type"> /{{ j.type }}</span></div>
          </div>
        </div>
      </a-card>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { summary } from '@/api/report.js';
import imgTool from '@/utils/imgTool';

const getImageUrl = (name) => {
  return new URL(`../../assets/images/workbench/${name}`, import.meta.url).href;
};

const actions = [
  { image: getImageUrl('ic-buying-1@2x.png'), name: '订单管理', path: '/cp-orderManage/list' },
  { image: getImageUrl('ic-buying-2@2x.png'), name: '订单统计', path: '/cp-reportOrder' },
  { image: getImageUrl('ic-buying-3@2x.png'), name: '商品销售', path: '/cp-reportGoods' },
  { image: getImageUrl('ic-buying-4@2x.png'), name: '添加会员', path: '/vip/list' },
  { image: getImageUrl('ic-buying-5@2x.png'), name: '新增商品', path: '/cp-goodsManage/add' },
  {
    image: getImageUrl('ic-buying-6@2x.png'),
    name: '新增前置仓',
    path: '/cp-frontmanagement/list',
  },
  { image: getImageUrl('ic-buying-7@2x.png'), name: '新增供应商', path: '/cp-supplierManage' },
];
const loading = ref(true);
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
  if (value.type === 1) {
    const number = Number(value.value); // 不转数字,"0.0"会转成".0"
    if (number !== 0) {
      // 等于0的时候返回0
      const arr = String(number).split('.');
      const num = arr[0];
      const len = Math.ceil(num.length / 3) * 3;
      const result = num.padStart(len, '0').match(/\d{3}/g).join(',').replace(/^0+/, '');
      return arr[1] ? `${result}.${arr[1]}` : result;
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
  summary()
    .then((res) => {
      console.log(res);
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
    })
    .finally(() => {
      loading.value = false;
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
  // background: #f0f2f5;
  // padding: 0 10px;
  border-radius: 2px;
  margin-bottom: 24px;
  .boxcontent {
    // color: rgb(242, 242, 242);
    // height: 169px;
    .item {
      background-color: #F5F6F8;
      width: 266px;
      height: 104px;
      border-radius: 2px;
      position: relative;
      margin-right: 20px;
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
        font-size: 22px;
        color: #000000d9;
        font-weight: 800;
        width: 80%;
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
// .box .item::before {
//   position: absolute;
//   content: '';
//   width: 8px;
//   height: 100%;
//   background: rgb(64, 158, 255);
//   left: 0%;
// }

.action-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    img {
      width: 60px;
      height: 60px;
      transition: all 0.2s ease-in;
      &:hover {
        transform: scale(1.2);
      }
    }
    span {
      margin-top: 20px;
      font-size: 20px;
      color: #000000;
      //   font-family: zihun143-zhengkuchaojihei, zihun143;
      font-weight: 400;
    }
  }
}
</style>
