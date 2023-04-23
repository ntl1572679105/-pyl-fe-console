<template>
  <PageContainer>
    <div class="container">
      <div class="topbox">
        <div class="top">
          <div class="left">
            <span>商品编号:</span>
            <span>{{ formState.detail.productNo }}</span>
          </div>
        </div>
      </div>
      <div class="orderdetailbox">
        <div class="title" style="margin-left: 30px">商品详情</div>
        <div class="top">
          <div class="part">商品信息</div>
          <div class="ceontent">
            <div
              class="item"
              v-for="(item, index) in formState.contents"
              :key="index"
              :class="[item.key === 'attrList' ? 'att-item' : '']"
            >
              <div class="label">{{ item.name }}</div>
              <div v-if="item.key === 'img'" style="margin-left: 20px;">
                <a-image class="value" :src="item.value"></a-image>
              </div>
              <a-rate
                :value="item.value"
                disabled
                v-else-if="item.key === 'score'"
                style="text-indent: 0px; margin-left: 20px"
              />
              <div class="value att-box" v-else-if="item.key === 'attrList'">
                <span v-for="(j, k) in item.value" :key="k">{{ `${j.key}：${j.value}` }}</span>
                <span v-if="item.value.length === 0">暂无信息</span>
              </div>
              <div class="value flex" v-else-if="item.key === 'category'">
                <div v-for="(j, k) in item.value" :key="k">
                  <span>{{ k + 1 }}级类目名称：{{ j }}</span>
                </div>
              </div>
              <div class="value" style="margin-left: 0;" v-else-if="item.key === 'status'">{{ item.value }}</div>
              <div class="value" v-else>{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="part">
            <span>佣金信息</span>
            <!-- <a-button
              type="primary"
              class="edit-box"
              @click="formState.isEditCommission = !formState.isEditCommission"
              >{{ formState.isEditCommission ? '保存' : '编辑' }}</a-button
            > -->
          </div>
          <div class="commission-box">
            <div>
              <span>团长分佣比例</span>
              <a-input-number
                v-model:value="formState.chiefRate"
                :min="0.01"
                :max="100"
                placeholder="输入内容"
                addon-after="%"
                v-if="formState.isEditCommission"
              ></a-input-number>
              <span v-else>{{ formState.chiefRate }}%</span>
            </div>
            <div>
              <span>平台分佣比例</span>
              <a-input-number
                v-model:value="formState.platformRate"
                :min="0.01"
                :max="100"
                placeholder="输入内容"
                addon-after="%"
                v-if="formState.isEditCommission"
              ></a-input-number>
              <span v-else>{{ formState.platformRate }}%</span>
            </div>
          </div>
        </div>
        <div class="four">
          <div class="part">商品sku列表</div>
          <div class="tablebox" style="padding: 20px">
            <a-table
              ref="table"
              size="default"
              row-key="id"
              :columns="columns"
              :pagination="false"
              :data-source="formState.skuList"
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
          </div>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps } from 'vue';
import { productDeatil, categoryList } from '@/api/pb2b/goods.js';
import { commonRatioDetail } from '@/api/ratio.js';

defineProps({
  id: String,
});

const { proxy } = getCurrentInstance();

const loading = ref(false);

onMounted(() => {
  getCategoryList();
});

const formState = reactive({
  detail: {},
  // 基本信息组
  contents: [],
  skuList: [],
  categoryList: [], // pb2b整个类目列表

  // 编辑佣金
  isEditCommission: false,
  // 团长分佣比例
  chiefRate: '',
  // 平台分佣比例
  platformRate: '',
});
const columns = [
  {
    title: '商品图片',
    dataIndex: 'pcMainImgUrl',
    key: 'img',
  },
  {
    title: '规格',
    dataIndex: 'guige',
    key: 'gupige',
  },
  {
    title: 'sku编号',
    dataIndex: 'skuNo',
  },
  {
    title: '平台售价',
    dataIndex: 'price',
    width: 110,
    customRender: ({ text }) => (text ? `￥${text.toFixed(2)}` : '-'),
  },
  {
    title: '划线价格',
    dataIndex: 'normalPrice',
    width: 110,
    customRender: ({ text }) => (text ? `￥${text.toFixed(2)}` : '-'),
  },
  {
    title: '商品结算价',
    dataIndex: 'settlePrice',
    width: 110,
    customRender: ({ text }) => (text ? `￥${text.toFixed(2)}` : '-'),
  },
  {
    title: '库存',
    dataIndex: 'stock',
  },
  {
    title: '销量',
    dataIndex: 'sales',
  },
];

// 类目列表
const getCategoryList = () => {
  loading.value = true;
  categoryList()
    .then((res) => {
      formState.categoryList = res;
      proxy.id && getDetail(proxy.id);
    })
    .catch(() => {
      loading.value = false;
    });
};

const getDetail = (id) => {
  productDeatil(id)
    .then((res) => {
      formState.detail = res;
      formState.skuList = res.skuList;

      const categoryDeatil = [];
      getCategoryNames(categoryDeatil, res.categoryIds, 0, formState.categoryList);
      
      commonRatioDetail({ shopType: res.shopType }).then((result) => {
        formState.platformRate = result.ratio;
      })
      formState.chiefRate = ((1 - (res.settlePrice / res.price) - (formState.platformRate * 0.01)) * 100).toFixed(1);
      if (formState.chiefRate < 0) {
        formState.chiefRate = 0;
      }
      console.log(formState.chiefRate);
      formState.contents = [
        {
          name: '商品名称',
          value: res.name,
        },
        {
          name: '价格',
          value: res.price ? `￥${res.price}` : '￥0',
        },
        {
          name: '原价',
          value: res.settlePrice ? `￥${res.settlePrice}` : '￥0',
        },
        {
          name: '正常售价',
          value: res.normalPrice ? `￥${res.normalPrice}` : '-',
        },
        {
          name: '销量',
          value: res.sales,
        },
        {
          name: '库存',
          value: res.stock,
        },
        {
          name: '上下架情况',
          value: res.status === 1 ? '下架' : '上架',
          key: 'status',
        },
        {
          name: '评分',
          value: res.score,
          key: 'score',
        },
        {
          name: '商品图片',
          value: res.pcMainImgUrl,
          key: 'img',
        },
        {
          name: '类目',
          value: categoryDeatil,
          key: 'category',
        },
        {
          name: '属性',
          value: res.attrList,
          key: 'attrList',
        },
      ];
    })
    .finally(() => {
      loading.value = false;
    });
};

const getCategoryNames = (values, ids, index, children) => {
  if (children && ids[index]) {
    const el = children.find((item) => item.id === ids[index]);
    if (el) {
      values.push(el.name);
      getCategoryNames(values, ids, index + 1, el.children);
    }
  }
  return values;
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
      margin-top: 20px;
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
    .top {
      .ceontent {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 50%;
          display: flex;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          align-items: center;
          // line-height: 60px;
          height: 60px;
          border-bottom: 1px solid #f0f0f0;
          &:nth-child(7) {
            .label {
              margin-right: 20px;
            }
          }
          .label {
            color: #000000a6;
            flex-shrink: 1;
            background: none;
            font-size: 16px;
            border-bottom: none;
            width: 20%;
            text-align: right;
          }
          .value {
            color: #000000e6;
            flex: 1;
            margin-left: 20px;
          }
        }
        .item:last-of-type {
          width: 100%;
          .label {
            width: 10%;
          }
        }
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
  }
}
.att-item {
  height: auto !important;
}
.att-box {
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  span {
    line-height: 24px;
    font-size: 16px;
    color: #000000e6;
  }
}

.other {
  .edit-box {
    margin-left: 20px;
  }
  .commission-box {
    margin-top: 20px;
    padding: 0 60px;
    font-size: 16px;
    span {
      margin-right: 10px;
    }
    div {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
</style>
