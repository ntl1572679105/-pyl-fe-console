<template>
  <a-modal
    v-model:visible="visible"
    :title="title + '商品资料'"
    @cancel="handleCancel"
    :destroy-on-close="true"
    width="600px"
    centered
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 4 }"
      :wrapper-col="{ xs: 24, md: 18 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled></a-input>
      </a-form-item>
      <a-form-item label="所属商家" name="shopId">
        <a-select
          v-model:value="formState.shopId"
          placeholder="请选择"
          :options="shopListOptions"
          :disabled="shopNameFlag"
        />
      </a-form-item>
      <a-form-item label="商品名称" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-select
          v-model:value="formState.status"
          placeholder="请选择"
          :options="statusOptions"
        ></a-select>
      </a-form-item>
      <a-form-item label="商品价格" name="price">
        <a-input-number
          v-model:value="formState.price"
          style="width: 100%"
          placeholder="请输入"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="库存数量" name="stock">
        <a-input-number
          v-model:value="formState.stock"
          style="width: 100%"
          placeholder="请输入"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="商品说明" name="introduction">
        <a-textarea
          v-model:value="formState.introduction"
          :rows="4"
          placeholder="请输入商品说明"
          show-count
          :maxlength="300"
        />
      </a-form-item>
      <a-form-item label="使用时间段" name="useStartTime">
        <a-form-item-rest>
          <a-select
            v-model:value="formState.useStartTime"
            placeholder="请选择"
            :options="useTimeOptions"
            style="width: 45%"
          ></a-select>
        </a-form-item-rest>
        <a-form-item-rest>
          <a-select
            v-model:value="formState.useEndTime"
            placeholder="请选择"
            style="width: 45%; margin-left: 10px"
            :options="useTimeOptions"
          ></a-select>
        </a-form-item-rest>
      </a-form-item>
      <a-form-item label="有效期" name="time">
        <a-range-picker
          v-model:value="formState.time"
          :format="dateFormat"
          :value-format="dateFormat"
          @change="timeChange"
          :disabled-date="disabledDate"
        />
        <a-form-item-rest>
          <a-input
            type="number"
            v-model:value="formState.validDays"
            style="width: 20%; margin-left: 10px; margin-right: 10px"
            disabled
          ></a-input
          >天
        </a-form-item-rest>
      </a-form-item>
      <a-form-item label="商品类别" name="productCategoryId">
        <a-select
          v-model:value="formState.productCategoryId"
          :options="typeOptions"
          change-on-select
          placeholder="请选择商品类别"
        />
      </a-form-item>
      <a-form-item label="商品图片" name="introImgUrls" style="height: 200px">
        <ImageUpload
          :max="9"
          :multiple="true"
          :isDraggable="false"
          v-model:imageUrls="formState.introImgUrls"
          :originUrls="formState.introImgUrls"
          @finish="changeSliderImages"
          @nrpreView="handlePreview"
        >
        </ImageUpload>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal :visible="previewVisible" :footer="null" @cancel="previewCancel" centered width="500px">
    <img style="width: 100%" :src="previewImage" />
  </a-modal>
</template>
<script setup>
import { reactive, ref, getCurrentInstance, defineExpose, defineEmits } from 'vue';
import ImageUpload from '@/components/UploadCustom/index.vue';
import dayjs from 'dayjs';
import { addGoods, updateGoods } from '@/api/o2o/goods.js';

const formRef = ref();
const visible = ref(false);
const loading = ref(false);
const dateFormat = 'YYYY-MM-DD';

const { proxy } = getCurrentInstance();

const formState = reactive({
  id: null,
  name: '',
  shopId: undefined,
  status: 0,
  price: '',
  stock: '',
  introduction: '',
  time: [],
  validDays: '',
  useStartTime: '',
  useEndTime: '',
  productCategoryId: undefined,
  introImgUrls: [],
});
const rules = {
  shopId: [{ required: true, message: '请选择商家' }],
  name: [{ required: true, message: '请输入商品名称' }],
  status: [{ required: true, message: '请选择商品状态' }],
  price: [{ required: true, message: '请输入商品价格' }],
  stock: [{ required: true, message: '请输入商品库存' }],
  productCategoryId: [{ required: true, message: '请输入商品类别' }],
  introImgUrls: [{ required: true, message: '请上传商品图片' }],
  useStartTime: [{ required: true, message: '请选择使用时间段' }],
  time: [{ required: true, message: '请选择有效期' }],
};
const title = ref('添加');

const statusOptions = [
  { label: '已上架', value: 0 },
  { label: '已下架', value: 1 },
];
const useTimeOptions = [
  { label: '周一', value: '周一' },
  { label: '周二', value: '周二' },
  { label: '周三', value: '周三' },
  { label: '周四', value: '周四' },
  { label: '周五', value: '周五' },
  { label: '周六', value: '周六' },
  { label: '周日', value: '周日' },
];
const typeOptions = ref([]);
const shopListOptions = ref([]);

const previewVisible = ref(false);
const previewImage = ref('');
const shopNameFlag = ref(false);

const emit = defineEmits(['finish']);

const show = (item, typeList, shopList, flag) => {
  visible.value = true;
  typeOptions.value = typeList;
  shopListOptions.value = shopList;
  shopNameFlag.value = flag;

  Object.keys(formState).forEach((key) => {
    formState[key] = item[key] ?? undefined;
  });
  if (item.id) {
    title.value = '编辑';
    formState.productCategoryId = item.categoryId;
    formState.time = [item.validStartTime, item.validEndTime];
    formState.validDays = dayjs(item.validEndTime).diff(item.validStartTime, 'day');
  } else {
    title.value = '添加';
  }
};

const handleCancel = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const handleOk = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    console.log(values);
    const params = { ...values };
    if (params.time) {
      params.validStartTime = params.time[0] + ' 00:00:00';
      params.validEndTime = params.time[1] + ' 23:59:59';
      params.time = undefined;
    }
    params.useStartTime = formState.useStartTime;
    params.useEndTime = formState.useEndTime;
    const api = values.id ? updateGoods : addGoods;
    const content = values.id ? '修改成功' : '新增成功';
    api(params)
      .then(() => {
        proxy.$message.success(content);
        emit('finish');
        visible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

// 预览图片  @preview="handlePreview"

const handlePreview = (file) => {
  console.log(file);
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};
const previewCancel = () => {
  previewVisible.value = false;
};

const changeSliderImages = (images) => {
  formState.introImgUrls = images;
};

const timeChange = (dates) => {
  if (dates) {
    const days = dayjs(dates[1]).diff(dates[0], 'day');
    formState.validDays = days;
  } else {
    formState.validDays = '';
  }
};

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

defineExpose({
  show,
});
</script>
<style lang="less" scoped>
.image-item {
  object-fit: cover;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.image-box {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
