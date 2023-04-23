<template>
  <PageContainer>
    <div class="container">
      <div class="topbox">
        <div class="top">
          <div class="left">
            <span>服务单号：</span>
            <span>{{ formState.afterSalesNo }}</span>
          </div>
          <!-- <div class="right">
            <a-button
              type="primary"
              v-if="formState.status == 0"
              v-permission="
                proxy.$route.meta.type == 1
                  ? ['operator:jcOrderAfterSales:edit']
                  : ['operator:gcOrderAfterSales:edit']
              "
              @click.stop="pass(1)"
              style="width: 110px; text-align: center"
              >审批通过
            </a-button>
            <a-button
              type="primary"
              v-if="formState.status == 0"
              v-permission="
                proxy.$route.meta.type == 1
                  ? ['operator:jcOrderAfterSales:edit']
                  : ['operator:gcOrderAfterSales:edit']
              "
              @click.stop="pass(2)"
              style="margin-left: 8px; width: 110px; text-align: center"
              >审批否决</a-button
            >
            <a-button
              type="primary"
              @click.stop="confimreturnMoney()"
              v-permission="
                proxy.$route.meta.type == 1
                  ? ['operator:jcOrderAfterSales:edit']
                  : ['operator:gcOrderAfterSales:edit']
              "
              v-if="formState.status == 1 || formState.status == 2"
              style="margin-left: 8px; width: 110px; text-align: center"
              >确认退款</a-button
            >
            <a-button
              type="primary"
              @click="noteOrder(2)"
              v-permission="
                proxy.$route.meta.type == 1
                  ? ['operator:jcOrderAfterSales:edit']
                  : ['operator:gcOrderAfterSales:edit']
              "
              style="margin-left: 8px; width: 110px; text-align: center"
              >备注</a-button
            >
            <a-button
              type=""
              danger
              v-if="formState.detail.status !== 4 && formState.detail.status !== 5"
              @click="closeModal(1)"
              v-permission="
                proxy.$route.meta.type == 1
                  ? ['operator:jcOrderAfterSales:edit']
                  : ['operator:gcOrderAfterSales:edit']
              "
              style="margin-left: 8px; width: 110px; text-align: center"
              >关闭</a-button
            >
          </div> -->
        </div>
        <div class="bottom flex">
          <div class="f_1">
            <div class="label">订单类型</div>
            <div>{{ formState.type || '-' }}</div>
          </div>
          <div class="f_1">
            <div class="label">提交时间</div>
            <div>{{ formState.createTime }}</div>
          </div>
          <div class="f_1">
            <div class="label">支付方式</div>
            <div class="">{{ formState.payTypeName }}</div>
          </div>
          <div class="f_1">
            <div class="label">售后状态</div>
            <div class="orderStatus">
              {{ afterSalesStatusName(formState.detail.status) }}
            </div>
          </div>
          <div class="f_1">
            <div class="label">退换金额</div>
            <div class="" style="font-size: 18px">{{ formatAmount(formState.orderItem.totalAmount) }}</div>
          </div>
        </div>
        <div class="f_1">
          <div style="color: rgba(0, 0, 0, 0.5)">退款时间</div>
          <div>{{ formState.confirmTime || '-' }}</div>
        </div>
      </div>
      <div class="orderdetailbox">
        <div class="title">
          平台仲裁<span>状态: {{ statusName(formState.arbitrationStatus) || '待仲裁' }}</span>
        </div>
        <div class="top" v-for="(item, index) in formState.records" :key="index">
          <div class="contentbox-x">
            <a-form
              ref="formRef"
              :model="formState"
              :rules="rules"
              label-align="right"
              class="detailbox"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              ><a-form-item
                :label="
                  item.type === 2 ? formState.shopName || '普渔乐门店' : `买家 ${item.createBy}`
                "
                name="shopName"
              >
                <div class="right">
                  {{ item.createTime }}
                </div>
                <div
                  class="right"
                  style="word-wrap: break-word; word-break: break-all; overflow: hidden"
                >
                  说明文字：{{ item.message }}
                </div></a-form-item
              ></a-form
            >
            <a-form
              ref="formRef"
              :model="formState"
              :rules="rules"
              v-if="formState.arbitrationStatus === 0"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              label-align="right"
              class="detailbox"
              style="height: 130px"
              ><a-form-item style="height: 50px" label="平台回复" name="platformReply">
                <a-textarea
                  placeholder="请输入仲裁原因，买卖双方均可见，最多输入200字"
                  :maxlength="200"
                  :rows="3"
                  show-count
                  class="right"
                  v-model:value="formState.platformReply" /></a-form-item
            ></a-form>
            <a-form
              ref="formRef"
              :model="formState"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              v-show="formState.records.length - 1 === index"
              v-else
              label-align="right"
              class="detailbox"
              ><a-form-item label="平台回复" name="platformRepled">
                <div class="right">{{ item.auditTime }}</div>
                <div
                  class="right"
                  style="word-wrap: break-word; word-break: break-all; overflow: hidden"
                >
                  说明文字：{{ item.auditRemark }}
                </div></a-form-item
              ></a-form
            >
            <div class="btnbox" v-if="formState.arbitrationStatus === 0">
              <a-button type="primary" @click="handleRefund(1)">退款给用户</a-button>
              <a-button type="primary" @click="handleRefund(2)">拒绝退款</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="propgressbox" style="padding-left: 80px; padding: right 80px">
        <div v-if="formState.detail.status === 5" style="padding: 0 80px">
          <a-steps :current="1">
            <a-step title="待审核" />
            <a-step title="已取消" />
          </a-steps>
        </div>
        <div v-else-if="formState.detail.status === 6">
          <a-steps :current="1">
            <a-step title="待审核" />
            <a-step title="审批否决" />
          </a-steps>
        </div>
        <div v-else>
          <a-steps :current="formState.status">
            <a-step title="待审核" />
            <a-step title="已审核/待用户发货" />
            <a-step title="售后已收货" />
            <a-step title="确认退款" />
          </a-steps>
        </div>
      </div>
      <div class="orderdetailbox">
        <div class="title">订单信息</div>
        <div class="top">
          <div class="part">订单信息</div>
          <div class="contentbox">
            <div class="detailbox" v-for="(item, index) in orderData" :key="index">
              <span class="label">{{ item.name }}</span>
              <span class="value">
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
        <div class="two">
          <div class="part">费用信息</div>
          <div class="contentbox flex">
            <div class="f_1 H-50">
              <div class="label">商品合计金额</div>
              <div class="">{{ formatAmount(formState.orderItem.totalAmount) }}</div>
            </div>
            <div class="f_1 H-50">
              <div class="label">总退换金额</div>
              <div class="" style="color: red">
                {{
                  formatAmount(formState.orderItem.totalAmount -
                  formState.orderItem.deductionAmount -
                  formState.orderItem.discountAmount -
                  formState.orderItem.couponAmount)
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="three">
          <div class="part">收货人信息</div>
          <div class="contentbox flex">
            <div class="f_1 H-50">
              <div class="label">收货人</div>
              <div class="" style="height: 51px">{{ formState.detail.order.name }}</div>
            </div>
            <div class="f_1 H-50">
              <div class="label">手机号码</div>
              <div class="" style="height: 51px">{{ formState.phone }}</div>
            </div>
          </div>
        </div>
        <div class="four">
          <div class="part">商品信息</div>
          <div class="tablebox" style="padding: 20px">
            <a-table
              ref="table"
              size="default"
              row-key="id"
              :columns="columns"
              :data-source="dataSource.list"
              :pagination="false"
            >
              <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.key === 'img'">
                  <a-image :width="40" :src="text" />
                  <!-- {{ text }} -->
                </template>
                <template v-if="column.key === 'skus'">
                  <span>
                    <span v-for="(item, index) in record.skus" :key="index">
                      {{ item.key }}:{{ item.value }}&nbsp; </span
                    ><br />
                  </span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
        <div class="five">
          <div class="part">退货原因</div>
          <div class="returnbox">
            <div class="f_1" v-for="(item, index) in reasonData" :key="index">
              <div class="label">{{ item.name }}</div>
              <div
                class="value"
                v-if="item.img"
                style="display: flex; gap: 20px; padding-bottom: 10px"
              >
                <a-image-preview-group>
                  <a-image
                    v-for="(item, index) in formState.detail.imgUrlList"
                    :key="index"
                    :src="item"
                  ></a-image>
                </a-image-preview-group>
              </div>

              <div class="value" v-else>
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pb2bApprovalModal ref="approval" @finish="ApprovalModalFinsh"></Pb2bApprovalModal>
    <Pb2bNoteModal ref="pb2bNoteModal"></Pb2bNoteModal>
    <Pb2bCloseModal ref="pb2bCloseModal" @finish="ApprovalModalFinsh"></Pb2bCloseModal>
    <updateCostModal ref="updateCost"></updateCostModal>
    <updateReceiverModal ref="updateReceiver"></updateReceiverModal>
    <updateLogisticsModal ref="updateLogistics"></updateLogisticsModal>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed } from 'vue';
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router';
import Pb2bCloseModal from '../compontens/Pb2bCloseModal.vue';
import Pb2bNoteModal from '../compontens/Pb2bNoteModal.vue';
import updateCostModal from '../compontens/updateCostModal.vue';
import updateReceiverModal from '../compontens/updateReceiverModal.vue';
import updateLogisticsModal from '../compontens/updateLogisticsModal.vue';
import Pb2bApprovalModal from '../compontens/Pb2bApprovalModal.vue';
import { Detail, Refund, Arbitration } from '@/api/pb2b/dispute.js';
import dayjs from 'dayjs';

defineProps({
  id: String,
});

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const loading = ref(false);

onMounted(() => {
  proxy.id && getDetail(proxy.id);
});
const afterSalesStatusName = computed(() => {
  return (value) => {
    //  状态 0-待审核 1-已审核/待用户发货 2-售后已收货 3-确认退款 4-完成 5-取消 6-审批否决
    return ['待审核', '已审核/待用户发货', '售后已收货', '确认退款', '完成', '取消', '审批否决'][
      value
    ];
  };
});
const labelCol = {
  style: {
    width: '160px',
    overflow: 'auto',
    textoverflow: 'ellipsis',
  },
  span: 4,
};
const wrapperCol = {
  style: {
    // 'overflow': 'auto',
    // 'text-overflow': 'ellipsis',
    // 'white-space': 'wrap',
  },
};
// 金额
const formatAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0.00';
  };
});
const formState = reactive({
  afterSalesNo: '',

  arbitrationStatus: '',
  shopName: '',

  confirmTime: '',
  createTime: '',

  status: undefined,
  orderItem: {
    totalAmount: '',
    deductionAmount: '',
    discountAmount: '',
    couponAmount: '',
  },
  payAmount: '',
  payTypeName: undefined,
  detail: {
    orderItem: {
      afterSalesStatus: undefined,
    },
    order: {
      name: '',
      phone: '',
    },
  },
  type: '',
  records: [],
  // {
  //   message: '',
  //   createTime: '',
  //   auditRemark: '',
  //   status: '',
  //   auditTime: '',
  // }
  phone: '',
});

const rules = {
  platformReply: [{ required: true, message: '请输入' }],
};

// 0-待仲裁 1-已退款 2-拒绝退款
const statusName = computed(() => {
  return (value) => {
    // 状态 0-待仲裁 1-已退款 2-拒绝退款
    return ['待仲裁', '已退款', '拒绝退款'][value];
  };
});
const columns = [
  {
    title: '商品图片',
    dataIndex: 'mainImgUrl',
    key: 'img',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '规格',
    dataIndex: 'skus',
    key: 'skus',
  },
  // {
  //   title: '供应商',
  //   dataIndex: 'gys',
  // },
  {
    title: '价格',
    dataIndex: 'price',
    customRender: ({ text }) => (text ? `￥${text.toFixed(2)}` : '-'),
  },
  {
    title: '数量',
    dataIndex: 'num',
  },
  {
    title: '小计',
    dataIndex: 'totalAmount',
    key: 'total',
    customRender: ({ text }) => (text ? `￥${text.toFixed(2)}` : '-'),
  },
];
const dataSource = reactive({
  list: [],
});

const closeOrder = () => {
  proxy.$refs.closeOrder.show();
};

const updateCost = () => {
  proxy.$refs.updateCost.show();
};
const updateReceiver = () => {
  proxy.$refs.updateReceiver.show();
};
const updateLogistics = () => {
  proxy.$refs.updateLogistics.show();
};
const pass = (val) => {
  proxy.$refs.approval.show(val, formState.detail.id);
};
const ApprovalModalFinsh = () => {
  proxy.id && getDetail(proxy.id);
};
const confimreturnMoney = () => {
  proxy.$confirm({
    title: `确认退款?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      Refund({ id: proxy.id }).then(() => {
        proxy.$message.success('退款成功');
        proxy.id && getDetail(proxy.id);
      });
    },
  });
};
const orderData = ref([]);
const reveiceData = ref([]);
const reasonData = ref([]);
const mainFileList = ref([]);
const getDetail = (id) => {
  loading.value = true;
  Detail(id)
    .then((res) => {
      console.log(res, 'detail');
      reveiceData.length = 0;
      reveiceData.value.push(
        {
          name: '收货人',
          value: res.order.name,
        },
        {
          name: '手机号码',
          value: res.order.phone,
        },
      );
      Object.keys(formState).forEach((item) => {
        formState[item] = res[item];
      });
      // 支付类型 1-微信支付 2-白条支付
      if (res.order.payType) {
        formState.payTypeName = res.order.payType === 1 ? '微信支付' : '白条支付';
      } else {
        formState.payTypeName = '-';
      }
      orderData.value = [];
      orderData.value.push(
        {
          name: '订单类型',
          value: res.type,
        },
        {
          name: '提交时间',
          value: res.createTime,
        },
        {
          name: '支付方式',
          value: formState.payTypeName,
        },
        {
          name: '收货人地址',
          value: res.order.address,
        },
        {
          name: '发货时间',
          value: res.order.deliveryTime
            ? dayjs(res.order.deliveryTime).format('YYYY-MM-DD HH:mm:ss')
            : '-',
        },
        // {
        //   name: '配送方式',
        //   value: res.order.deliveryType === 1 ? '快递' : '店铺自提',
        // },
        {
          name: '物流单号',
          value: res.order.deliveryNo || '-',
        },
        {
          name: '运费',
          value: `￥${res.order.freightAmount}`,
        },
        {
          name: '折扣金额',
          value: `￥${res.order.discountAmount}`,
        },
        // {
        //   name: '留言备注',
        //   value: res.order.userRemark,
        // },
        {
          name: '用户账号',
          accout: true,
          value: res.createBy,
        },
        {
          name: '店铺名称',
          value: res.shopName,
        },
      );
      res.imgUrlList.forEach((item) => {
        mainFileList.value.push({
          status: 'done',
          url: item,
        });
      });
      reasonData.value = [];
      reasonData.value.push(
        {
          name: '退货原因',
          value: res.type,
        },
        { name: '退货描述', value: res.description },
        {
          name: '退货凭证',
          value: res.imgUrlList,
          img: true,
        },
        {
          name: '联系电话',
          value: res.userPhone,
        },
      );
      formState.phone = res.userPhone;
      dataSource.list.length = 0;
      dataSource.list.push({
        mainImgUrl: res.orderItem.pcMainImgUrl,
        name: res.orderItem.name,
        skus: res.orderItem.skus,
        price: res.orderItem.price,
        num: res.orderItem.num,
        totalAmount: res.orderItem.totalAmount,
      });
      formState.detail = res;
      formState.records = res.records;
    })
    .finally(() => {
      loading.value = false;
    });
};
const noteOrderModelFinsh = () => {
  proxy.id && getDetail(proxy.id);
};
const noteOrder = (val) => {
  proxy.$refs.pb2bNoteModal.show({
    id: formState.detail.id,
  });
};
const closeModal = () => {
  proxy.$refs.pb2bCloseModal.show({
    id: formState.detail.id,
  });
};
const handleRefund = (val) => {
  if (formState.platformReply) {
    // 1—已退款 2—拒绝退款
    const status = val === 1 ? '1' : '2';
    const titleContent = val === 1 ? '是否退款给用户？' : '是否拒绝退款？';
    const content = val === 1 ? '退款成功' : '已拒绝退款';
    proxy.$confirm({
      title: titleContent,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        Arbitration({
          afterSalesNo: formState.afterSalesNo,
          auditRemark: formState.platformReply,
          status,
        }).then(() => {
          proxy.$message.success(content);
          proxy.id && getDetail(proxy.id);
        });
      },
    });
  } else {
    proxy.$message.warning('请填写仲裁原因');
  }
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
  .topbox {
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        span {
          font-size: 22px;
          font-weight: 700;
        }
      }
      .right {
        display: flex;
        height: 50px;
        .btn {
          width: 110px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid;
          border-radius: 10px;
          margin-right: 15px;
          cursor: pointer;
        }
      }
    }
    .bottom {
      margin-top: 20px;
      .top {
        font-size: 16px;
        display: block;
      }
      .label {
        color: rgba(0, 0, 0, 0.5);
      }
      .orderStatus {
        font-size: 18px;
        position: relative;
        padding-left: 12px;
      }
      .orderStatus::before {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: orange;
        border-radius: 50%;
        top: 0;
        left: -5px;
        bottom: 0;
        margin: auto;
      }
    }
  }
  .propgressbox {
    margin: 20px 0px;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
  }
  .orderdetailbox {
    margin: 20px 0px;
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
      span {
        float: right;
        margin-right: 15%;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    .part {
      font-size: 18px;
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

    .contentbox-x {
      padding: 0 20px 20px 20px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      // display: grid;
      // grid-template-columns: 1fr 1fr;
      // height: 25vh;
      // margin-bottom: 20px;
      .detailbox {
        width: 85%;
        display: flex;
        // width: 50%;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        // line-height: 22px;
        border-bottom: 1px solid #f0f0f0;
        padding: 12px 12px 0 12px;
        margin: 0 20px 0 20px;
        background-color: #eaeaea;
        &:nth-child(2) {
          padding-top: 20px;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .label {
          color: #000000a6;
          flex: 3;
          background: none;
          font-size: 16px;
          border-bottom: none;
          // border-top: 1px solid;
          border-bottom-color: none;
        }
        .value {
          color: #000000e6;
          display: flex;
          flex-direction: column;
          flex: 6;
          div:first-child {
            margin-bottom: 6px;
          }
        }
      }

      .btnbox {
        width: 80%;
        display: flex;
        justify-content: center;
        button {
          width: 24%;
          &:first-child {
            margin-right: 20px;
          }
        }
      }

      .label {
        background: #f0f2f5;
        font-size: 16px;
        border-bottom: 1px solid;
        // border-top: 1px solid;
        border-bottom-color: rgba(0, 0, 0, 0.15);
      }

      .right {
        // margin-left: 40px;
        margin-top: 5px;
        width: 55vw;
      }
    }
    .contentbox {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      // display: grid;
      // grid-template-columns: 1fr 1fr;
      // height: 25vh;
      margin-bottom: 20px;
      .detailbox {
        width: 50%;
        display: flex;
        // width: 50%;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 22px;
        border-bottom: 1px solid #f0f0f0;
        padding: 0 24px 10px;
        margin-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;
        text-indent: 20px;
        .label {
          color: #000000a6;
          flex-shrink: 1;
          background: none;
          // font-size: 16px;
          border-bottom: none;
          // width: 20%;
          width: 100px;
          // border-top: 1px solid;
          border-bottom-color: none;
        }
        .value {
          color: #000000e6;
          flex: 1;
        }
      }
      div {
        // height: 50px;
        // line-height: 50px;
        text-indent: 50px;
      }
      .H-50 {
        height: 50px;
        line-height: 50px;
      }
      // f0f0f0
      .label {
        background: #f0f2f5;
        font-size: 16px;
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

    .four {
      .contentbox {
        .tableHeader {
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: #f0f2f5;
        }
        .row,
        .hejibox {
          border-left: 1px solid;
          border-bottom: 1px solid;
          border-right: 1px solid;
          border-left-color: rgba(0, 0, 0, 0.15);
          border-bottom-color: rgba(0, 0, 0, 0.15);
          border-right-color: rgba(0, 0, 0, 0.15);
        }
        .img {
          width: 20%;
        }
        .name {
          width: 20%;
        }
        .guige {
          width: 20%;
        }
        .gys {
          width: 20%;
        }
        .price {
          width: 20%;
        }
        .num {
          width: 20%;
        }
        .totaol {
          width: 20%;
        }
      }

      .hejibox {
        text-align: right;
        height: 40px;
        line-height: 40px;
        padding-right: 20px;
        background: #f0f2f5;
      }
    }
    .five {
      .returnbox {
        padding: 20px;
        box-sizing: border-box;
        // text-indent: 20px;
        .f_1 {
          display: flex;
          margin-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
          line-height: 45px;
          .label {
            color: #000000a6;
            flex-shrink: 1;
            margin: 0 20px;
          }
          .value {
            color: #000000e6;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
