<template>
  <PageContainer>
    <div class="container">
      <div class="topbox">
        <div class="top">
          <div class="left">
            <span>订单编号：</span>
            <span>{{ formState.detail.orderNo }}</span>
          </div>
          <div class="right" v-if="formState.detail.status !== 5">
            <a-button
              type="primary"
              v-if="(formState.detail.status == 1 || formState.detail.status == 2) && proxy.$route.meta.type === 2"
              @click="updateLogistics"
              style="width: 110px; text-align: center"
              v-permission="['operator:gcOrder:edit']"
              > <span>{{ formState.detail.status == 1 ? '填写' : '修改' }}</span> 物流信息
            </a-button>
            <a-button
              type="primary"
              v-if="formState.detail.status == 2 && proxy.$route.meta.type === 2"
              @click="showLogistics"
              style="margin-left: 8px; width: 110px; text-align: center"
              v-permission="['operator:gcOrder:edit']"
              :loading="formState.logisticsLoading"
              >查看物流信息
            </a-button>
            <a-button
              type="primary"
              v-if="
                formState.detail.status == 1 &&
                proxy.$route.meta.type === 1 &&
                !formState.detail.supplierId
              "
              @click="fenpeidd"
              style="width: 110px; text-align: center"
              v-permission="['operator:jcOrder:edit']"
              >分配订单
            </a-button>
            <a-button
              type="primary"
              v-if="
                formState.detail.status == 1 &&
                proxy.$route.meta.type === 1 &&
                formState.detail.supplierId
              "
              @click="arrivedFronthouse"
              style="margin-left: 8px; width: 110px; text-align: center"
              v-permission="['operator:jcOrder:edit']"
              >已到前置仓
            </a-button>
            <a-button
              type="primary"
              v-if="formState.detail.status == 1 && proxy.$route.meta.type === 2"
              v-permission="
                proxy.$route.meta.type === 1 ? ['operator:jcOrder:edit'] : ['operator:gcOrder:edit']
              "
              @click="updateReceiver"
              style="margin-left: 8px; width: 110px; text-align: center"
            >
              修改收货人</a-button
            >
            <a-button
              type="primary"
              v-if="formState.detail.status == 0"
              @click="updateCost"
              v-permission="
                proxy.$route.meta.type === 1 ? ['operator:jcOrder:edit'] : ['operator:gcOrder:edit']
              "
              style="margin-left: 8px; width: 110px; text-align: center"
              >修改费用
            </a-button>
            <a-button
              type="primary"
              @click="closeOrder(2)"
              v-permission="
                proxy.$route.meta.type === 1 ? ['operator:jcOrder:edit'] : ['operator:gcOrder:edit']
              "
              style="margin-left: 8px; width: 110px; text-align: center"
            >
              备注订单</a-button
            >
            <a-button
              v-permission="
                proxy.$route.meta.type === 1 ? ['operator:jcOrder:edit'] : ['operator:gcOrder:edit']
              "
              v-if="formState.detail && formState.detail.status < 2"
              danger
              @click="closeModal(1)"
              style="margin-left: 8px; width: 110px; text-align: center"
              >关闭订单</a-button
            >
          </div>
        </div>
        <div class="bottom flex" style="margin-top: 20px">
          <div class="f_1">
            <!-- <div class="top">
              <span class="label">订单类型：</span>
              <span>{{ formState.orderType }}</span>
            </div> -->
            <div class="label">支付时间</div>
            <div>{{ formState.detail.payTime || '-' }}</div>
          </div>
          <div class="f_1">
            <div class="label">配送方式</div>
            <div>{{ deliveryTypenName(formState.detail.deliveryType) }}</div>
          </div>
          <div class="f_1">
            <div class="label">支付方式</div>
            <div class="">{{ payTypeName(formState.detail.payType) }}</div>
          </div>
          <div class="f_1">
            <div class="label">订单状态</div>
            <div class="orderStatus">
              {{ ComputedstatusName(formState.detail.status) }}
            </div>
          </div>
          <div class="f_1">
            <div class="label">订单金额</div>
            <div class="" style="font-size: 18px">
              {{ totalAmount(formState.detail.totalAmount) }}
            </div>
          </div>
        </div>
      </div>
      <div class="propgressbox">
        <div v-if="formState.detail.status === 5" style="padding: 0 80px">
          <a-steps :current="statusList.length">
            <a-step v-for="(item, index) in statusList" :key="item.index" :title="item.name" />
            <a-step title="已取消" />
          </a-steps>
        </div>
        <div v-else-if="formState.detail.status === 6">
          <a-steps :current="1">
            <a-step title="待支付" />
            <a-step title="审批否决" />
          </a-steps>
        </div>
        <div v-else style="padding: 0 80px">
          <a-steps :current="formState.detail.status">
            <a-step title="待支付" />
            <a-step title="已支付/待发货" />
            <a-step title="已发货/待收货" />
            <a-step title="待评价" />
            <a-step title="已完成" />
          </a-steps>
        </div>
      </div>
      <div class="orderdetailbox">
        <div class="title" style="margin-left: 30px">订单详情</div>
        <div class="top">
          <div class="part">订单信息</div>
          <div class="contentbox flex">
            <div class="f_1">
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                用户账号
              </div>
              <div class="">
                {{ formState.detail.createBy }}
                <!-- <span @click="seeUser" style="color: #1890ff; cursor: pointer">查看</span> -->
              </div>
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                配送方式
              </div>
              <div class="">{{ deliveryTypenName(formState.detail.deliveryType) }}</div>
            </div>
            <div class="f_1">
              <div class="label">提交时间</div>
              <div class="">{{ formState.detail.createTime }}</div>
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                {{ proxy.$route.meta.type === 2 ? '物流公司 ' : '自提点信息' }}
              </div>
              <div class="">
                {{
                  proxy.$route.meta.type === 2
                    ? formState.detail.deliveryName
                    : formState.detail.preWarehouseVo?.name
                }}
              </div>
            </div>
            <div class="f_1">
              <div class="label">支付方式</div>
              <div class="">{{ payTypeName(formState.detail.payType) }}</div>
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                {{ proxy.$route.meta.type === 2 ? '物流单号' : '' }}
              </div>
              <div class="">
                {{ proxy.$route.meta.type === 2 ? formState.detail.deliveryNo : '' }}
              </div>
            </div>
            <div class="f_1">
              <div class="label">支付时间</div>
              <div class="">{{ formState.detail.payTime || '-' }}</div>
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                <!-- 留言备注 -->
              </div>
              <div class="">
                <!-- {{ formState.detail.userRemark }} -->
              </div>
            </div>
          </div>
        </div>
        <div class="two">
          <div class="part">费用信息</div>
          <div class="contentbox flex">
            <div class="f_1">
              <div class="label">商品合计金额</div>
              <div class="">
                {{ totalAmount(formState.detail.totalAmount) }}
              </div>
            </div>
            <div class="f_1">
              <div class="label">运费</div>
              <div class="">
                {{ totalAmount(formState.detail.freightAmount) }}
              </div>
            </div>
            <!-- <div class="f_1" v-if="formState.detail.deductionAmount"> -->
            <div class="f_1">
              <div class="label">积分抵扣</div>
              <div class="">
                {{ totalAmount(formState.detail.deductionAmount) }}
              </div>
            </div>
            <!-- <div class="f_1" v-if="formState.detail.couponAmount"> -->
            <div class="f_1">
              <div class="label">优惠券金额</div>
              <div class="">
                {{ totalAmount(formState.detail.couponAmount) }}
              </div>
            </div>
            <div class="f_1" v-if="formState.detail.discountAmount">
              <div class="label">折扣金额</div>
              <div class="">
                {{ totalAmount(formState.detail.discountAmount) }}
              </div>
            </div>
            <div class="f_1">
              <div class="label">应付款金额</div>
              <div class="" style="color: red">
                {{
                  totalAmount(
                    formState.detail.totalAmount +
                      formState.detail.freightAmount -
                      formState.detail.discountAmount -
                      formState.detail.couponAmount -
                      formState.detail.deductionAmount,
                  )
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="other" v-if="regimentFlag">
          <div class="part">佣金信息</div>
          <div class="tablebox" style="padding: 20px">
            <a-table
              ref="table"
              size="default"
              row-key="id"
              :columns="columns2"
              :pagination="false"
              :data-source="commissionState.detail"
            >
              <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.key === 'img'">
                  <a-image :width="40" :src="text" />
                </template>
                <template v-else-if="column.dataIndex === 'platformAmount'">
                  <span>
                    {{ totalAmount(text) }}
                  </span>
                </template>
                <template v-else-if="column.dataIndex === 'regimentAmount'">
                  <span>
                    {{ totalAmount(text) }}
                  </span>
                </template>
              </template>
            </a-table>
            <div class="hejibox">
              <span>合计: 平台佣金 </span>
              <span style="color: red">{{ totalAmount(commissionState.platformSum) }}</span>
              <span> 团长佣金 </span>
              <span style="color: red">{{ totalAmount(commissionState.commissionSum) }}</span>
            </div>
          </div>
        </div>
        <div v-if="proxy.$route.meta.type === 2" class="three">
          <div class="part">收货人信息</div>

          <div class="contentbox flex">
            <div class="f_1">
              <div class="label">收货人</div>
              <div class="">{{ formState.detail.name }}</div>
            </div>
            <div class="f_1">
              <div class="label">手机号码</div>
              <div class="">{{ formState.detail.phone }}</div>
            </div>
            <div class="f_1">
              <div class="label">收货地址</div>
              <div class="">{{ formState.detail.address }}</div>
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
              :pagination="false"
              :data-source="dataSource.list"
            >
              <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.key === 'img'">
                  <a-image :width="40" :src="text" />
                </template>
                <template v-else-if="column.key === 'tooltip'">
                  <a-tooltip>
                    <template #title>{{ text }}</template>
                    {{ text }}
                  </a-tooltip>
                </template>
                <template v-else-if="column.key === 'gupige'">
                  <span v-for="(item, index) in record.skus" :key="index">
                    <span>{{ item.key }}:&nbsp;&nbsp;{{ item.value }}</span
                    ><br />
                  </span>
                </template>
              </template>
            </a-table>
            <div class="hejibox">
              <span>合计</span>
              <span style="color: red">{{ totalAmount(formState.detail.totalAmount) }}</span>
            </div>
          </div>
        </div>
        <div class="five" v-if="commentDataSource.status">
          <div class="part">商品评价</div>
          <div class="tablebox" style="padding: 20px">
            <a-table
              ref="table"
              size="default"
              row-key="id"
              :columns="commentColumns"
              :pagination="pagination"
              :data-source="commentDataSource.list"
            >
              <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.key === 'img'">
                  <a-image :width="40" :src="text" />
                </template>
                <template v-else-if="column.key === 'imgUrls'">
                  <template v-if="text && text.length > 0">
                    <a-image v-for="(item, index) in text" :src="item" :key="index" :width="40" />
                  </template>
                </template>
                <template v-else-if="column.key === 'score'">
                  <a-space>
                    <!-- 自定指令 -->
                    <a-rate v-model:value="record.score" :disabled="true" />
                  </a-space>
                </template>
                <template v-else-if="column.key === 'reply'">
                  <template v-if="!text">
                    <a-button
                      type="primary"
                      @click="handleReply(record.id)"
                      v-permission="
                        proxy.$route.meta.type == 1
                          ? ['operator:jcProductComment:edit']
                          : ['operator:gcProductComment:edit']
                      "
                      >回复</a-button
                    >
                  </template>
                  <template v-else>
                    {{ text }}
                  </template>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <ReplyModal ref="replyModal" @onfinsh="LogisticsModal"></ReplyModal>
    <CommonNoteModal ref="commonNoteModal"></CommonNoteModal>
    <CommonCloseModal ref="commonCloseModal" @onfinsh="LogisticsModal"></CommonCloseModal>
    <UpdateCostModal ref="updateCostModal" @onfinsh="LogisticsModal"></UpdateCostModal>
    <UpdateReceiverModal ref="updateReceiverModal" @onfinsh="LogisticsModal"></UpdateReceiverModal>
    <UpdateLogisticsModal
      ref="updateLogisticsModal"
      @onfinsh="LogisticsModal"
    ></UpdateLogisticsModal>
    <AllocateOrdersModal ref="AllocateOrders" @finish="LogisticsModal"></AllocateOrdersModal>
    <LogisitcsDetailModal ref="logisitcsDetailModal" />
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed } from 'vue';
import UpdateCostModal from './compontens/updateCostModal.vue';
import UpdateReceiverModal from './compontens/updateReceiverModal.vue';
import UpdateLogisticsModal from './compontens/updateLogisticsModal.vue';
import CommonCloseModal from './compontens/CommonCloseModal.vue';
import ReplyModal from './compontens/ReplyModal.vue';
import CommonNoteModal from './compontens/CommonNoteModal.vue';
import {
  orderListDatil,
  personListDeatil,
  commentList,
  arrivedFront,
  logisticsDetail,
} from '@/api/order.js';
import { commonRatioDetail } from '@/api/ratio.js';
import { supplierList, personsupplierList } from '@/api/goods.js';
import AllocateOrdersModal from './compontens/AllocateOrdersModal.vue';
import LogisitcsDetailModal from './compontens/LogisitcsDetailModal.vue';

defineProps({
  id: String,
});

const { proxy } = getCurrentInstance();

const loading = ref(false);
// const updateReceiver = ref(undefined);
onMounted(() => {
  proxy.id && getDetail(proxy.id);
  getSupplierList();
  commonRatioDetail({ shopType: proxy.$route.meta.type }).then((result) => {
    formState.platformRate = result.ratio;
  });
});
const LogisticsModal = (val) => {
  console.log(val);
  proxy.id && getDetail(proxy.id);
};
const regimentFlag = ref(false);
const commissionState = reactive({
  detail: [],
  commissionSum: '',
  platformSum: '',
});
const formState = reactive({
  detail: {},
  payTypeName: '',
  personListDeatil, // 暂时跳过f2elint代码校验
  deliveryTypenName: '',
  statusName: '',
  logisticsLoading: false,
  platformRate: '',
});
const ComputedstatusName = computed(() => {
  return (value) => {
    return ['待支付', '已支付/待发货', '已发货/待收货', '待评价', '已完成', '已取消'][value];
  };
});
const payTypeName = computed(() => {
  return (value) => {
    if (!value) return '-';
    return ['-', '微信支付', '白条支付'][value];
  };
});
const deliveryTypenName = computed(() => {
  return (value) => {
    return ['', '快递', '前置仓自提'][value];
  };
});
// 金额
const totalAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0';
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
    dataIndex: 'guige',
    key: 'gupige',
    ellipsis: true,
  },
  {
    title: '商品编号',
    dataIndex: 'productNo',
    width: 200,
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 110,
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
  },
  {
    title: '数量',
    dataIndex: 'num',
  },
  {
    title: '小计',
    dataIndex: 'totalAmount',
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
  },
];
const columns2 = [
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
    title: '商品编号',
    dataIndex: 'productNo',
    width: 200,
  },
  {
    title: '数量',
    dataIndex: 'num',
  },
  {
    title: '平台佣金',
    dataIndex: 'platformAmount',
  },
  {
    title: '平台佣金比例',
    dataIndex: 'platformRatio',
  },
  {
    title: '团长佣金',
    dataIndex: 'regimentAmount',
  },
  {
    title: '团长佣金比例',
    dataIndex: 'regimentRatio',
  },
];

const dataSource = reactive({
  list: [],
  guige: [],
  supplierList: [],
});

const statusList = [
  {
    name: '待支付',
    index: 0,
  },
  {
    name: '已支付/待发货',
    index: 1,
  },
  {
    name: '已发货/待收货',
    index: 2,
  },
  {
    name: '待评价',
    index: 3,
  },
  {
    name: '已完成',
    index: 4,
  },
];

const commentColumns = [
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
    title: '商品评分',
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: '商品评价',
    dataIndex: 'content',
    ellipsis: true,
  },
  {
    title: '商品评价图片',
    dataIndex: 'imgUrls',
    key: 'imgUrls',
  },
  {
    title: '商家回复',
    dataIndex: 'replyRemark',
    key: 'reply',
    ellipsis: true,
  },
];

const commentDataSource = reactive({
  list: [],
  status: '',
});

// 回复评价
const handleReply = (id) => {
  proxy.$refs.replyModal.show(id);
};

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 5,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const closeOrder = (val) => {
  console.log(val);
  proxy.$refs.commonNoteModal.show({
    type: 'order',
    id: formState.detail.id,
  });
};
const closeModal = () => {
  proxy.$refs.commonCloseModal.show({
    type: 'order',
    id: formState.detail.id,
  });
};
const updateCost = () => {
  proxy.$refs.updateCostModal.show({ ...formState.detail });
};
// 收货人信息
const updateReceiver = () => {
  proxy.$refs.updateReceiverModal.show(formState.detail);
};
// 物流信息
const updateLogistics = () => {
  proxy.$refs.updateLogisticsModal.show(formState.detail);
};
const showLogistics = () => {
  formState.logisticsLoading = true;
  logisticsDetail(formState.detail.orderNo)
    .then((res) => {
      if (res.length === 0) {
        proxy.$warning({
          title: '物流查询',
          content: '没有查询到物流信息',
          okText: '确定',
        });
      } else {
        proxy.$refs.logisitcsDetailModal.show(res.reverse());
      }
    })
    .finally(() => {
      formState.logisticsLoading = false;
    });
};

const apiType = ref('');
apiType.value = proxy.$route.meta.type;
const getSupplierList = () => {
  personsupplierList(1, { pageNum: 1, pageSize: 999 }).then((res) => {
    dataSource.supplierList = res.data.map((item) => ({ label: item.name, value: item.id }));
  });
};
// 分配订单
const fenpeidd = () => {
  proxy.$refs.AllocateOrders.show({ ids: [formState.detail.id] }, dataSource.supplierList);
};
// 已到前置仓
const arrivedFronthouse = () => {
  proxy.$confirm({
    title: `是否将选中订单标记为已到货?订单状态更改后不可撤销！`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      arrivedFront({ ids: [proxy.id] })
        .then((res) => {
          proxy.$message.success('操作成功');
          LogisticsModal();
        })
        .catch(() => {})
        .finally(() => {});
    },
  });
};
const getDetail = (id) => {
  loading.value = true;
  // 2 是个人 1是集体
  orderListDatil(apiType.value, id)
    .then((res) => {
      if (res.status === 5) {
        statusList.length = res.beforeStatus + 1 || 1;
      }
      loading.value = true;
      formState.detail = res;
      if (res.shareProducts.length) {
        regimentFlag.value = true;
        res.shareProducts.forEach((product, index) => {
          const temp = [];
          temp.value = product.productDto.sku.map((item) => ({
            platformRatio: `${item.platformRatio}%`,
            platformAmount: item.price * item.platformRatio * 0.01,
            regimentRatio: `${item.regimentRatio}%`,
            regimentAmount: item.price * item.regimentRatio * 0.01,
            productNo: product.productDto.productNo,
            name: product.productDto.name,
            skuNo: item.skuNo,
            mainImgUrl: res.orderItemList[index] ? res.orderItemList[index].mainImgUrl : '',
            num: res.orderItemList[index] ? res.orderItemList[index].num : '',
          }));
          let sum = 0;
          const arr = [];
          res.orderItemList.forEach((item) => {
            arr.push(item.skuNo);
          });
          console.log(temp.value);
          const list = Object.values(temp.value).filter((item) => arr.indexOf(item.skuNo) != -1);
          commissionState.detail = list;
          commissionState.detail.forEach((item) => {
            sum += item.platformAmount;
          });
          commissionState.commissionSum = product.commission;
          commissionState.platformSum = sum;
        });
      }
      dataSource.list = res.orderItemList;
      commentList(apiType.value, { orderNo: formState.detail.orderNo })
        .then((result) => {
          commentDataSource.status = result.total;
          pagination.total = result.total;
          commentDataSource.list = result.data;
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .finally(() => {
      loading.value = false;
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

      div {
        height: 50px;
        line-height: 50px;
        text-indent: 50px;
      }

      // f0f0f0
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

    .four {
      margin-bottom: 20px;
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

    .other {
      .hejibox {
        text-align: right;
        height: 40px;
        line-height: 40px;
        padding-right: 20px;
        background: #f0f2f5;
      }
      margin-bottom: 20px;
    }
  }
}
</style>
