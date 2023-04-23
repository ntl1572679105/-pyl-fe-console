<template>
  <PageContainer>
    <a-card :bordered="false">
      <a-spin :spinning="spinning">
        <div class="one" style="display: flex; flex-direction: column; justify-content: center">
          <div class="part">基础信息</div>
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 10 }"
            label-align="right"
          >
            <a-form-item label="编号" name="id" style="display: none">
              <a-input v-model:value="formState.id" disabled></a-input>
            </a-form-item>
            <a-form-item label="分类编号" name="cateNo" style="margin-top: 10px">
              <a-form-item-rest>
                <a-radio
                  v-model:checked="formState.cateNo"
                  v-if="showZiduan && !formState.categoryNo"
                  >自动匹配</a-radio
                >
              </a-form-item-rest>
              <a-input
                v-model:value="formState.categoryNo"
                allowClear
                placeholder="输入编号"
                style="width: 70%"
              />
            </a-form-item>
            <a-form-item label="分类名称" name="name">
              <a-input
                v-model:value="formState.name"
                allowClear
                placeholder="输入分类名称"
                style="width: 70%"
              />
            </a-form-item>
            <a-form-item label="是否显示" name="status" style="margin-top: 10px">
              <a-select
                v-model:value="formState.status"
                placeholder="选择是否显示"
                :options="optionList"
                style="width: 70%"
              >
              </a-select>
            </a-form-item>
            <a-form-item label="图片" name="imgUrl" style="margin-top: 10px">
              <a-upload
                v-model:file-list="imgFileList"
                :customRequest="handleImgUpload"
                name="imgUrl"
                list-type="picture-card"
                class="avatar-uploader"
                accept="image/png, image/jpeg, image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @remove="handleRemove"
              >
                <div v-if="imgFileList.length < 1">
                  <loading-outlined v-if="imgUploading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="排序" name="sort" style="margin-top: 10px">
              <a-form-item-rest>
                <a-radio v-model:checked="formState.sortInput" v-if="showZiduan && !formState.sort"
                  >自动匹配</a-radio
                >
              </a-form-item-rest>
              <a-input-number
                v-model:value="formState.sort"
                allowClear
                placeholder="输入编号"
                style="width: 70%"
              />
            </a-form-item>
            <div
              class="btnbox"
              style="display: flex; margin-left: 36%; align-items: center; margin-top: 20px"
            >
              <a-button type="primary" @click="submit" :loading="loading" style="margin-right: 15px"
                >提交</a-button
              >
            </div>
          </a-form>
        </div>
      </a-spin>
    </a-card>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" centered width="500px">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, defineProps, computed } from 'vue';
import { cateAdd, cateDetail, cateEdit } from '@/api/o2o/shangjia.js';
import { addType, typeDetail, updateType } from '@/api/o2o/goods.js';
import dayjs from 'dayjs';
import { Upload } from '@/api/common.js';

const { proxy } = getCurrentInstance();
defineProps({
  id: String,
});

/// 基础信息
const formRef = ref();
const formState = reactive({
  id: undefined,
  cateNo: true,
  categoryNo: null,
  name: null,
  status: 0,
  sortInput: true,
  sort: null,
  imgUrl: ''
});
const imgFileList = ref([]);
const imgUploading = ref(false);

// 主图和副图的添加删除
const handleRemove = () => {
  imgFileList.value = [];
  formState.imgUrl = '';
};

const handleImgUpload = ({ file }) => {
  const formData = new FormData();
  formData.append('file', file);
  imgUploading.value = true;
  Upload(formData)
    .then((res) => {
      console.log(res);
      imgFileList.value = [
        {
          status: 'done',
          url: res.fileUrl,
          name: res.fileName,
        },
      ];
      formState.imgUrl = res.fileUrl;
      imgUploading.value = false;
      formRef.value.validateFields();
    })
    .catch(() => {
      imgUploading.value = false;
      handleRemove();
      proxy.$message.error('图片上传失败，请重试');
    });
};

// 上传图片的限制
const beforeUpload = (file) => {
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    proxy.$message.error('图片不能大于20MB!');
  }
  return isLt20M;
};

const rules = reactive({
  name: [{ required: true, message: '请输入分类名称' }],
  status: [{ required: true, message: '请选择显示状态' }],
  imgUrl: [{ required: true, message: '请上传图片' }],
});

const optionList = ref([
  { label: '是', value: 0 },
  { label: '否', value: 1 },
]);
const loading = ref(false);
const showZiduan = ref(true);
const spinning = ref(true);

onMounted(() => {
  if (proxy.id) {
    getDetail(proxy.id);
  } else {
    spinning.value = false;
  }
});

const apiType = ref('');
apiType.value = proxy.$route.meta.type;

const getDetail = (id) => {
  showZiduan.value = false;
  // 获取商家分类详情
  const detailApi = apiType.value == 1 ? cateDetail : typeDetail;
  detailApi(id)
    .then((res) => {
      console.log(res);
      Object.keys(res).forEach((key) => {
        formState[key] = res[key] || undefined;
      });
      formState.status = res.status ?? 0;
      formState.sort = res.sort ?? 0;
      res.imgUrl &&
        (imgFileList.value = [
          {
            status: 'done',
            url: res.imgUrl,
          },
        ]);
    })
    .finally(() => {
      spinning.value = false;
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

const handleCancel = () => {
  previewVisible.value = false;
};

const submit = () => {
  formRef.value.validateFields().then((values) => {
    loading.value = true;
    if (proxy.id && !formState.categoryNo) {
      proxy.$message.warning('分类编号不能为空');
      loading.value = false;
      return;
    }
    if (values.sortInput && proxy.id) {
      values.sort = null;
    }
    if (values.categoryNo && proxy.id) {
      values.categoryNo = null;
    } else {
      values.cateNo = null;
      values.categoryNo = formState.categoryNo;
    }
    const api1 = proxy.id ? cateEdit : cateAdd;
    const api2 = proxy.id ? updateType : addType;
    const content = proxy.id ? '修改成功' : '新增成功';
    const api = apiType.value == 1 ? api1 : api2;
    api(values)
      .then((res) => {
        console.log(res);
        proxy.$message.success(content);
        proxy.$router.go(-1);
      })
      .finally(() => {
        loading.value = false;
      });
  });
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
</style>
