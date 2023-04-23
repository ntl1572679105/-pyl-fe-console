<template>
  <PageContainer>
    <div class="container">
      <div class="topbox flex">
        <div class="top-left">
          <div class="bottom flex">
            <div class="f_1 flex" style="gap: 10px; width: 60%">
              <a-image :width="40" :src="formState.avatar || avatar" />
              <!-- <div style="line-height: 36px">{{ formState.detail?.userName }}</div> -->
              <div class="vip"><span>VIP</span></div>
            </div>
            <!-- <div class="f_1">
              <div class="label">会员状态</div>
              <div class="value">{{ ComputedstatusName(formState.detail?.status) || '未知' }}</div>
            </div> -->
            <div class="f_1">
              <div class="label">消费金额</div>
              <div class="value">￥{{ formState.detail?.orderAmount || '0.00' }}</div>
            </div>
            <div class="f_1">
              <div class="label">订单记录</div>
              <div class="value">
                {{ formState.detail?.orderNumber || 0 }}
              </div>
            </div>
            <div class="f_1">
              <div class="label">会员积分</div>
              <div class="value">{{ formState.detail?.integral || 0 }}</div>
            </div>
            <div class="f_1">
              <div class="label">可用积分</div>
              <div class="value">{{ formState.detail?.integral || 0 }}</div>
            </div>
          </div>
        </div>
        <div class="top-right">
          <!-- <a-button
            type="primary"
            @click="updateInfo"
            v-permission="['']"
            style="width: 110px; margin-right: 10px; text-align: center"
          >
            修改资料</a-button
          > -->

          <!-- <a-button type="primary" @click="resetPassword" style="width: 110px; margin-right: 10px; text-align: center">
            重置密码</a-button> -->
        </div>
      </div>
      <div style="background-color: #fff; margin-top: 20px; padding: 20px; min-height: 600px">
        <a-tabs v-model:activeKey="activeKey" class="ant-a-tabs">
          <a-tab-pane key="1" tab="会员详情">
            <div class="top">
              <!-- <div class="part">会员资料</div> -->
              <div class="contentbox">
                <div class="f_1 detailbox">
                  <div class="label">ID编号</div>
                  <div class="value">
                    {{ formState.detail?.userNo || '' }}
                  </div>
                </div>
                <div class="detailbox">
                  <div class="label">生日</div>
                  <div class="value">
                    {{
                      formState.detail?.birthday
                        ? dayjs(formState.detail?.birthday).format('YYYY年MM月DD日') || ''
                        : ''
                    }}
                  </div>
                </div>
                <!-- <div class="f_1 detailbox">
                  <div class="label">会员状态</div>
                  <div class="value">{{ ComputedstatusName(formState.detail?.status) || '未知' }}</div>
                </div> -->
                <div class="detailbox">
                  <div class="label">成为会员时间</div>
                  <div class="value">{{ formState.detail?.createTime }}</div>
                </div>
                <div class="f_1 detailbox">
                  <div class="label">手机号码</div>
                  <div class="value">{{ formState.detail?.phone }}</div>
                </div>
                <div class="f_1 detailbox">
                  <div class="label">性别</div>
                  <div class="value">{{ sexName(formState.detail?.sex) }}</div>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="会员积分" force-render>
            <a-table
              ref="table"
              size="default"
              row-key="userId"
              :columns="columns"
              :data-source="dataSource.list"
              :loading="loading"
              :pagination="pagination"
              @change="tableChange"
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

      <!-- <UpdateInfoModal ref="updateInfoModal" @finish="UpdateInfoModalfinish"></UpdateInfoModal> -->
    </div>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed } from 'vue';
// import UpdateInfoModal from './components/EditVipModal.vue';
import { VipDetail, integralList } from '@/api/vip.js';
import { GetVipDetail, GetIntegralList } from '@/api/pb2b/vip.js';
import avatar from '/src/assets/images/avatar.jpg';
import dayjs from 'dayjs';

defineProps({
  id: String,
});
const activeKey = ref('1');
const { proxy } = getCurrentInstance();
const loading = ref(false);

onMounted(() => {
  proxy.id && getDetail(proxy.id);
});

// const UpdateInfoModalfinish = () => {
//   proxy.id && getDetail(proxy.id);
// };
const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'index',
  },
  {
    title: '变动值',
    dataIndex: 'integral',
    key: 'mark',
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

const formState = reactive({
  // deliveryTypenName: '',
  // statusName: '',
  // userNo: '',
  // status: '',
  // createTime: '',
  // phone: '',
  avatar: '',
  sex: '',
  birthday: '',
});
const ComputedstatusName = computed(() => {
  return (value) => {
    // 0-正常 1-停用
    return ['正常', '停用'][value];
  };
});
const sexName = computed(() => {
  return (value) => {
    return ['未知', '女', '男'][value];
  };
});
const typeName = computed(() => {
  return (value) => {
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
  params: {},
});
// const updateInfo = () => {
//   proxy.$refs.updateInfoModal.show(proxy.id, formState.detail);
// };
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});
// 分页
const tableChange = (page) => {
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(proxy.id);
};
const apiType = reactive({});
apiType.value = proxy.$route.query.type;

const getDetail = (id) => {
  const api = apiType.value === '1' ? VipDetail : GetVipDetail;
  api({ id }).then((res) => {
    console.log(res);
    Object.keys(formState).forEach((key) => {
      formState.key = res[key] || undefined;
    });
    formState.detail = res;
    formState.avatar = res.avatar;
  });
  getList(id);
};

const getList = (id) => {
  loading.value = true;
  const api2 = apiType.value === '1' ? integralList : GetIntegralList;
  api2({
    userId: id,
    // userId: 1,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
  })
    .then((res) => {
      dataSource.list = res.data;
      pagination.total = res.total;
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

.vip {
  span {
    background-color: goldenrod;
    border-radius: 6px;
    box-shadow: 3px 3px 5px 2px rgba(218, 220, 223, 0.7);
    padding: 0 4px;
    color: white;
  }
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
  font-size: 16px;
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
  // font-size: 16px;
  border-bottom: none;
  // width: 20%;
  width: 120px;
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
</style>
