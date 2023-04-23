<template>
  <PageContainer>
    <a-card :bordered="false">
      <div style="position: absolute; right: 20vw">
        <a-form>
          <a-form-item label="预览图">
            <canvas
              ref="myCanvasRef"
              style="position: absolute; top: 0; right: 800"
              id="canvas"
              width="200"
              height="200"
            ></canvas>
          </a-form-item>
        </a-form>
      </div>
      <div class="one">
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 10 }"
          label-align="right"
        >
          <a-form-item label="主键id" name="id" style="display: none">
            <a-input v-model:value="formState.id" />
          </a-form-item>
          <a-form-item label="印章名称" name="imageName">
            <a-input
              :disabled="proxy.$route.query.type === 'view'"
              v-model:value="formState.imageName"
              allowClear
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="企业名称" name="text">
            <a-input
              :disabled="proxy.$route.query.type === 'view'"
              v-model:value="formState.text"
              allowClear
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="横向文字1" name="footText">
            <a-input
              :disabled="proxy.$route.query.type === 'view'"
              v-model:value="formState.footText"
              allowClear
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="横向文字2" name="footText2">
            <a-input
              :disabled="proxy.$route.query.type === 'view'"
              v-model:value="formState.footText2"
              allowClear
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item label="印章简介" style="margin-bottom: 120px" name="info">
            <a-textarea
              :rows="4"
              show-count
              :disabled="proxy.$route.query.type === 'view'"
              :maxlength="100"
              v-model:value="formState.info"
              placeholder="请输入"
            />
          </a-form-item>
        </a-form>
      </div>
      <div
        class="btnbox"
        style="display: flex; justify-content: center; align-items: center; margin-top: 20px"
      >
        <a-button
          type="primary"
          @click="submit"
          v-if="proxy.$route.query.type !== 'view'"
          style="margin-right: 15px"
          :loading="loading"
          >提交</a-button
        >
      </div>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue';
import { signAdd, signEdit, signDetail } from '@/api/pb2b/signature.js';
import chapter from '@/config/chapter.js';
import { async } from 'regenerator-runtime';

const { proxy } = getCurrentInstance();
const formState = reactive({
  id: '',
  imageName: '',
  text: '',
  footText: '',
  footText2: '',
  info: '',
});
const formRef = ref();
const loading = ref(false);
const myCanvasRef = ref(null);
onMounted(() => {
  if (proxy.$route.query.type && proxy.$route.query.type !== 'add') {
    getDetail(proxy.$route.params.id);
  }
});

const footTextValidator = (_rule, value) => {
  if (!value || value.length > 6) {
    return Promise.reject('请输入不超过6个字符的横向文字');
  } 
  return Promise.resolve();
};

const rules = {
  imageName: [{ required: true, message: '请输入印章名称', trigger: ['blur', 'change'] }],
  // text: [{ required: true, message: '请输入企业名称', trigger: ['blur', 'change'] }],
  text: [
    {
      required: true,
      validator: async (_rule, value) => {
        if (!value || value.length < 2) {
          return Promise.reject('请输入企业名称, 最少2个字');
        } else if (value.length > 15) {
          return Promise.reject('输入最大为15字符');
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'change'],
    },
  ],
  footText: [
    {
      required: true,
      validator: footTextValidator,
      trigger: ['blur', 'change'],
    },
  ],
  footText2: [
    {
      required: true,
      validator: footTextValidator,
      trigger: ['blur', 'change'],
    },
  ],
};

watch(
  () => [formState.text, formState.footText, formState.footText2],
  () => {
    chapter(formState.footText, formState.footText2, formState.text);
  },
);

const submit = () => {
  formRef.value
    .validateFields()
    .then((values) => {
      const api = proxy.$route.query.type === 'add' ? signAdd : signEdit;
      const params = { ...values };
      const canvas = document.getElementById('canvas');
      canvas.toBlob((blob) => {
        console.log(canvas.toDataURL('image/png'));
      });
      if (proxy.$route.type === 'add') {
        params.id = undefined;
      }
      loading.value = true;
      api(params)
        .then(() => {
          proxy.$message.success('保存成功');
          proxy.$router.back();
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
const getDetail = () => {
  signDetail(proxy.$route.params.id).then((res) => {
    Object.keys(formState).forEach((item) => {
      formState[item] = res[item];
    });
    formState.imgUrl = res.imgUrl;
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
