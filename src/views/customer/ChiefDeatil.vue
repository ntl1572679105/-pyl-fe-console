<template>
  <PageContainer>
    <div class="container">
      <div class="topbox flex">
        <div class="top-left">
          <div class="bottom flex">
            <div class="f_1 flex" style="gap: 10px; width: 60%">
              <a-image :width="40" :src="formState.mpDetail.avatar || avatar" />
              <!-- <div style="line-height: 36px">{{ formState.mpDetail.userName }}</div> -->
              <div class="vip"><span>团长</span></div>
            </div>
            <div class="f_1">
              <div class="label">用户状态</div>
              <div class="value">{{ ComputedstatusName(formState.detail.status) }}</div>
            </div>
            <div class="f_1">
              <div class="label">消费金额</div>
              <div class="value">￥{{ formState.detail.userStatistics.orderAmount }}</div>
            </div>
            <div class="f_1">
              <div class="label">订单记录</div>
              <div class="value">
                {{ formState.detail.userStatistics.orderNum }}
              </div>
            </div>
            <div class="f_1">
              <div class="label">用户积分</div>
              <div class="value">{{ formState.detail.userStatistics.integral }}</div>
            </div>
          </div>
        </div>
        <div class="top-right"></div>
      </div>
      <div style="background-color: #fff; margin-top: 20px; padding: 20px">
        <a-tabs v-model:activeKey="activeKey" class="ant-a-tabs">
          <a-tab-pane key="1" tab="团长详情">
            <div class="top">
              <!-- <div class="part">用户资料</div> -->
              <div class="contentbox">
                <div class="f_1 detailbox">
                  <div class="label">ID编号</div>
                  <div class="value">
                    {{ formState.mpDetail.userNo }}
                  </div>
                </div>
                <!-- <div class="detailbox">
                  <div class="label">生日</div>
                  <div class="value">
                    {{ formState.mpDetail.birthday ? formState.mpDetail.birthday : '' }}
                  </div>
                </div> -->
                <div class="f_1 detailbox">
                  <div class="label">团长状态</div>
                  <div class="value">{{ ComputedstatusName(formState.mpDetail.status) }}</div>
                </div>
                <div class="detailbox">
                  <div class="label">注册时间</div>
                  <div class="value">{{ formState.mpDetail.createTime }}</div>
                </div>
                <div class="f_1 detailbox">
                  <div class="label">手机号码</div>
                  <div class="value">{{ formState.mpDetail.phone }}</div>
                </div>
                <div class="f_1 detailbox">
                  <div class="label">性别</div>
                  <div class="value">{{ sexName(formState.mpDetail.sex) }}</div>
                </div>
              </div>
            </div>
            <div class="middle-title">
              分享订单
              <a-select
                :options="options"
                label="商品模块"
                v-model:value="formState.shopType"
                placeholder="请选择"
                :defaultValue="{ value: 3, label: 'b2b商城' }"
              ></a-select>
            </div>

            <a-table
              ref="table"
              size="default"
              row-key="id"
              :columns="columns2"
              :data-source="dataSource.list2"
              :loading="loading"
              :pagination="false"
            >
              <template #bodyCell="{ column, record, index, text }">
                <!-- <template v-if="column.key === 'index'">
                  <a-space>
                    <span>{{ index + 1 }}</span>
                  </a-space>
                </template>
                <template v-if="column.key === 'type'">
                  <span>{{ typeName(text) }}</span>
                </template> -->
                <template v-if="column.dataIndex === 'productNum'">
                  <span>{{ record.shareOrderItemVos[0].num }}</span>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="用户积分" force-render>
            <a-table
              ref="table"
              size="default"
              row-key="userId"
              :columns="columns"
              :data-source="dataSource.list"
              :loading="loading"
              :pagination="false"
            >
              <template #bodyCell="{ column, record, index, text }">
                <template v-if="column.key === 'index'">
                  <a-space>
                    <span>{{ index + 1 }}</span>
                  </a-space>
                </template>
                <template v-if="column.key === 'type'">
                  <span>{{ typeName(text) }}</span>
                </template>
                <template v-if="column.key === 'bizType'">
                  <span>{{ bizTypeName(text) }}</span>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed, watch } from 'vue';
import { userDetail, integralList } from '@/api/customer.js';
import { mpUserDetail, shareList } from '@/api/regiment.js';
import avatar from '/src/assets/images/avatar.jpg';

defineProps({
  id: String,
});
const activeKey = ref('1');
const { proxy } = getCurrentInstance();
const loading = ref(false);
onMounted(() => {
  proxy.id && getDetail(proxy.id);
});

const options = [
  { value: 1, label: '集采商城' },
  { value: 2, label: '个采商城' },
  { value: 3, label: 'b2b商城' },
  // {value: 4, label: '顶级渔获'},{value: 5, label: '享生活(o2o)'}
];

const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'index',
  },
  {
    title: '变动值',
    dataIndex: 'integral',
  },
  {
    title: '变动后',
    dataIndex: 'afterIntegral',
  },
  {
    title: '变更类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '时间',
    dataIndex: 'createTime',
  },
  {
    title: '明细',
    dataIndex: 'bizType',
    key: 'bizType',
  },
];

const columns2 = [
  {
    title: '序号',
    customRender: ({ index }) => `${index + 1}`,
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
  },
  {
    title: '生成订单时间',
    dataIndex: 'orderTime',
  },
  {
    title: '商品数量',
    dataIndex: 'productNum',
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
  },
  {
    title: '团长佣金',
    dataIndex: 'commission',
  },
];

const formState = reactive({
  detail: {
    userStatistics: {
      orderAmount: '',
      orderNum: '',
      integral: '',
    },
  },
  mpDetail: {
    userNo: '',
    createTime: '',
    status: '',
    phone: '',
  },
  deliveryTypenName: '',
  statusName: '',
  userNo: '',
  status: '',
  createTime: '',
  phone: '',
  sex: '',
  shopType: 3,
  birthday: '',
});

watch(
  () => formState.shopType,
  (newVal, oldVal) => {
    console.log(newVal, oldVal);

    shareList({ regimentId: proxy.id }, formState.shopType).then((res) => {
      console.log(res);
      dataSource.list2 = res.data;
      pagination2.total = res.total;
    });
  },
);

const ComputedstatusName = computed(() => {
  return (value) => {
    // 0-正常 1-停用
    return ['正常', '停用'][value];
  };
});
const sexName = computed(() => {
  return (value) => {
    // int320-变更类型 1-收入 2-支出
    return ['未知', '女', '男'][value];
  };
});
const typeName = computed(() => {
  return (value) => {
    // int320-未知 1-女 2-男
    return ['', '收入', '支出'][value];
  };
});
const bizTypeName = computed(() => {
  return (value) => {
    // 业务类型 1-购物收入 2-购物抵扣 3-退款抵扣

    return ['', '购物收入', '购物抵扣', '退款抵扣'][value];
  };
});

const dataSource = reactive({
  list: [],
  list2: [],
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});
// 分页

const pagination2 = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const getDetail = (id) => {
  loading.value = true;
  userDetail(id)
    .then((res) => {
      console.log(res);
      // Object.keys(formState).forEach((key) => {
      //   formState.key = res[key] || undefined;
      // });
      formState.detail = res;
    })
    .finally(() => {
      loading.value = false;
    });

  mpUserDetail(id).then((res) => {
    console.log(res);
    Object.keys(formState).forEach((key) => {
      formState.key = res[key] || undefined;
    });
    // debugger;
    formState.mpDetail = res;
    // console.log(formState.detail);

    shareList({ regimentId: id }, formState.shopType).then((res) => {
      console.log(res);
      dataSource.list2 = res.data;
      pagination2.total = res.total;
    });
  });

  integralList({
    userId: proxy.id,
    // userId: 1,
  })
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
      // console.log(res);
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
  // flex: 1;
  width: 50%;
}

:deep(.ant-tabs-tab-btn) {
  font-size: 20px;
}

.ant-a-tabs {
  :deep(.userinfo) {
    display: flex;
    flex-direction: column;
  }
}

.contentbox {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}
.part {
  font-size: 20px;
  position: relative;
  padding-left: 40px;
}
.detailbox {
  display: flex;
  width: 50%;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 22px;
  padding: 0 24px 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  text-indent: 20px;
}
.detailbox .label {
  color: #000000a6;
  flex-shrink: 1;
  background: none;
  font-size: 16px;
  border-bottom: none;
  width: 20%;
  white-space: nowrap;
  text-align: right;
}
.value {
  color: #000000e6;
  flex: 1;
}
.part::before {
  position: absolute;
  content: '';
  width: 10px;
  height: 20px;
  background: #1890ff;
  top: 0;
  left: 20px;
  bottom: 0;
  margin: auto;
}

.container {
  min-height: 100vh;
  overflow-y: auto;

  .topbox {
    background: #fff;
    padding: 20px;
    box-sizing: border-box;

    .top-left {
      width: 60%;
    }

    .top-right {
      width: 40%;
      text-align: right;
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
}
.middle-title {
  color: #000;
  font-size: 20px;
  font-weight: bold;
  margin-top: 40px;
  margin-bottom: 20px;
}
.vip {
  span {
    background-color: rgb(22, 155, 213);
    border-radius: 6px;
    box-shadow: 3px 3px 5px 2px rgba(218, 220, 223, 0.7);
    padding: 2px 8px 4px 8px;
    color: white;
    font-size: 16px;
  }
}
</style>
