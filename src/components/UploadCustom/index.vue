<template>
  <a-upload
    v-model:file-list="state.imgFileList"
    :customRequest="handleImgUpload"
    name="uploadImage"
    list-type="picture-card"
    class="avatar-uploader"
    :accept="accept"
    :multiple="multiple"
    :before-upload="beforeUpload"
    @remove="handleImgRemove"
    @preview="handlePreview"
  >
    <div v-if="state.imgFileList.length < max">
      <loading-outlined v-if="state.imgUploading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">上传</div>
    </div>
  </a-upload>
  <draggable
    v-if="isDraggable"
    :list="state.imgFileList"
    :options="{ group: 'title', animation: 150 }"
    :no-transition-on-drag="true"
    @change="change"
    style="width: 50px; height: 50px; margin: 10px; position: relative; display: flex"
  >
    <transition-group type="transition" name=" syll_li " :css="true">
      <div
        class="ant-upload-list-item ant-upload-list-item-done"
        v-for="(item, index) in state.imgFileList"
        :key="index"
      >
        <div class="ant-upload-list-item-info">
          <a-image :src="item.url" style=""></a-image>
        </div>
      </div>
    </transition-group>
  </draggable>
</template>

<script setup>
import { defineProps, getCurrentInstance, onMounted, reactive } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { Upload } from '@/api/common.js';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

const props = defineProps({
  accept: {
    type: String,
    default: 'image/png, image/jpeg, image/jpg',
  },
  isDraggable: {
    type: Boolean,
    default: true,
  },
  max: {
    // 限制个数
    type: Number,
    default: 1,
  },
  multiple:{
    type:Boolean,
    default:false
    },
  limitSize: {
    // 单张限制大小
    type: Number,
    default: 20,
  },
  imageUrls:{
    type:Array,
    default:()=>[]
  },
  originUrls: {
    // 默认图片
    type: Array,
    default: () => [],
  },
});

const state = reactive({
  imageUrls: [],
  imgUploading: false,
  imgFileList: [],
});

onMounted(() => {
  if (props.originUrls) {
    state.imgFileList = props.originUrls.map((item) => ({ status: 'done', url: item }));
    state.imageUrls = [...props.originUrls];
  }
  // console.log(state.imageUrls,'upload')
});
const handlePreview = (file) => {
  emit('nrpreView', file);
};

const emit = defineEmits(['finish','nrpreView']);

const { proxy } = getCurrentInstance();

const handleImgUpload = ({ file, onSuccess, onError }) => {
  console.log(onSuccess);
  const formData = new FormData();
  formData.append('file', file);
  state.imgUploading = true;
  Upload(formData)
    .then((res) => {
      state.imageUrls.push(res.fileUrl);
      emit('finish', state.imageUrls);
      state.imgUploading = false;
      onSuccess();
      const imgItem = state.imgFileList.find((item) => item.uid === file.uid);
      imgItem.status = 'done';
      imgItem.url = res.fileUrl;
      emit('update:imageUrls', state.imageUrls);
      emit('formValidate')
    })
    .catch(() => {
      onError();
      state.imgUploading = false;
      handleImgRemove(file);
      proxy.$message.error('图片上传失败，请重试');
    });
};

const handleImgRemove = (file) => {
  const index = state.imgFileList.indexOf(file);
  const newFileList = state.imgFileList.slice();
  newFileList.splice(index, 1);
  state.imgFileList = newFileList;
  state.imageUrls.splice(index, 1);
  emit('finish', state.imageUrls);
};

// 上传图片的限制
const beforeUpload = (file) => {
  const isLimit = file.size / 1024 / 1024 < proxy.limitSize;
  if (!isLimit) {
    proxy.$message.error(`图片不能大于${proxy.limitSize}MB!`);
  }
  return isLimit;
};

const change = (value) => {
  // console.log(value, imgFileList.value);
  // const oldIndex = value.oldIndex;
  // const newIndex = value.newIndex;
  // const imgArr = imgFileList.value;
  // imgArr[oldIndex] = imgArr.splice(newIndex - 1, 1, imgArr[oldIndex])[0];
  // imgArr[newIndex] = imgArr.splice(oldIndex - 1, 1, imgArr[newIndex])[0];
  // // [imgFileList[oldIndex],imgFileList[newIndex]]=[imgFileList[newIndex],imgFileList[oldIndex]]
  // console.log(imgFileList.value);
  emit('draggableChange',value)
};
</script>

<style></style>
