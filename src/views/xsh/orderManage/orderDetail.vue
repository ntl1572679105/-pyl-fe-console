<template>
  <PageContainer>
    <div class="container">
      <div class="orderdetailbox">
        <!-- <div class="title" style="margin-left: 30px">订单信息</div> -->
        <div class="top">
          <div class="part">订单信息</div>
          <div class="contentbox">
            <div class="one flex">
              <div class="item f_1">
                <div class="label">订单编号</div>
                <div class="value">{{ formState.orderNo }}</div>
              </div>
              <div class="item f_1">
                <div class="label">套餐名称</div>
                <div class="value">{{ formState.name }}</div>
              </div>
              <div class="item f_1">
                <div class="label">套餐描述</div>
                <div class="value">{{ formState.introduction || '-' }}</div>
              </div>
            </div>
            <div class="one flex">
              <div class="item f_1">
                <div class="label">下单数量</div>
                <div class="value">{{ formState.productNum }}</div>
              </div>
              <div class="item f_1">
                <div class="label">实付金额</div>
                <div class="value">￥{{ formState.payAmount }}</div>
              </div>
              <div class="item f_1">
                <div class="label">下单时间</div>
                <div class="value">{{ formState.createTime || '-' }}</div>
              </div>
            </div>
            <div class="one flex">
              <div class="item color">
                <div class="label">订单状态</div>
                <div class="value color">{{ statusText(formState.status) }}</div>
              </div>
              <div class="item color">
                <div class="label">状态变更时间</div>
                <div class="value color">{{ formState.updateTime || '-' }}</div>
              </div>
              <div class="item color" v-if="formState.status === 5">
                <div class="label">退款理由</div>
                <div class="value color">{{ formState.reason || '-' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="returnOrder" v-if="formState.status === 5">
          <div class="part">处理情况</div>
          <div class="userbox">
            <div class="item">
              <div class="label">退款状态</div>
              <div class="value">已同意</div>
            </div>
            <div class="item">
              <div class="label">处理时间</div>
              <div class="value">{{ formState.updateTime || '-' }}</div>
            </div>
            <!-- <div class="item">
              <div class="label">处理理由</div>
              <div class="value">{{ formState.remark || '-' }}</div>
            </div> -->
          </div>
        </div>
        <div class="two">
          <div class="part">
            用户信息<a-button
              v-if="formState.userId"
              style="margin-left: 20px"
              @click="viewUserDetail"
              type="primary"
              >用户详情</a-button
            >
          </div>
          <div class="userbox">
            <div class="item">
              <div class="label">用户名</div>
              <div class="value">{{ formState.userName }}</div>
            </div>
            <div class="item">
              <div class="label">性别</div>
              <div class="value">{{ sexText(formState.sex) }}</div>
            </div>
            <div class="item">
              <div class="label">联系方式</div>
              <div class="value">{{ formState.phone }}</div>
            </div>
          </div>
        </div>
        <div class="three">
          <div class="part">
            商家信息<a-button
              v-if="formState.shopId"
              style="margin-left: 20px"
              type="primary"
              @click="viewShopDetail"
              >店铺详情</a-button
            >
          </div>
          <div class="userbox">
            <div class="item">
              <div class="label">商家名称</div>
              <div class="value">{{ formState.shopName }}</div>
            </div>
            <div class="item">
              <div class="label">联系电话</div>
              <div class="value">{{ formState.shopPhone || '-' }}</div>
            </div>
            <div class="item">
              <div class="label">商家简介</div>
              <div class="value">{{ formState.shopIntroduction || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed } from 'vue';
import { orderDetail } from '@/api/o2o/order.js';

const { proxy } = getCurrentInstance();

const loading = ref(false);
onMounted(() => {
  getDetail(proxy.$route.params.id);
  console.log(proxy.$route);
});

const formState = reactive({
  orderNo: '',
  name: '',
  shopIntroduction: '',
  productNum: '',
  payAmount: '',
  payTime: '',
  status: undefined,
  verificationTime: '',
  userName: '',
  sex: '',
  phone: '',
  shopName: '',
  shopPhone: '',
  introduction: '',
  shopId: '',
  userId: '',
});

const sexText = computed(() => {
  return (value) => {
    // 0-未知 1-女 2-男
    if (value === null) return '未知';
    return ['未知', '女', '男'][value];
  };
});

const statusText = computed(() => {
  return (value) => {
    // 订单状态 0-待支付 1-已支付/待核销 2-已核销 3-已评价 4-已取消
    if (value === null) return '未知';
    return ['待支付', '已支付/待核销', '已核销', '已评价', '已取消', '已退款'][value];
  };
});
const getDetail = (id) => {
  loading.value = true;
  orderDetail({ orderNo: id }).then((res) => {
    Object.keys(res).forEach((key) => {
      formState[key] = res[key];
    });
  });
};

const viewShopDetail = () => {
  proxy.$router.push({
    path: `/xsh-shangjiaManageView/${formState.shopId}`,
  });
};

const viewUserDetail = () => {
  proxy.$router.push({
    path: `/customer/userlistDeatil/${formState.userId}`,
  });
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}

.f_1 {
  flex: 1;
}

.container {
  min-height: 100vh;
  overflow-y: auto;

  .orderdetailbox {
    padding: 20px 0px;
    background: #fff;
    box-sizing: border-box;

    .title {
      margin-left: 30px;
      font-size: 22px;
      margin-bottom: 30px;
      color: rgba(0, 0, 0, 0.85);
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.85);
      border-bottom-color: rgba(0, 0, 0, 0.15);
    }

    .part {
      font-size: 20px;
      position: relative;
      padding-left: 60px;
    }

    .part::before {
      position: absolute;
      content: '';
      width: 10px;
      height: 20px;
      background: #1890ff;
      top: 0;
      left: 40px;
      bottom: 0;
      margin: auto;
    }

    .contentbox {
      padding: 20px;
      box-sizing: border-box;
      // height: 25vh;
      margin-bottom: 20px;
      .one {
        .item {
          text-align: center;
          width: 33.3% !important;
          .value.color {
            border-bottom: 1px solid;
            border-bottom-color: rgba(0, 0, 0, 0.15);
          }

          div {
            height: 50px;
            line-height: 50px;
          }
        }
        .item.color:nth-of-type(1) {
          border-left: 1px solid;
          width: 33.3% !important;
          border-left-color: rgba(0, 0, 0, 0.15);
        }
        .item.color:nth-of-type(2) {
          border-right: 1px solid;
          width: 33.3% !important;
          border-right-color: rgba(0, 0, 0, 0.15);
        }
        .item.color:nth-of-type(1) {
          border-right: 1px solid;
          border-right-color: rgba(0, 0, 0, 0.15);
        }
      }

      .label {
        background: #f0f2f5;
        font-size: 18px;
        border-bottom: 1px solid;
        // border-top: 1px solid;
        border-bottom-color: rgba(0, 0, 0, 0.15);
      }

      .f_1 {
        height: 100%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-right: 0;
      }

      .f_1:last-of-type {
        border-right: 1px solid;
        border-right-color: rgba(0, 0, 0, 0.15);
      }
    }
  }
}
.userbox {
  display: flex;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .item {
    width: 33.3% !important;
    text-align: center;
    > div {
      height: 50px;
      line-height: 50px;
    }
    .label {
      background: #f0f2f5;
      font-size: 18px;
      border-bottom: 1px solid;
      border-bottom-color: rgba(0, 0, 0, 0.15);
      border-top: 1px solid;
      border-top-color: rgba(0, 0, 0, 0.15);
    }
    .value {
      border-bottom: 1px solid;
      border-bottom-color: rgba(0, 0, 0, 0.15);
    }
  }
  .item:nth-of-type(1) {
    border-left: 1px solid;
    border-right: 1px solid;
    border-right-color: rgba(0, 0, 0, 0.15);
    border-left-color: rgba(0, 0, 0, 0.15);
  }
  .item:nth-of-type(3),
  .item:nth-of-type(2) {
    border-right: 1px solid;
    border-right-color: rgba(0, 0, 0, 0.15);
  }
}
</style>
