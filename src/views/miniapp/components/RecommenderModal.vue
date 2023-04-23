<template>
  <a-modal
    v-model:visible="visible"
    :title="formState.title"
    @cancel="handleCancel"
    :destroy-on-close="true"
    :width="600"
    @ok="handleOk"
  >
    <template #footer>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">确定</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ xs: 24, md: 5 }"
      :wrapper-col="{ xs: 24, md: 14 }"
      label-align="right"
    >
      <a-form-item label="编号" name="id" style="display: none">
        <a-input v-model:value="formState.id" disabled />
      </a-form-item>
      <a-form-item label="类型" name="type" style="display: none">
        <a-input v-model:value="formState.type" disabled />
      </a-form-item>
      <a-form-item label="商品编号" name="productId" v-if="formState.lx === 'edit'">
        <a-select
          v-model:value="formState.productNo"
          allowClear
          show-search
          placeholder="请选择"
          :filter-option="false"
          :not-found-content="productState.fetching ? undefined : null"
          :options="productState.data"
          @search="fetchProduct"
          @change="changeProduct"
        >
          <template v-if="productState.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="商品编号" name="productId" v-if="formState.lx === 'add'">
        <a-select
          v-model:value="formState.productId"
          allowClear
          show-search
          placeholder="请选择"
          :filter-option="false"
          :not-found-content="productState.fetching ? undefined : null"
          :options="productState.data"
          @search="fetchProduct"
          @change="changeProduct"
        >
          <template v-if="productState.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          placeholder="请输入"
          :precision="0"
          :min="0"
          :max="99999"
          v-model:value="formState.sort"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="商品名称" name="name">
        <a-input v-model:value="formState.name" disabled />
      </a-form-item>
      <a-form-item label="商品主图" name="mainImgUrl">
        <a-image :src="formState.mainImgUrl" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { recommenderEdit, recommenderAdd, recommenderDetail } from '@/api/miniapp.js';
import { goodsList } from '@/api/goods.js';
import { reactive, ref, getCurrentInstance, watch } from 'vue';
import { debounce } from 'lodash-es';

export default {
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      id: undefined,
      title: '',
      type: '',
      mainImgUrl: '',
      productId: [],
      name: '',
      sort: undefined,
      productNo: '',
      lx: '',
    });
    const rules = {
      productId: [{ required: true, message: '请选择' }],
    };

    let lastFetchId = 0;
    const productState = reactive({
      data: [],
      fetching: false,
    });

    const loading = ref(false);
    const visible = ref(false);

    const show = (item) => {
      visible.value = true;
      // debugger
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.sort = item.sort;
      // console.log(formState,'formState')
    };

    const apiType = ref('');
    apiType.value = proxy.$route.meta.type;

    const fetchProduct = debounce((value) => {
      console.log('fetching product: ', value);
      lastFetchId += 1;
      const fetchId = lastFetchId;
      productState.data = [];
      productState.fetching = true;
      goodsList(apiType.value, { productNo: value, pageNum: 1, pageSize: 20 }).then((res) => {
        if (fetchId !== lastFetchId) return;
        productState.data = res.data.map((item) => ({
          label: item.productNo,
          value: item.id,
          name: item.name,
          mainImgUrl: item.mainImgUrl,
        }));
        productState.fetching = false;
      });
    }, 300);

    const changeProduct = (value, option) => {
      formState.name = option.name;
      formState.mainImgUrl = option.mainImgUrl;
    };

    watch(formState.productId, () => {
      productState.data = [];
      productState.fetching = false;
    });
    // 按钮操作
    const handleCancel = () => {
      formRef.value.resetFields();
      visible.value = false;
    };
    const handleOk = () => {
      formRef.value.validateFields().then((values) => {
        loading.value = true;
        const api = values.id ? recommenderEdit : recommenderAdd;
        const content = values.id ? '修改成功' : '新增成功';
        api(apiType.value, values)
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

    return {
      formRef,
      formState,
      rules,
      loading,
      visible,
      productState,
      show,
      handleCancel,
      handleOk,
      changeProduct,
      fetchProduct,
    };
  },
};
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
