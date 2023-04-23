<template>
  <PageContainer>
    <div class="container">
      <div class="orderdetailbox">
        <div class="top">
          <div class="part">商家基本信息</div>
          <div class="formBox" style="padding: 50px">
            <a-form
              :rules="rules"
              ref="formRef"
              :model="formState"
              :label-col="{ xs: 24, md: 5 }"
              :wrapper-col="{ xs: 24, md: 14 }"
              label-align="left"
            >
              <a-form-item label="商家名称" name="name" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.name" placeholder="请输入商家名称" />
              </a-form-item>
              <a-form-item label="商家Id" name="id" style="display: none" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.id" />
              </a-form-item>
              <a-form-item label="平均消费价" name="averageConsumption" class="f_1 label">
                <a-input
                  :disabled="view"
                  v-model:value="formState.averageConsumption"
                  placeholder="请输入平均消费价"
                />
              </a-form-item>
              <a-form-item label="营业时间" name="time" class="f_1 label">
                <a-time-range-picker
                  :disabled="view"
                  format="HH:mm"
                  v-model:value="formState.time"
                  @change="onChange"
                />
              </a-form-item>
              <a-form-item label="统一社会信用码" name="unifiedCreditCode" class="f_1 label">
                <a-input
                  :disabled="view"
                  v-model:value="formState.unifiedCreditCode"
                  placeholder="请输入统一社会信用码"
                />
              </a-form-item>
              <a-form-item label="账户信息" name="accountInfo" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.accountInfo" placeholder="请输入账户信息" />
              </a-form-item>
              <a-form-item label="场地情况" name="siteCondition" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.siteCondition" placeholder="请输入场地情况" />
              </a-form-item>
              <a-form-item label="店铺设施" name="facility" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.facility" placeholder="请输入店铺设施" />
              </a-form-item>
              <a-form-item label="店铺说明" name="introduction" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.introduction" placeholder="请输入店铺说明" />
              </a-form-item>
              <a-form-item label="联系人" name="linkman" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.linkman" placeholder="请输入联系人" />
              </a-form-item>
              <a-form-item label="联系方式" name="phone" class="f_1 label">
                <a-input :disabled="view" v-model:value="formState.phone" placeholder="请输入联系方式" />
              </a-form-item>
              <a-form-item label="密码" v-if="!id" name="password" class="f_1 label">
                <a-input
                  :disabled="view"
                  v-model:value="formState.password"
                  type="password"
                  placeholder="请输入密码"
                />
              </a-form-item>
              <a-form-item label="店铺分类" name="shopCategoryId" class="label">
                <a-select
                  :disabled="view"
                  v-model:value="formState.shopCategoryId"
                  :options="categoryOptions"
                  change-on-select
                  placeholder="请选择店铺分类"
                />
              </a-form-item>
              <a-form-item label="场馆照片" name="introImgUrls" class="label">
                <ImageUpload
                  v-if="detailLoading"
                  :max="9"
                  :mulintroductionle="true"
                  :isDraggable="false"
                  v-model:imageUrls="formState.introImgUrls"
                  :originUrls="formState.introImgUrls"
                  @nrpreView="handlePreview"
                  @finish="changeIntroImages"
                >
                </ImageUpload>
              </a-form-item>
              <a-form-item label="店铺logo" name="logo" class="label">
                <ImageUpload
                  v-if="detailLoading"
                  :max="1"
                  :isDraggable="false"
                  @finish="changeLogoImages"
                  :originUrls="formState.logo"
                  @nrpreView="handlePreview"
                />
              </a-form-item>
              <a-form-item label="详细地址" name="address" class="label">
                <a-input :disabled="view" v-model:value="formState.address" placeholder="请输入详细地址" disabled />
              </a-form-item>
              <a-form-item label="纬度" name="latitude" style="display: none" class="label">
                <a-input :disabled="view" v-model:value="formState.latitude" placeholder="请输入" disabled />
              </a-form-item>
              <a-form-item label="经度" name="longitude" style="display: none" class="label">
                <a-input :disabled="view" v-model:value="formState.longitude" placeholder="请输入" disabled />
              </a-form-item>
              <a-form-item label="省" name="province" style="display: none" class="label">
                <a-input :disabled="view" v-model:value="formState.province" placeholder="请输入" disabled />
              </a-form-item>
              <a-form-item label="市" name="city" style="display: none" class="label">
                <a-input :disabled="view" v-model:value="formState.city" placeholder="请输入" disabled />
              </a-form-item>
              <a-form-item label="区" name="district" style="display: none" class="label">
                <a-input :disabled="view" v-model:value="formState.district" placeholder="请输入" disabled />
              </a-form-item>
              <span v-if="!view" class="changeAddress" style="margin-left: 50px; color: red"
                >点击地图更换定位地址或者输入地址搜索位置</span
              >
              <TMapView v-if="!view" style="z-index: 0" @finish="choose"></TMapView>
            </a-form>
          </div>
        </div>
        <div class="two" v-if="id" style="padding: 30px">
          <div class="flex">
            <div class="part f_1">商家商品</div>
            <a-button v-if="!view" style="width: 200px;margin-top: 20px;" type="primary" @click="gotoAdd"
              >添加商品</a-button
            >
          </div>
          <a-table
            ref="table"
            size="default"
            row-key="roleId"
            :columns="columns"
            style="margin-top: 8px;"
            :data-source="dataSource.list"
            :loading="loading"
            :pagination="pagination"
            @change="tableChange"
          >
            <template #bodyCell="{ column, record, index, text }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="text" :style="{ 'color': view ? grey : 'rgb(24, 144, 255)' }" @click="handleEdit(record)" :disabled="view">修改</a-button>
                </a-space>
              </template>
              <template v-if="column.dataIndex === 'useTime'">
                {{ record.useStartTime + '至' + record.useEndTime }}
              </template>
              <template v-if="column.dataIndex === 'validEndTime'">
                {{ record.validStartTime + '至' + record.validEndTime }}
              </template>
            </template>
          </a-table>
        </div>
        <div
          class="btnbox"
          v-if="!view"
          style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; padding: 20px;"
        >
          <a-button
            type="primary"
            @click="submit"
            style="width: 100px"
            :loading="loading"
            ><span v-if="!proxy.id">提交</span><span v-else>保存</span></a-button
          >
        </div>
      </div>
      <AddGoods ref="addGoodsModal" @finish="finish"></AddGoods>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" centered width="500px">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, defineProps, computed } from 'vue';
import TMapView from '@/components/TMap/index.vue';
import ImageUpload from '@/components/UploadCustom/index.vue';
import AddGoods from '@/views/xsh/goods/components/addGoods.vue';
import dayjs from 'dayjs';
import {
  shangjiaDetail,
  cateList,
  shangjiaAdd,
  shangjiaEdit,
  shangjiaList,
} from '@/api/o2o/shangjia.js';
import { typeList, goodsList, goodsDetail } from '@/api/o2o/goods.js';
import { formRules } from '@/utils/rules.js';

defineProps({
  id: String,
});

const formItems = ref([
  {
    type: 'text',
    label: '商品编号',
    value: 'productNo',
  },
  {
    type: 'select',
    label: '所属商家',
    value: 'shopId',
    options: [],
  },
]);

const view = ref(false);

const { proxy } = getCurrentInstance();
// const dateFormat = 'YYYY/MM/DD';
const categoryOptions = ref([]);
const formRef = ref();

const loading = ref(false);
const detailLoading = ref(false);
// const updateReceiver = ref(undefined);
onMounted(() => {
  if (proxy.id) {
    getDetail(proxy.id);
  } else {
    detailLoading.value = true;
  }
  if (proxy.$route.meta.type == 3) {
    view.value = true;
  } else {
    view.value = false;
  }
  getGoodsTypeList();
  getShopList();
  cateList().then((res) => {
    res.data.forEach((item) => {
      categoryOptions.value.push({
        label: item.name,
        value: item.id,
      });
    });
  });
});

// 获取 商品分类、商家列表数据
const getGoodsTypeList = () => {
  typeList({ pageNum: 1, pageSize: 999 }).then((res) => {
    const options = res.data.map((item) => ({ label: item.name, value: item.id }));
    formItems.value[0].options = options;
  });
};
const getShopList = () => {
  shangjiaList({ pageNum: 1, pageSize: 999 }).then((res) => {
    const options = res.data.map((item) => ({ label: item.name, value: item.id }));
    formItems.value[1].options = options;
  });
};

const formState = reactive({
  id: '',
  name: '',
  time: '',
  unifiedCreditCode: '',
  accountInfo: '',
  siteCondition: '',
  facility: '',
  introduction: '',
  linkman: '',
  phone: '',
  password: '',
  shopCategoryId: '',
  introImgUrls: [],
  address: '',
  province: '',
  city: '',
  district: '',
  longitude: '',
  latitude: '',
  logo: [],
  averageConsumption: '',
});

const rules = reactive({
  name: [{ required: true, message: '商家名称不能为空' }],
  time: [{ required: true, message: '营业时间不能为空' }],
  unifiedCreditCode: formRules('unifiedCreditCodeRequired'),
  accountInfo: [{ required: true, message: '账户信息不能为空' }],
  address: [{ required: true, message: '详细地址不能为空' }],
  averageConsumption: [{ required: true, message: '平均消费价不能为空' }],
  introImgUrls: [{ required: true, message: '场馆照片不能为空' }],
  shopCategoryId: [{ required: true, message: '请选择店铺分类' }],
  password: [{ required: true, min: 6, max: 20, message: '请输入6~20位密码' }],
  phone: formRules('cellPhone'),
  linkman: [{ required: true, message: '联系人不能为空' }],
  logo: [{ required: true, message: '店铺logo不能为空' }],
});

const choose = (result) => {
  Object.assign(formState, result);
};
const columns = [
  {
    title: '商品名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '单价',
    dataIndex: 'price',
    customRender: ({ text }) => (text ? `￥${text}` : '-'),
  },
  {
    title: '有效期',
    dataIndex: 'validEndTime',
    width: 200,
  },
  {
    title: '使用时间',
    dataIndex: 'useTime',
    width: 110,
  },
  {
    title: '套餐说明',
    ellipsis: true,
    dataIndex: 'introduction',
  },
  {
    title: '上架时间',
    dataIndex: 'createTime',
  },
  {
    title: '库存',
    dataIndex: 'stock',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
];

const dataSource = reactive({
  list: [],
  guige: [],
});

const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 5,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

const changeIntroImages = (images) => {
  formState.introImgUrls = images;
};

const changeLogoImages = (images) => {
  formState.logo = images;
};
const apiType = ref('');
apiType.value = proxy.$route.meta.type;
const gotoAdd = () => {
  // console.log(proxy,'proxy')
  proxy.$refs.addGoodsModal.show({ shopId: formState.id }, formItems.value[0].options, formItems.value[1].options, true);
};
const handleEdit = (record) => {
  if (view.value) {
    return;
  }
  goodsDetail(record.id).then((res) => {
    proxy.$refs.addGoodsModal.show(res, formItems.value[0].options, formItems.value[1].options);
  });
};

// 图片预览相关
const previewVisible = ref(false);
const previewImage = ref('');
const handlePreview = (file) => {
  console.log(file);
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};  

const previewCancel = () => {
  previewVisible.value = false;
};

const tableChange = () => {};
const finish = () => {
  getDetail(proxy.id);
};
const getDetail = (id) => {
  loading.value = true;
  shangjiaDetail(id)
    .then((res) => {
      formState.detail = res;
      Object.keys(res).forEach((key) => {
        formState[key] = res[key];
      });
      formState.introImgUrls = res.imgUrls;
      if (res.logo) {
        formState.logo = [res.logo];
      }
      detailLoading.value = true;
      console.log(formState.introImgUrls);
      formState.time = [dayjs(res.businessStartTime, 'HH:mm'), dayjs(res.businessEndTime, 'HH:mm')];
      const requestParameters = Object.assign({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        shopId: res.id,
      });
      goodsList(requestParameters).then((res) => {
        dataSource.list = res.data;
        pagination.total = res.total;
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
const submit = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    console.log(values);
    const params = { ...values };
    params.businessStartTime = dayjs(formState.time[0]).format('HH:mm:ss');
    params.businessEndTime = dayjs(formState.time[1]).format('HH:mm:ss');
    params.time = undefined;
    params.shopCategoryId = values.shopCategoryId;
    if (values.logo) {
      params.logo = values.logo[0];
    }
    if (!values.id) {
      params.id = undefined;
    }
    const api = proxy.id ? shangjiaEdit : shangjiaAdd;
    const content = proxy.id ? '编辑成功' : '新增成功';
    api(params)
      .then((res) => {
        console.log(res);
        proxy.$message.success(content);
        proxy.$router.push({ path: '/xsh-shangjiaManage' });
      })
      .finally(() => {
        loading.value = false;
      });
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
    // margin: 20px 0px;
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
      height: 40px;
      line-height: 40px;
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
  }
  .formBox {
    min-height: 100vh;
    overflow-y: hidden;
    :deep(.ant-form-item-label > label) {
      font-size: 16px;
    }
  }
}
</style>
