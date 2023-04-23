<template>
  <PageContainer>
    <a-card :bordered="false">
      <div class="topbox">
        <a-dropdown v-for="(item, index) in tabList" :key="item.id">
          <div
            class="box-item"
            :class="{ 'box-item-active': item.id === selectItemId }"
            @click="changeCategory(item)"
          >
            {{ item.name }}
          </div>
          <template #overlay>
            <a-menu @click="menuClick($event, item, index)">
              <a-menu-item key="1">
                <template #icon><edit-outlined /> </template>编辑</a-menu-item
              >
              <a-menu-item key="2">
                <template #icon><delete-outlined /> </template>删除</a-menu-item
              >
            </a-menu>
          </template>
        </a-dropdown>
        <!-- <div
          class="item"
          v-for="(item, index) in tabList"
          :key="index"
          :class="{ active: item.id === selectItemId }"
          @click="changeCategory(item, index)"
        >
          {{ item.name }}
        </div> -->
        <a-button type="primary" @click="addCategory(1)">新增一级类目</a-button>
      </div>

      <div class="bottombox">
        <template v-if="tabList && tabList.length > 0">
          <div class="line"></div>
          <div class="btnbox">
            <a-button type="primary" @click="addCategory(2)">新增二级类目</a-button>
            <!-- <a-button type="primary" @click="addCategory(3)">新增三级类目</a-button> -->
          </div>
          <a-table
            ref="table"
            size="default"
            row-key="id"
            :columns="columns"
            :data-source="dataSource.list"
            :loading="loading"
            :pagination="false"
            defaultExpandAllRows
            :expandRowByClick="true"
          >
            <template #bodyCell="{ column, record, index, text }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a @click="handleAdd(record)">添加子集</a>
                  <a @click="handleEdit(record)">编辑</a>
                  <a @click="deleteSub(record)" style="color: #ff4d4f">删除</a>
                </a-space>
              </template>
              <template v-else-if="column.key === 'img'">
                <a-image :width="40" :src="text" />
              </template>
              <template v-else-if="column.key === 'status'">
                <a-switch
                  v-model:checked="record.status"
                  :checkedValue="0"
                  :unCheckedValue="1"
                  @change="(checked) => changeStatus(checked, record, 1)"
                  :loading="record.loading"
                />
              </template>
              <template v-else-if="column.key === 'tooltip'">
                <a-tooltip>
                  <template #title>{{ text }}</template>
                  {{ text }}
                </a-tooltip>
              </template>
            </template>
          </a-table>
        </template>
      </div>
      <CategoryModal ref="cateGoryModal"></CategoryModal>
    </a-card>
  </PageContainer>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
import { categoryList, categoryDetail, categoryDelete, categoryEdit } from '@/api/system.js';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import CategoryModal from './components/CategoryModal.vue';

const { proxy } = getCurrentInstance();
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '25%',
    ellipsis: true,
    key: 'tooltip',
  },
  {
    title: '展示图片',
    dataIndex: 'imgUrl',
    key: 'img',
    with: '20%',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '15%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '25%',
    align: 'right',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    align: 'center',
  },
];
// 一级和二级
const addCategory = (type) => {
  proxy.$refs.cateGoryModal.show(type);
};

const selectItemId = ref(-1);
const categoryData = ref([]);

const loading = ref(false);
const dataSource = reactive({
  list: [],
});
const tabList = ref([]);
onMounted(() => {
  getCategoryList();
});
  const apiType = ref('');
  apiType.value = proxy.$route.meta.type 

// 选择品类
const changeCategory = (item) => {
  if (item.id === selectItemId.value) return;
  selectItemId.value = item.id;
  getTableList(item.id);
};
const getTableList = (id) => {
  loading.value = true;
  categoryList(apiType.value)
    .then((res) => {
      res.forEach((item) => {
        if (item.id === id) {
          dataSource.list = item.children;
        }
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

// 获取类目列表
const getCategoryList = () => {
  loading.value = true;
  categoryList(apiType.value)
    .then((res) => {
      tabList.value = res;
      if (res && res.length > 0) {
        changeCategory(res[0]);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 操作

const menuClick = ({ key }, record, index) => {
  if (key === '2') {
    proxy.$confirm({
      title: `确认删除${record.name}?`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        categoryDelete(apiType.value,record.id).then(() => {
          proxy.$message.success('删除成功');
          categoryData.value.splice(index, 1);
          if (record.id === selectItemId.value) {
            dataSource.category = [];
            dataSource.property = [];
            categoryData.value.length > 0 && changeCategory(categoryData.value[0]);
          }
        });
      },
    });
  } else {
    const params = { title: '编辑', ...record, type: 3 };
    proxy.$refs.categoryModal.show(params, []);
  }
};

const handleAdd = (record) => {};

const getcategoryDetail = (record) => {};

const changeStatus = (record, checked) => {
  record.loading = true;
  categoryEdit(apiType.value,{ ...record, status: checked ? 1 : 0 })
    .then(() => {
      proxy.$message.success('状态修改成功');
      record.status = checked ? 1 : 0;
    })
    .catch(() => {
      proxy.$message.warning('状态修改失败');
      record.status = checked ? 0 : 1;
    })
    .finally(() => {
      record.loading = false;
    });
};

const deleteSub = (record) => {
  proxy.$confirm({
    title: `确认删除该用户?`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      categoryDelete(apiType.value, record.id).then(() => {
        proxy.$message.success('删除成功');
        clearForm();
      });
    },
  });
};
</script>

<style lang="less" scoped>
.topbox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 16px;
  .box-item-active {
    color: #1890ff;
    border: 1px solid #1890ff;
  }
  .box-item {
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 16px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000a6;
    cursor: pointer;
  }
}
.line {
  height: 16px;
  background: #f0f2f5;
  margin: 0 -24px;
}
.bottombox {
  padding: 20px 0;
  box-sizing: border-box;
  .btnbox {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
    gap: 20px;
  }
}
</style>
