<template>
  <PageContainer>
    <a-card :bordered="false">
      <a-spin :spinning="getiing">
        <div class="one">
          <div class="part">基础信息</div>
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 10 }"
            label-align="right"
          >
            <a-form-item label="编号" name="id" style="display: none">
              <a-input v-model:value="formState.id" disabled></a-input>
            </a-form-item>
            <a-form-item label="商品货号" name="articleNo" v-if="proxy.$route.meta.type === 1">
              <a-input
                v-model:value="formState.articleNo"
                style="width: 100%"
                allowClear
                placeholder="输入内容"
              />
            </a-form-item>
            <a-form-item label="商品名称" name="name">
              <a-input
                v-model:value="formState.name"
                style="width: 100%"
                allowClear
                placeholder="输入内容"
              />
            </a-form-item>
            <a-form-item label="商品介绍" name="info">
              <a-input
                v-model:value="formState.info"
                style="width: 100%"
                allowClear
                placeholder="输入内容"
              />
            </a-form-item>
            <a-form-item label="品牌" name="brand" v-if="proxy.$route.meta.type === 1">
              <a-input
                v-model:value="formState.brand"
                style="width: 100%"
                allowClear
                placeholder="输入内容"
              />
            </a-form-item>
            <a-form-item label="类目" name="categoryIds">
              <a-cascader
                v-model:value="formState.categoryIds"
                :options="productCategoryList"
                placeholder="请选择"
                change-on-select
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="限购数量" name="limitNum">
              <a-input-number
                v-model:value="formState.limitNum"
                style="width: 100%"
                :min="0"
                placeholder="输入内容"
              />
            </a-form-item>
            <a-form-item label="商品规格" name="isDefault">
              <a-radio-group name="radioGroup" v-model:value="formState.isDefault">
                <a-radio value="1" @change="showTip">启用</a-radio>
                <a-radio value="0">不启用</a-radio>
              </a-radio-group>
            </a-form-item>
            <div class="two" v-if="isDefaultFlag">
              <a-button @click="skuAdd" type="primary" style="margin-left: 40px; margin-top: 20px"
                >添加规格</a-button
              >
              <div v-for="(item, index) in skuFormState.skus" :key="index" class="sku-box">
                <div class="sku-box-top">
                  <a-space>
                    <span>规格名称</span>
                    <a-input
                      v-if="item.isEdit"
                      placeholder="请输入"
                      v-model:value="item.key"
                    ></a-input>
                    <span v-else>{{ item.key }}</span>
                  </a-space>
                  <a-button type="primary" v-if="item.isEdit" @click="skuSave(item, index)"
                    >保存</a-button
                  >
                  <a-space v-else>
                    <a-button type="primary" @click="item.isEdit = true">编辑</a-button>
                    <a-button danger @click="skuRemove(item, index)">删除规格</a-button>
                  </a-space>
                </div>
                <div class="sku-box-bottom">
                  <div v-for="(sku, j) in item.values" :key="j" class="sku-box-item">
                    <span>{{ sku.key }}</span>
                    <a-input
                      v-if="item.isEdit"
                      style="width: 120px"
                      placeholder="请输入"
                      v-model:value="sku.value"
                    ></a-input>
                    <span v-else>{{ sku.value }}</span>
                    <a-button v-if="item.isEdit" danger @click="skuItemRemove(item, j)"
                      >删除</a-button
                    >
                  </div>
                </div>
                <a-button
                  v-if="item.isEdit"
                  @click="skuItemAdd(item, index)"
                  type="primary"
                  style="margin-top: 20px"
                  >添加规格值
                </a-button>
              </div>
              <div style="padding: 10px 40px">
                <a-button @click="skuProductAdd" type="primary" style="margin-top: 20px"
                  >添加sku</a-button
                >
                <a-table
                  ref="table"
                  size="default"
                  row-key="id"
                  :columns="resultColums"
                  :data-source="skuFormState.products"
                  :pagination="false"
                  :scroll="{ x: 1700 }"
                  style="margin-top: 20px"
                >
                  <template #headerCell="{ column }">
                    <template v-if="column.dataIndex === 'settlePrice'">
                      <span style="color: orangered">*</span>{{ column.title }}
                      <a-tooltip placement="topLeft">
                        <template #title>{{ column.tipContent }}</template>
                        <question-circle-outlined />
                      </a-tooltip>
                    </template>
                    <template v-else-if="column.must">
                      <span style="color: orangered">*</span>{{ column.title }}
                    </template>
                    <template v-else-if="column.tip === 'show'">
                      {{ column.title }}
                      <a-tooltip placement="topLeft">
                        <template #title>{{ column.tipContent }}</template>
                        <question-circle-outlined />
                      </a-tooltip>
                    </template>
                  </template>
                  <template #bodyCell="{ column, record, index, text }">
                    <template v-if="column.key === 'action'">
                      <a-space v-if="record.isDefault !== 1">
                        <a
                          v-if="record.isEdit"
                          @click="skuProductSave(record)"
                          style="margin-right: 10px"
                          >保存</a
                        >
                        <a
                          v-else
                          @click="(record.isEdit = true), (isRequired = false)"
                          style="margin-right: 10px"
                          >编辑</a
                        >
                        <a @click="skuProductRemove(record, index)" style="color: orangered"
                          >删除</a
                        >
                      </a-space>
                    </template>
                    <template v-else-if="column.key === 'img'">
                      <a-upload
                        v-if="record.isEdit"
                        v-model:file-list="record.imgList"
                        :customRequest="handleSkuImage"
                        list-type="picture-card"
                        class="avatar-uploader"
                        accept="image/png, image/jpeg, image/jpg"
                        :data="{ index: index, type: 1 }"
                        :before-upload="beforeUpload"
                        @preview="handlePreview"
                        @remove="handleSkuImageRemove(record, 1)"
                      >
                        <div v-if="!record.imgList || record.imgList.length < 1">
                          <loading-outlined v-if="record.uploading"></loading-outlined>
                          <plus-outlined v-else></plus-outlined>
                          <div class="ant-upload-text">上传</div>
                        </div>
                      </a-upload>
                      <a-image v-else :width="40" :src="text" />
                    </template>
                    <template v-else-if="column.key === 'price'">
                      <a-input-number
                        v-if="record.isEdit"
                        v-model:value="record.price"
                        :min="0.01"
                        :max="99999"
                        style="width: 100%"
                      />
                      <span v-else>{{ totalAmount(text) }}</span>
                    </template>
                    <template v-else-if="column.key === 'settlePrice'">
                      <a-input-number
                        v-if="record.isEdit"
                        v-model:value="record.settlePrice"
                        :min="0.01"
                        :max="99999"
                        style="width: 100%"
                      />
                      <span v-else>{{ totalAmount(text) }}</span>
                    </template>
                    <template v-else-if="column.key === 'normalPrice'">
                      <a-input-number
                        v-if="record.isEdit"
                        v-model:value="record.normalPrice"
                        :min="0.01"
                        :max="99999"
                        style="width: 100%"
                      />
                      <span v-else>{{ totalAmount(text) }}</span>
                    </template>
                    <template v-else-if="column.key === 'stock'">
                      <a-input-number
                        v-if="record.isEdit"
                        v-model:value="record.stock"
                        style="width: 100%"
                        :min="0"
                        :max="99999"
                        :precision="0"
                      />
                      <span v-else>{{ text }}</span>
                    </template>
                    <template v-else-if="column.dataIndex === 'platformRate'">
                      {{ formState.platformRate }}%
                    </template>
                    <template v-else-if="column.dataIndex === 'chiefRate'">
                      {{
                        (
                          (1 - record.settlePrice / record.price - formState.platformRate * 0.01 > 0
                            ? 1 - record.settlePrice / record.price - formState.platformRate * 0.01
                            : 0) * 100
                        ).toFixed(2)
                      }}%
                    </template>
                    <template v-else-if="column.dataIndex === 'platformAmount'">
                      {{ totalAmount(formState.platformRate * record.price * 0.01) }}
                    </template>
                    <template v-else-if="column.dataIndex === 'chiefAmount'">
                      {{
                        totalAmount(
                          (1 - record.settlePrice / record.price - formState.platformRate * 0.01 > 0
                            ? 1 - record.settlePrice / record.price - formState.platformRate * 0.01
                            : 0) * record.price,
                        )
                      }}
                    </template>
                    <template v-else>
                      <a-select
                        v-if="record.isEdit"
                        style="width: 100%"
                        placeholder="请选择"
                        v-model:value="record[column.dataIndex]"
                        :options="skuValuesOptions(column.dataIndex)"
                      ></a-select>
                      <span v-else>{{ text }}</span>
                    </template>
                  </template>
                </a-table>
              </div>
            </div>
            <div v-if="!isDefaultFlag">
              <a-form-item label="平台售价" name="price">
                <a-input-number
                  v-model:value="formState.price"
                  :disabled="proxy.id !== undefined && isDefaultFlag"
                  :min="0.01"
                  :max="99999"
                  prefix="￥"
                  style="width: 100%"
                  placeholder="输入内容"
                  @change="numChange"
                />
              </a-form-item>
              <a-form-item label="划线价格" name="normalPrice">
                <a-input-number
                  v-model:value="formState.normalPrice"
                  :disabled="proxy.id !== undefined && isDefaultFlag"
                  :min="0.01"
                  :max="99999"
                  prefix="￥"
                  style="width: 100%"
                  placeholder="输入内容"
                />
                <a-tooltip a-tooltip placement="topLeft">
                  <span style="color: #c9c9c9">说明：营销活动展示价格</span>
                </a-tooltip>
              </a-form-item>
              <a-form-item label="商品结算价" name="settlePrice">
                <div class="flex-row">
                  <a-input-number
                    v-model:value="formState.settlePrice"
                    :min="0.01"
                    :max="settlePriceMax"
                    :disabled="proxy.id !== undefined && isDefaultFlag"
                    prefix="￥"
                    :precision="2"
                    style="width: 100%"
                    placeholder="输入内容"
                    @change="numChange"
                  />
                </div>
                <a-tooltip a-tooltip placement="topLeft">
                  <span style="color: #c9c9c9"
                    >说明：商品供应商的结算价格，又称商品进价，该价格在用户端不显示商品结算格 &lt;=
                    (1-平台扣点比例)平台售价</span
                  >
                </a-tooltip>
              </a-form-item>
              <a-form-item label="平台分佣比例" name="platformRate">
                <div class="flex-row">
                  <a-input-number
                    v-model:value="formState.platformRate"
                    :min="0.1"
                    :max="100"
                    addon-after="%"
                    style="width: 50%"
                    :disabled="true"
                    @change="numChange"
                  />
                  <span style="line-height: 32px; padding-left: 10px"
                    >平台分佣金额: ￥{{
                      ((formState.price * formState.platformRate) / 100).toFixed(2)
                    }}</span
                  >
                </div>
                <a-tooltip placement="topLeft">
                  <span style="color: #c9c9c9"
                    >说明：该比例由平台统一设定，非平台运营方不可修改</span
                  >
                </a-tooltip>
              </a-form-item>
              <a-form-item label="团长分佣比例" name="chiefRate">
                <div class="flex-row">
                  <a-input-number
                    v-model:value="formState.chiefRate"
                    :min="0.1"
                    :max="100"
                    :precision="1"
                    addon-after="%"
                    style="width: 50%"
                    :disabled="true"
                  />
                  <span style="line-height: 32px; padding-left: 10px"
                    >团长分佣金额: ￥{{
                      (
                        (formState.price * formState.chiefRate > 0
                          ? formState.price * formState.chiefRate
                          : 0) / 100
                      ).toFixed(2)
                    }}</span
                  >
                </div>
                <a-tooltip placement="topLeft">
                  <span style="color: #c9c9c9"
                    >说明：团长分佣比例=1-结算价格/平台售价-平台分佣比例</span
                  >
                </a-tooltip>
              </a-form-item>
              <a-form-item label="库存" name="stock">
                <a-input-number
                  v-if="proxy.id"
                  disabled
                  v-model:value="formState.stock"
                  style="width: 100%"
                  :min="0"
                  :precision="0"
                  placeholder="输入内容"
                />
                <a-input-number
                  v-else
                  v-model:value="formState.stock"
                  style="width: 100%"
                  :min="0"
                  placeholder="输入内容"
                />
              </a-form-item>
            </div>
            <a-form-item label="主图" name="mainImgUrl" v-if="!isDefaultFlag">
              <a-upload
                v-model:file-list="mainFileList"
                :customRequest="handleMainUpload"
                name="mainImg"
                list-type="picture-card"
                class="avatar-uploader"
                accept="image/png, image/jpeg, image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @remove="handleMainRemove"
              >
                <div v-if="mainFileList.length < 1">
                  <loading-outlined v-if="mainUploading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item
              label="轮播图"
              name="sliderImgUrls"
              :style="{ marginTop: isDefaultFlag ? '40px' : '0' }"
            >
              <ImageUpload
                v-if="detailLoading"
                :max="9"
                :multiple="true"
                :isDraggable="true"
                v-model:imageUrls="formState.sliderImgUrls"
                :originUrls="formState.sliderImgUrls"
                @finish="changeSliderImages"
                @nrpreView="handlePreview"
                @draggableChange="tzdragChange"
              />
            </a-form-item>
            <a-form-item label="介绍图" name="infoImgUrls">
              <ImageUpload
                v-if="detailLoading"
                :max="9"
                :multiple="true"
                :isDraggable="true"
                v-model:imageUrls="formState.infoImgUrls"
                :originUrls="formState.infoImgUrls"
                @nrpreView="handlePreview"
                @draggableChange="infodragChange"
              />
            </a-form-item>
          </a-form>
        </div>
        <div class="three" style="margin-top: 15px">
          <div class="part">说明信息</div>
          <a-form ref="attrForm" name="attr-form" :model="attrFormState" class="attrForm">
            <a-space
              v-for="(item, index) in attrFormState.attrList"
              :key="index"
              style="display: flex; margin-bottom: 8px"
              align="baseline"
            >
              <a-form-item
                :name="['attrList', index, 'key']"
                required
                label="属性名称"
                :rules="[
                  {
                    required: true,
                    message: '请输入属性名称',
                  },
                ]"
              >
                <a-input v-model:value="item.key" placeholder="请输入属性名称" />
              </a-form-item>
              <a-form-item
                :name="['attrList', index, 'value']"
                required
                label="属性值"
                :rules="[
                  {
                    required: true,
                    message: '请输入属性值',
                  },
                ]"
              >
                <a-input v-model:value="item.value" placeholder="请输入属性值" />
              </a-form-item>
              <MinusCircleOutlined @click="removeAtts(item, index)" />
            </a-space>
          </a-form>

          <div class="btn" style="display: flex; align-items: center">
            <a-button type="primary" @click="addAtts" style="text-align: center; margin: 0 30%"
              >添加说明
            </a-button>
          </div>
        </div>
        <div
          class="btnbox"
          style="display: flex; justify-content: center; align-items: center; margin-top: 20px"
        >
          <a-button type="primary" @click="submit" :loading="loading" style="margin-right: 15px"
            >提交</a-button
          >
        </div>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
          centered
          width="500px"
        >
          <img style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-spin>
    </a-card>
  </PageContainer>
</template>

<script setup>
import {
  PlusOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import { reactive, ref, getCurrentInstance, onMounted, defineProps, computed } from 'vue';
import { goodsListDetail, addGoods, updateGoods } from '@/api/goods.js';
import { commonRatioDetail } from '@/api/ratio.js';
import { Upload } from '@/api/common.js';
import { categoryList } from '@/api/system.js';
import ImageUpload from '@/components/UploadCustom/index.vue';

const { proxy } = getCurrentInstance();
defineProps({
  id: String,
});

/// 基础信息
const detailLoading = ref(false);
const formRef = ref();
const mainFileList = ref([]);

const mainUploading = ref(false);
const formState = reactive({
  id: undefined,
  name: '', // 商品名称，
  info: '', // 商品介绍
  price: '',
  stock: '',
  mainImgUrl: '', // 主图
  sliderImgUrls: [],
  infoImgUrls: [],
  attrList: [], // 属性值
  categoryIds: [],
  limitNum: undefined, // 限购数量
  isDefault: '0', // 是否为默认
  articleNo: '',
  brand: '',
  normalPrice: '',
  settlePrice: '',
  chiefRate: 0,
  platformRate: '',
});
const settlePriceMax = computed(() => {
  return (1 - formState.platformRate * 0.01) * formState.price;
});
const imgchange = ref();
const infoImgchange = ref();

const isDefaultFlag = computed(() => {
  if (formState.isDefault == 0) {
    return false;
  } else {
    return true;
  }
});

const numChange = (e) => {
  // console.log(e,'e,type');
  // console.log((1 - (formState.settlePrice / formState.price) - (formState.platformRate * 0.01)) * 100,'xxx');
  formState.chiefRate =
    (1 - formState.settlePrice / formState.price - formState.platformRate * 0.01) * 100;
  // console.log(formState.chiefRate,'formState.chiefRate');
  if (formState.chiefRate < 0) {
    formState.chiefRate = 0;
  }
};
const imageValidator = (rule, value) => {
  // console.log(value);
  if (value && value.length > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('请上传轮播图'));
};

const rules = reactive({
  name: [{ required: true, message: '请输入商品名称' }],
  info: [{ required: true, message: '请输入商品介绍' }],
  price: [{ required: true, message: '请输入商品价格' }],
  stock: [{ required: true, message: '请输入商品库存' }],
  categoryIds: [{ required: true, message: '请选择类目' }],
  mainImgUrl: [{ required: true, message: '请上传商品图片' }],
  isDefault: [{ required: true, message: '请选择' }],
  sliderImgUrls: [{ required: true, validator: imageValidator, trigger: 'change' }],
  // limitNum: [{ required: true, message: '请输入限购数量' }],
  articleNo: [{ required: true, message: '请输入商品货号' }],
  brand: [{ required: true, message: '请输入品牌' }],
  // normalPrice: [{ required: true, message: '请输入正常售价' }],
  settlePrice: [{ required: true, message: '请输入结算价格' }],
});

const sliderImgUrlsValidator = (rule, value, callback) => {
  if (value == '') {
    return Promise.reject(new Error('轮播图内容不能为空'));
  } else {
    return Promise.resolve();
  }
};
// 主图和副图的添加删除
const handleMainRemove = () => {
  mainFileList.value = [];
  formState.mainImgUrl = '';
};

const handleMainUpload = ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);
  mainUploading.value = true;
  Upload(formData)
    .then((res) => {
      mainFileList.value = [
        {
          status: 'done',
          url: res.fileUrl,
          name: res.fileName,
        },
      ];
      formState.mainImgUrl = res.fileUrl;
      mainUploading.value = false;
      formRef.value.validateFields();
    })
    .catch(() => {
      mainUploading.value = false;
      handleMainRemove();
      proxy.$message.error('图片上传失败，请重试');
    });
};

/// 规格信息
const skuFormState = reactive({
  skus: [],
  products: [],
});

const showTip = () => {
  proxy.$message.warning('启用商品规格后，至少有2个sku才能提交成功');
  skuFormState.products = [];
  skuFormState.skus = [];
};

// 添加规格
const skuAdd = () => {
  skuFormState.skus.push({ key: '', isEdit: true, values: [{ key: '规格值1', value: '' }] });
};

// 规格保存
const skuSave = (item, index) => {
  const isDone = item.values.every((sku) => sku.value.trim() !== '') && item.key !== '';
  if (isDone) {
    item.isEdit = false;
    cleanProductSku();
  } else {
    proxy.$message.warning('请填写规格');
  }
};

// 规格删除
const skuRemove = (item, index) => {
  skuFormState.skus.splice(index, 1);
  cleanProductSku();
};
// 金额
const totalAmount = computed(() => {
  return (values) => {
    return values ? `￥${Number(values).toFixed(2)}` : '￥0.00';
  };
});
// 遍历已有商品sku表，删除不在的内容
const cleanProductSku = () => {
  const skus = [];
  skuFormState.skus.forEach((sku) => {
    skus.push({
      title: sku.key,
      dataIndex: sku.key,
      key: 'sku-item',
    });
  });
  // debugger
  resultColums.value = skus.concat(originColumns);
  // const length = skuFormState.products.length
  // for (let index = length - 1; index > 0; index--) {
  //   const product = skuFormState.products[index];
  //   if
  // }
};

// 添加规格值
const skuItemAdd = (item, index) => {
  skuFormState.skus[index].values.push({
    key: `规格值${skuFormState.skus[index].values.length + 1}`,
    value: '',
  });
};

// 删除规格值
const skuItemRemove = (item, index) => {
  item.values.splice(index, 1);
  item.values.forEach((sku, j) => {
    sku.key = `规格值${j + 1}`;
  });
};

// sku基础商品列
const originColumns = [
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
    must: true,
    width: 120,
  },
  // {
  //   title: '*限购数量',
  //   dataIndex: 'stock',
  // },
  {
    title: '主图',
    dataIndex: 'mainImgUrl',
    key: 'img',
    must: true,
    width: 150,
  },
  {
    title: '平台售价',
    dataIndex: 'price',
    key: 'price',
    must: true,
    width: 100,
  },
  {
    title: '划线价格',
    dataIndex: 'normalPrice',
    key: 'normalPrice',
    tip: 'show',
    tipContent: '说明：营销活动展示价格',
    width: 110,
  },
  {
    title: '商品结算价',
    dataIndex: 'settlePrice',
    key: 'settlePrice',
    tip: 'show',
    must: true,
    tipContent:
      '说明：商品供应商的结算价格，又称商品进价，该价格在用户端不显示。商品结算格<=(1-平台扣点比例)平台售价',
    width: 150,
  },
  {
    title: '平台分佣比例',
    dataIndex: 'platformRate',
    tip: 'show',
    tipContent: '说明：该比例由平台统一设定，非平台运营方不可修改',
    width: 150,
  },
  {
    title: '平台分佣金额',
    dataIndex: 'platformAmount',
    width: 150,
  },
  {
    title: '团长分佣比例',
    dataIndex: 'chiefRate',
    tip: 'show',
    tipContent: '计算公式：团长分佣比例=1-结算价格/平台售价-平台分佣比例',
    width: 150,
  },
  {
    title: '团长分佣金额',
    dataIndex: 'chiefAmount',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    fixed: 'right',
    width: 120,
  },
];

const changeSliderImages = (images) => {
  formState.sliderImgUrls = images;
};

// 添加规格后的商品列
const resultColums = ref(originColumns);
// 判断是否有sku按钮

// 添加商品
const skuProductAdd = () => {
  if (skuFormState.skus.length <= 0) {
    proxy.$message.warning('请先添加规格');
    return;
  }
  const item = {
    mainImgUrl: '',
    stock: '',
    price: '',
    settlePrice: '',
    normalPrice: '',
    isEdit: true, // 是否在编辑
    imgList: [], // 图片list，作用于a-upload组件
    uploading: false, // 图片是否在上传
  };
  skuFormState.skus.forEach((sku) => {
    item[sku.key] = '';
  });
  skuFormState.products.push(item);
  console.log(skuFormState);
};

// 保存sku商品
const skuProductSave = (record) => {
  // 判断是否有无填写内容，提示
  // 不需要判断uploading
  const { uploading, sales, isEdit, ...content } = record;
  const keys = Object.keys(content);
  for (let index = 0; index < keys.length; index++) {
    if (!content[keys[index]]) {
      if (!content.mainImgUrl) {
        proxy.$message.warning('请上传图片');
        return;
      }
      if (!content.price) {
        proxy.$message.warning('请输入平台售价');
        return;
      }
      if (!content.stock) {
        proxy.$message.warning('请输入库存');
        return;
      }
      if (!content.settlePrice) {
        proxy.$message.warning('请输入商品结算价');
        return;
      }
    } else if (!content.mainImgUrl) {
      proxy.$message.warning('请上传图片');
      return;
    }
    if (content.settlePrice > (1 - formState.platformRate * 0.01) * content.price) {
      proxy.$message.warning('商品平台价格不可低于商品结算价格');
      return;
    }
  }
  record.isEdit = false;
};

// 删除sku商品
const skuProductRemove = (record, index) => {
  skuFormState.products.splice(index, 1);
};

// sku商品选择sku时的内容
const skuValuesOptions = computed(() => {
  return (key) => {
    return skuFormState.skus
      .find((item) => item.key === key)
      .values.map((item) => ({ label: item.value, value: item.value }));
  };
});
const previewVisible = ref(false);
const previewImage = ref('');

// // 预览图片  @preview="handlePreview"

const handlePreview = (file) => {
  console.log(file);
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};
const handleCancel = () => {
  previewVisible.value = false;
};

// sku商品图片逻辑
const handleSkuImage = (info) => {
  if (!info) return;
  const { file, data } = info;
  // console.log(info, data);
  // data: {index: 0, type: 1}
  // 组装数据
  const formData = new FormData();
  formData.append('file', file);
  skuFormState.products[data.index].uploading = true;

  Upload(formData)
    .then((res) => {
      skuFormState.products[data.index].imgList = [
        {
          status: 'done',
          url: res.fileUrl,
          name: res.fileName,
        },
      ];
      skuFormState.products[data.index].mainImgUrl = res.fileUrl;
    })
    .catch(() => {
      handleSkuImageRemove(file);
      this.$message.warning('上传失败');
    })
    .finally(() => {
      skuFormState.products[data.index].uploading = false;
    });
};
const handleSkuImageRemove = (record) => {
  // debugger
  // skuFormState.products[file.data.index].imgList = [];
  // skuFormState.products[file.data.index].mainImgUrl = '';
  record.imgList = [];
  record.mainImgUrl = '';
};

/// 说明信息attrList
const attrForm = ref();
const attrFormState = reactive({
  attrList: [],
});

const addAtts = () => {
  attrFormState.attrList.push({ key: '', value: '' });
};
const removeAtts = (att, index) => {
  attrFormState.attrList.splice(index, 1);
};

// 上传图片的限制
const beforeUpload = (file) => {
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    proxy.$message.error('图片不能大于20MB!');
  }
  return isLt20M;
};

/// 详情及操作
const loading = ref(false);
const getiing = ref(false);

const apiType = ref('');
apiType.value = proxy.$route.meta.type;

onMounted(() => {
  getCategoryList();
  if (proxy.id) {
    getDetail(proxy.id);
  } else {
    detailLoading.value = true;
    commonRatioDetail({ shopType: apiType.value }).then((res) => {
      formState.platformRate = res.ratio;
    });
  }
});

const getDetail = (id) => {
  getiing.value = true;
  goodsListDetail(apiType.value, id)
    .then((res) => {
      Object.keys(formState).forEach((item) => {
        formState[item] = res[item] ?? undefined;
      });
      commonRatioDetail({ shopType: apiType.value }).then((result) => {
        formState.platformRate = result.ratio;
      });
      formState.chiefRate = (1 - res.settlePrice / res.price - res.ratio * 0.01) * 100;
      if (formState.chiefRate < 0) {
        formState.chiefRate = 0;
      }
      // formState.chiefRate = 5;
      // formState.platformRate = 3;
      console.log(formState.chiefRate, 'good');
      if (res.categoryIds) {
        // console.log(res.categoryIds, 'res.categoryIds');
        formState.categoryIds = res.categoryIds.filter((item) => item !== null);
      }

      res.mainImgUrl &&
        (mainFileList.value = [
          {
            status: 'done',
            url: res.mainImgUrl,
          },
        ]);
      if (res.skuList && res.skuList.length > 0) {
        // 组合规格、sku商品内容
        const skuKeyValues = {};
        const products = [];
        res.skuList.forEach((product) => {
          if (product.isDefault == 1) {
            formState.isDefault = '0';
            formState.settlePrice = product.settlePrice;
            formState.normalPrice = product.normalPrice;
          } else {
            formState.isDefault = '1';
          }
          const { skus, ...item } = product;
          item.isEdit = false;
          item.uploading = false;
          item.imgList = [{ status: 'done', url: item.mainImgUrl }];
          if (product.skus && product.skus.length > 0) {
            product.skus.forEach((sku) => {
              item[sku.key] = sku.value;
              if (skuKeyValues[sku.key]) {
                skuKeyValues[sku.key].push(sku.value);
              } else {
                skuKeyValues[sku.key] = [sku.value];
              }
            });
          }
          products.push(item);
        });

        const skus = [];
        Object.keys(skuKeyValues).forEach((skukey) => {
          skus.push({
            key: skukey,
            isEdit: false,
            values: Array.from(new Set(skuKeyValues[skukey])).map((skuvalue, index) => ({
              key: `规格值${index + 1}`,
              value: skuvalue,
            })),
          });
        });

        skuFormState.skus = skus;
        cleanProductSku();

        skuFormState.products = products;
        const stockNum = skuFormState.products.reduce((temp, item) => {
          return temp + item.stock;
        }, 0);
      }

      attrFormState.attrList = res.attrList;
      detailLoading.value = true;
    })
    .finally(() => {
      getiing.value = false;
    });
};

const productCategoryList = ref([]);

const getCategoryList = () => {
  categoryList(apiType.value).then((res) => {
    const list = [];
    transformData(res, list);
    // console.log(list, 'list');
    productCategoryList.value = list;
  });
};

// 转换类目结构
const transformData = (list, result) => {
  if (list && list.length > 0) {
    list.forEach((item) => {
      const child = { label: item.name, value: item.id, children: [] };
      transformData(item.children, child.children);
      if (child.children.length <= 0) {
        delete child.children;
      }
      result.push(child);
    });
  }
};
const tzdragChange = (value) => {
  imgchange.value = value;
};
const infodragChange = (value) => {
  infoImgchange.value = value;
};
const submit = () => {
  formRef.value
    .validateFields()
    .then((values) => {
      console.log(values, 'values');
      if (values.price < values.settlePrice) {
        proxy.$message.warning('商品平台售价不可低于商品结算价');
        return;
      }
      const params = { ...values };
      if (imgchange.value) {
        // 交换顺序
        const imgArr = values.sliderImgUrls;
        const { oldIndex } = imgchange.value.moved;
        const { newIndex } = imgchange.value.moved;
        const newArr = [];
        imgArr[oldIndex] = imgArr.splice(newIndex, 1, imgArr[oldIndex])[0];
        params.sliderImgUrls = imgArr;
      }
      if (infoImgchange.value) {
        // 交换顺序
        const imgArr = values.infoImgUrls;
        const { oldIndex } = imgchange.value.moved;
        const { newIndex } = imgchange.value.moved;
        const newArr = [];
        imgArr[oldIndex] = imgArr.splice(newIndex, 1, imgArr[oldIndex])[0];
        params.infoImgUrls = imgArr;
      }
      if (formState.isDefault == '0') {
        console.log(formState.isDefault);
        const skuList = [
          {
            stock: formState.stock,
            mainImgUrl: formState.mainImgUrl,
            settlePrice: formState.settlePrice,
            normalPrice: formState.normalPrice,
            price: formState.price,
            isDefault: 1,
            skus: [],
          },
        ];
        params.skuList = skuList;
      } else if (skuFormState.products) {
        console.log(formState.isDefault);
        if (skuFormState.products.length < 2) {
          proxy.$message.warning('启用商品规格后，至少有2个sku才能提交成功');
          return;
        }
        const skuKeys = skuFormState.skus.map((sku) => sku.key);
        const skuList = [];

        skuFormState.products.forEach((product) => {
          const { id, mainImgUrl, price, settlePrice, normalPrice, productId, stock, ...other } =
            product;
          const item = { id, mainImgUrl, price, settlePrice, normalPrice, productId, stock };
          const skus = [];
          Object.keys(other).forEach((key) => {
            if (skuKeys.includes(key)) {
              skus.push({ key, value: other[key] });
            }
          });
          item.skus = skus;
          skuList.push(item);
          console.log(skuList);
          // skuList.settlePrice = settlePrice;
          params.mainImgUrl = skuList[0].mainImgUrl;
          params.price = skuList[0].price;
        });
        params.skuList = skuList;
      }
      // else {
      //   params.skuList = [];
      // }
      params.attrList = attrFormState.attrList;
      attrForm.value
        .validateFields()
        .then(() => {
          loading.value = true;
          const api = params.id ? updateGoods : addGoods;
          api(apiType.value, params)
            .then(() => {
              proxy.$message.success('保存成功');
              proxy.$router.back();
            })
            .finally(() => {
              loading.value = false;
            });
        })
        .catch((error) => {
          if (Object.keys(error).length !== 0) {
            const { attrList } = error.values;
            for (let i = 0; i < attrList.length; i++) {
              if (!attrList.key || !attrList.value) {
                proxy.$message.warning('请把说明信息填写完整');
                return;
              }
            }
          }
        });
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped>
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
.two {
  width: 75%;
  margin: 0 auto;
}

.flex {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.attrForm {
  margin-top: 30px;
  margin-left: 180px;
}

.sku-box {
  margin-top: 20px;
  padding: 20px 40px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;

  // width: 80%;
  &-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &-bottom {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &-item {
    display: flex;
    gap: 10px;
    width: 30%;
    align-items: center;
  }
}
.tip {
  width: 22px;
  height: 22px;
  cursor: pointer;
  margin-left: 20px;
}
</style>
