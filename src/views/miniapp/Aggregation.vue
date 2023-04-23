<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button
          type="primary"
          @click="handleEditBanner"
          v-permission="
            proxy.$route.meta.type == 1 ? ['operator:jcBanner:add'] : ['operator:gcBanner:add']
          "
        >
          首页背景管理
        </a-button>
        <div style="float: right">
          首屏黑白配色&emsp;
          <a-switch
            v-model:checked="formState.blackWhite"
            :checkedValue="1"
            @change="(checked) => changeBlackWhite(checked)"
            :unCheckedValue="0"
          />
        </div>
      </div>

      <a-table
        ref="table"
        size="default"
        row-key="id"
        :columns="columns"
        :scroll="{ x: 1810 }"
        :data-source="dataSource.list"
        :loading="loading"
        :pagination="pagination"
        @change="tableChange"
      >
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a v-if="record.isEdit" @click="itemSave(record, index)" style="margin-right: 10px"
                >保存</a
              >
              <a v-else @click="record.isEdit = true" style="margin-right: 10px">编辑</a>
            </a-space>
          </template>
          <template v-if="column.dataIndex === 'name'">
            <a-input
              v-if="record.isEdit"
              v-model:value="record.name"
              :disabled="text === '顶级渔获'"
            ></a-input>
            <span v-else>{{ text }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'introduction'">
            <a-input v-if="record.isEdit" v-model:value="record.introduction"></a-input>
            <span v-else>{{ text }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-switch
              v-model:checked="record.status"
              @change="(checked) => changeStatus(record, checked)"
              :checkedValue="0"
              :unCheckedValue="1"
            />
          </template>
          <template v-else-if="column.dataIndex === 'mainImgUrl'">
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
              @remove="handleSkuImageRemove"
            >
              <div v-if="!record.imgList || record.imgList.length < 1">
                <loading-outlined v-if="record.uploading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
            <a-image v-else :width="40" :src="record.mainImgUrl" />
          </template>
          <template v-else-if="column.key === 'img'">
            <a-image :width="40" :src="text" />
          </template>
          <!-- 跳转类型 1-链接 2-本地小程序 3-外部小程序 -->
          <template v-else-if="column.dataIndex === 'jumpType'">
            <a-select
              style="width: 100%"
              :disabled="!record.isEdit"
              :options="[
                { label: '链接', value: 1 },
                { label: '本地小程序', value: 2 },
                { label: '外部小程序', value: 3 },
              ]"
              v-model:value="record.jumpType"
            >
            </a-select>
          </template>
          <template v-else-if="column.dataIndex === 'jumpLink'">
            <a-input v-if="record.isEdit" v-model:value="record.jumpLink" style=""></a-input>
            <span v-else>{{ text }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'sort'">
            <a-input-number
              v-if="record.isEdit"
              v-model:value="record.sort"
              style="width: 100%"
              :min="0"
              :max="99999"
              :precision="0"
            />
            <span v-else>{{ text }}</span>
          </template>
          <template v-else-if="column.key === 'tooltip'">
            <a-tooltip>
              <template #title>{{ text }}</template>
              {{ text }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <BannerModal ref="bannerModal" @finish="modelOk" />
      <BannerImgModal ref="bannerImgModal" @finish="modelOk" />
      <a-card :bordered="false" style="margin-left: 40px;color: #828181">
        备注: <br />
        1. 初始命名和示例样图不可修改, 顶级渔获命名不可修改。<br />
        2. 修改范围仅对用户小程序端有效。<br />
        3. 规格尺寸: 150px * 150px。<br />
        4. 支持格式: jpg、png。<br />
      </a-card>
      <a-modal
        :visible="previewVisible"
        :footer="null"
        @cancel="handleCancel"
        centered
        width="500px"
      >
        <img style="width: 100%" :src="previewImage" />
      </a-modal>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { aggrList, bgDeployEdit, blackWhite } from '@/api/miniapp.js';
import BannerModal from './components/BannerModal.vue';
import { Upload } from '@/api/common.js';
import BannerImgModal from './components/BannerImgModal.vue';
const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '命名',
    dataIndex: 'name',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '说明',
    dataIndex: 'introduction',
    ellipsis: true,
    key: 'tooltip',
    width: 250,
  },
  {
    title: '图标',
    dataIndex: 'mainImgUrl',
    key: 'img',
  },
  {
    title: '跳转链接',
    dataIndex: 'jumpLink',
    width: 500,
  },
  {
    title: '跳转类型',
    dataIndex: 'jumpType',
    width: 150,
  },
  {
    title: '位置顺序',
    dataIndex: 'sort',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '初始命名',
    dataIndex: 'initialName',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '示例样图',
    dataIndex: 'exampleImgUrl',
    key: 'img',
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
    align: 'center',
  },
];

const formState = reactive({
  // keywords: '',
  blackWhite: 0,
});

const imgUrl = ref('');

const loading = ref(false);
const dataSource = reactive({
  list: [],
  params: {},
});
const pagination = reactive({
  hideOnSinglePage: true,
  pageSize: 10,
  total: 0,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
});

onMounted(() => {
  searchForm();
});

// 表单搜索回调
const searchForm = (formData) => {
  pagination.current = 1;
  dataSource.params = formData;
  getList(formData);
};

const clearForm = () => {
  pagination.current = 1;
  dataSource.params = {};
  searchForm();
};

const getList = (formData) => {
  console.log(formData, formState);
  loading.value = true;
  const requestParameters = Object.assign(
    {},
    { pageNum: pagination.current, pageSize: pagination.pageSize },
    formData,
  );
  // console.log('loadData request parameters:', requestParameters);
  aggrList(requestParameters)
    .then((res) => {
      // dataSource.list = res.data;
      pagination.total = res.total;
      let temp = res.data.map((item) => ({
        ...item,
        uploading: false,
        imgList: item.mainImgUrl ? [{ status: 'done', url: item.mainImgUrl }] : [],
      }));
      const list = Object.values(temp).filter((item) => item.sort != '0');
      imgUrl.value = temp[0].mainImgUrl;
      dataSource.list = list;
    })
    .finally(() => {
      loading.value = false;
    });
};

/// 逻辑操作
// 分页
const tableChange = (page) => {
  console.log(page);
  pagination.current = page.current;
  pagination.pageSize = page.pageSize;
  getList(dataSource.params);
};

// 状态改变
const changeStatus = (record, checked) => {
  bgDeployEdit({ id: record.id, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
};

// 修改状态
const changeBlackWhite = (checked) => {
  if (checked) {
    proxy.$confirm({
      title: `首屏黑白配色开启后，小程序首页展示黑白配色，直到关闭后才可显示原有色值，确定修改吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        blackWhite({ isBlack: 1 })
          .then(() => {
            proxy.$message.success('修改成功');
          })
          .catch(() => {
            proxy.$message.success('修改成失败, 请重试');
          });
      },
      onCancel: () => {
        formState.blackWhite = 0;
      },
    });
  } else {
    blackWhite({ isBlack: 0 }).then(() => {
      proxy.$message.success('修改成功');
    });
  }
};

// 首页背景管理
const handleEditBanner = () => {
  proxy.$refs.bannerImgModal.show(imgUrl.value);
};

const modelOk = () => {
  clearForm();
};

const itemSave = (record) => {
  proxy.$confirm({
    title: '点击确认后，修改内容将在小程序上显示，是否确认修改？',
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      bgDeployEdit({ ...record })
        .then((res) => {
          console.log(res);
          proxy.$message.success('修改成功');
          record.isEdit = false;
          // clearForm();
        })
        .finally(() => {
          console.log(record);
        });
    },
  });
};

// 预览图片

const previewVisible = ref(false);
const previewImage = ref('');

const handlePreview = (file) => {
  console.log(file, 'file');
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};
const handleCancel = () => {
  previewVisible.value = false;
};

// 上传图片的限制
const beforeUpload = (file) => {
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    proxy.$message.error('图片不能大于20MB!');
  }
  return isLt20M;
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

  Upload(formData)
    .then((res) => {
      console.log(res);
      console.log(data.index);
      dataSource.list[data.index].imgList = [
        {
          status: 'done',
          url: res.fileUrl,
          name: res.fileName,
        },
      ];
      dataSource.list[data.index].mainImgUrl = res.fileUrl;
    })
    .catch((error) => {
      console.log(error);
      handleSkuImageRemove(file);
      proxy.$message.warning('上传失败');
    })
    .finally(() => {
      console.log(111);
    });
};
const handleSkuImageRemove = (record) => {
  console.log(record);
  record.mainImgUrl = '';
};
</script>
