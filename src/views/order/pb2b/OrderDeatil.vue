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
              v-if="formState.detail.status == 2"
              @click="showLogistics"
              style="width: 110px; text-align: center"
              :loading="formState.logisticsLoading"
              >查看物流信息
            </a-button>
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
            <!-- <div>{{ deliveryTypenName(formState.detail.deliveryType) }}</div> -->
            <div>快递</div>
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
          <a-steps :current="1">
            <a-step title="待支付" />
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
              <!-- <div class="">{{ deliveryTypenName(formState.detail.deliveryType) }}</div> -->
              <div>快递</div>
            </div>
            <div class="f_1">
              <div class="label">提交时间</div>
              <div class="">{{ formState.detail.createTime }}</div>
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                物流公司
              </div>
              <div class="">{{ formState.detail.deliveryName }}</div>
            </div>
            <div class="f_1">
              <div class="label">支付方式</div>
              <div class="">{{ payTypeName(formState.detail.payType) }}</div>
              <div
                class="label"
                style="border-top: 1px solid; border-top-color: rgba(0, 0, 0, 0.15)"
              >
                物流单号
              </div>
              <div class="">{{ formState.detail.deliveryNo }}</div>
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
            <div class="f_1">
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
        <div class="four" v-if="regimentFlag">
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
        <div class="three">
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
                    <a-button type="primary" @click="handleReply(record.id)">回复</a-button>
                  </template>
                  <template v-else>
                    {{ text }}
                  </template>
                </template>
              </template>
            </a-table>
          </div>
        </div>
        <a-spin v-if="contractLoading"></a-spin>
        <div class="six" v-else-if="!contractLoading && contractImages.length">
          <div class="part">电子合同</div>
          <div class="contentbox-x flex" v-for="(item, index) in contractInfo">
            <a-card style="width: 50%; margin: 10px 20px; border: 2px solid #f0f2f5">
              <div>合同编号： {{ item.contractNo }}</div>
              <div>合同类型： {{ item.contractType }}</div>
              <div>合同状态： {{ ComputedContractName(item.signStatus) }}</div>
              <!-- {{ contractImages[index] }} -->
              <div>
                合同名称：
                <a :href="contractImages[index].url" target="_blank"
                  >{{ item.contractName }} [在新页面打开]</a
                >
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </div>
    <ReplyModal ref="replyModal" @onfinsh="LogisticsModal"></ReplyModal>
    <LogisitcsDetailModal ref="logisitcsDetailModal" />
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed } from 'vue';
import {
  oerderDetail,
  productCommentList,
  contractList,
  contractUrl,
  logisticsDetail,
} from '@/api/pb2b/order.js';
import ReplyModal from '../compontens/ReplyModal.vue';
import LogisitcsDetailModal from '../compontens/LogisitcsDetailModal.vue';

defineProps({
  id: String,
});

const { proxy } = getCurrentInstance();

const loading = ref(false);
const contractLoading = ref(true);
onMounted(() => {
  proxy.id && getDetail(proxy.id);
});
const contractImages = ref([]);
const contractInfo = ref([]);

const formState = reactive({
  detail: {},
  payTypeName: '',
  deliveryTypenName: '',
  statusName: '',
  logisticsLoading: false,
});
const ComputedstatusName = computed(() => {
  return (value) => {
    return ['待支付', '已支付/待发货', '已发货/待收货', '待评价', '已完成', '已取消'][value];
  };
});
// 合同签署状态：1：未签署；2：签署中；3：已签署
const ComputedContractName = computed(() => {
  return (value) => {
    return ['', '未签署', '签署中', '已签署'][value];
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
const regimentFlag = ref(false);
const commissionState = reactive({
  detail: [],
  commissionSum: '',
  platformSum: '',
})
const columns2 = [
  {
    title: '商品图片',
    dataIndex: 'pcMainImgUrl',
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
  }
];
const LogisticsModal = (val) => {
  console.log(val);
  proxy.id && getDetail(proxy.id);
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

// 金额
const totalAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0';
  };
});
const columns = [
  {
    title: '商品图片',
    dataIndex: 'pcMainImgUrl',
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
  },
  {
    title: '供应商',
    dataIndex: 'productNo',
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

const dataSource = reactive({
  list: [],
  guige: [],
});

const commentColumns = [
  {
    title: '商品图片',
    dataIndex: 'pcMainImgUrl',
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

const getDetail = (id) => {
  loading.value = true;
  // 2 是个人 1是集体
  oerderDetail(id)
    .then((res) => {
      loading.value = true;
      formState.detail = res;
      if (res.shareProducts.length) {
        regimentFlag.value = true;
        res.shareProducts.forEach((product, index) => {
          let temp = [];
          temp.value = product.productDto.sku.map((item) => ({
            platformRatio: item.platformRatio + '%',
            platformAmount: item.price * item.platformRatio * 0.01,
            regimentRatio: item.regimentRatio + '%',
            regimentAmount: item.price * item.regimentRatio * 0.01,
            productNo: product.productDto.productNo,
            name: product.productDto.name,
            skuNo: item.skuNo,
            pcMainImgUrl: res.orderItemList[index] ? res.orderItemList[index].pcMainImgUrl : '',
            num: res.orderItemList[index] ? res.orderItemList[index].num : '',
          }))
          let sum = 0;
          let arr = [];
          res.orderItemList.forEach((item) => {
            arr.push(item.skuNo);
          });
          console.log(temp.value);
          const list = Object.values(temp.value).filter((item) => arr.indexOf(item.skuNo) != -1);
          commissionState.detail = list;
          commissionState.detail.forEach((item) => {
            sum += item.platformAmount;
          })
          commissionState.commissionSum = product.commission;
          commissionState.platformSum = sum;
        });
      }
      dataSource.list = res.orderItemList;
      // 获取合同列表
      contractList({ userId: res.userId }).then((contractResult) => {
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
      productCommentList({ orderNo: formState.detail.orderNo })
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
      margin-bottom: 20px;
    }
  }
}
</style>
