<template>
  <div>
    <a-modal
      v-model:visible="visible"
      :title="formState.title"
      @cancel="handleCancel"
      :destroy-on-close="true"
      :width="600"
      :z-index="988"
      centered
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
        :label-col="{ xs: 24, md: 8 }"
        :wrapper-col="{ xs: 24, md: 14 }"
        label-align="right"
      >
        <a-form-item label="编号" name="id" style="display: none">
          <a-input v-model:value="formState.id" disable />
        </a-form-item>
        <a-form-item label="业务类型" name="bizType">
          <a-select
            v-model:value="formState.bizType"
            placeholder="请选择"
            :options="bizTypeOptions"
          />
        </a-form-item>
        <a-form-item label="封面图片" name="imgUrl">
          <a-upload
            v-model:file-list="fileList"
            :customRequest="handleUpload"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            accept="image/png, image/jpeg, image/jpg"
            :before-upload="beforeUpload"
            @remove="handleRemove"
            @preview="handlePreview"
          >
            <div v-if="fileList.length < 1">
              <loading-outlined v-if="uploading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>

              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="跳转链接类型" name="linkType">
          <a-select
            v-model:value="formState.linkType"
            placeholder="请选择"
            :options="linkTypeOptions"
          />
        </a-form-item>
        <a-form-item v-if="formState.linkType === 1" label="跳转链接" name="link">
          <a-input v-model:value="formState.link" placeholder="请输入" :maxlength="500"></a-input>
        </a-form-item>
        <a-form-item label="商品编号" name="targetId" v-else-if="formState.linkType === 2">
          <a-select
            v-model:value="formState.targetId"
            allowClear
            show-search
            placeholder="请选择"
            :filter-option="false"
            :not-found-content="productState.fetching ? undefined : null"
            :options="productState.data"
            @search="fetchProduct"
          >
            <template v-if="productState.fetching" #notFoundContent>
              <a-spin size="small" />
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="启用状态" name="status">
          <a-switch v-model:checked="formState.status" :checkedValue="0" :unCheckedValue="1" />
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
      </a-form>
    </a-modal>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancelImg"
      centered
      width="500px"
      :z-index="999"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { bannerAdd, bannerEdit } from '@/api/o2o/banner.js';
import { Upload } from '@/api/common.js';
import { reactive, ref, getCurrentInstance, computed, watch } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { debounce } from 'lodash-es';
import { goodsList } from '@/api/o2o/goods.js';

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const formRef = ref();
    const formState = reactive({
      imgUrl: '',
      bizType: undefined,
      link: '',
      targetId: [],
      linkType: undefined,
      sort: '',
      status: 1,
      id: undefined,
      title: '',
    });
    const rules = {
      bizType: [{ required: true, message: '请选择业务类型' }],
      // linkType: [{ required: true, message: '请选择链接类型' }],
      imgUrl: [{ required: true, message: '请上传图片' }],
      link: [{ required: true, message: '请输入链接' }],
      targetId: [{ required: true, message: '请选择商品' }],
    };
    const previewVisible = ref(false);
    const previewImage = ref('');

    const loading = ref(false);
    const visible = ref(false);
    const uploading = ref(false);

    const fileList = ref([]);

    let lastFetchId = 0;
    const productState = reactive({
      data: [],
      fetching: false,
    });

    const show = (item) => {
      visible.value = true;
      Object.keys(formState).forEach((key) => {
        formState[key] = item[key] || undefined;
      });
      formState.sort = item.sort ?? 0;
      formState.status = item.title == '编辑' ? item.status : 1;
      if (item.targetId) {
        productState.data = [{ label: item.product?.productNo, value: item.targetId }];
      } else {
        productState.data = [];
      }

      fileList.value = item.imgUrl
        ? [
            {
              status: 'done',
              url: item.imgUrl,
              name: item.imgUrl,
            },
          ]
        : [];
    };

    // 图片操作
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
      formState.imgUrl = '';
    };
    // // 预览图片  @preview="handlePreview"

    const handlePreview = (file) => {
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
    };
    const handleCancelImg = () => {
      previewVisible.value = false;
    };

    const bizTypeOptions = [
      {
        label: '首页',
        value: 1,
      },
      {
        label: '活动',
        value: 2,
      },
    ];
    const linkTypeOptions = [
      {
        label: '外部链接',
        value: 1,
      },
      {
        label: '商品详情',
        value: 2,
      },
    ];

    const beforeUpload = (file) => {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        proxy.$message.error('文件不能大于20MB!');
      }
      return isLt20M;
    };

    const handleUpload = ({ file }) => {
      console.log(file);
      const formData = new FormData();
      formData.append('file', file);
      uploading.value = true;
      Upload(formData)
        .then((res) => {
          fileList.value = [
            {
              status: 'done',
              url: res.fileUrl,
              name: res.fileName,
            },
          ];
          uploading.value = false;
          formState.imgUrl = res.fileUrl;
          formRef.value.validateFields();
        })
        .catch(() => {
          uploading.value = false;
          proxy.$message.error('图片上传失败，请重试');
        });
    };

    const fetchProduct = debounce((value) => {
      console.log('fetching product: ', value);
      lastFetchId += 1;
      const fetchId = lastFetchId;
      productState.data = [];
      productState.fetching = true;
      goodsList({ productNo: value, pageNum: 1, pageSize: 20 }).then((res) => {
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

    watch(formState.targetId, () => {
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
        if (values.link && values.link.length > 512) {
          proxy.$message.warning('链接字符超过最大长度');
          return;
        }
        const api = values.id ? bannerEdit : bannerAdd;
        const content = values.id ? '修改成功' : '新增成功';
        api(values)
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
      uploading,
      fileList,
      previewVisible,
      previewImage,
      bizTypeOptions,
      linkTypeOptions,
      show,
      handleCancel,
      handleOk,
      handleRemove,
      beforeUpload,
      handleUpload,
      handlePreview,
      handleCancelImg,
      fetchProduct,
      productState,
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
